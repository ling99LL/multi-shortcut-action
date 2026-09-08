/**
 * 多快捷键动作 / Multi-Shortcut Action
 *
 * 两个独立快捷键注册项共享同一个回调函数，并提供一个可开关、仅在 PCB
 * 编辑器生效的阻挡/忽略布线模式快捷切换。每个快捷键都可以在嘉立创EDA
 * 的快捷键设置中单独修改。
 */
import extensionConfig from '../extension.json' with { type: 'json' };
import {
	ROUTING_MODE_BLOCK,
	ROUTING_MODE_IGNORE,
	ROUTING_MODE_PUSH,
	ROUTING_MODE_SURROUND,
	toggleBlockIgnoreRoutingModeInSource,
} from './routing-mode';

type ShortcutAction = 'shared' | 'routingMode';
type ShortcutScopeKind = 'all' | 'pcb';
type RuntimeEnum = Record<string, unknown>;
type RuntimeShortcutCallback = (shortcutKey?: TSYS_ShortcutKeys) => void | Promise<void>;
type ShortcutRegistrationMode = 'id' | 'legacy' | 'unavailable';

interface RuntimeShortcutData {
	shortcutKey?: TSYS_ShortcutKeys | null;
	title?: string;
	userDefinedShortcutKey?: TSYS_ShortcutKeys | null;
}

interface RuntimeShortcutRegistrationData {
	shortcutKey: TSYS_ShortcutKeys | null;
	title: string;
	remark: string;
	range: number[];
	scene: number[];
	callFn: RuntimeShortcutCallback;
}

interface RuntimeShortcutApi {
	registerShortcutKey?: (
		shortcutKey: TSYS_ShortcutKeys,
		title: string,
		callbackFn: RuntimeShortcutCallback,
		documentType?: number[],
		scene?: number[],
	) => boolean | Promise<boolean>;
	register?: (
		id: string,
		props: RuntimeShortcutRegistrationData,
	) => boolean | Promise<boolean>;
	getShortcutKeys?: (includeSystem?: boolean) => Promise<unknown> | unknown;
	get?: (id: string) => RuntimeShortcutData | Promise<RuntimeShortcutData | undefined> | undefined;
}

interface ShortcutDefinition {
	id: string;
	titleTag: string;
	defaultShortcut: TSYS_ShortcutKeys;
	action: ShortcutAction;
	remarkTag?: string;
	scope: ShortcutScopeKind;
}

interface ShortcutScope {
	range: number[];
	scene: number[];
}

const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
	{
		id: 'shared-action-primary',
		titleTag: 'shortcut.primary.title',
		defaultShortcut: ['CONTROL', 'ALT', 'SHIFT', 'F9'],
		action: 'shared',
		scope: 'all',
	},
	{
		id: 'shared-action-secondary',
		titleTag: 'shortcut.secondary.title',
		defaultShortcut: ['CONTROL', 'ALT', 'SHIFT', 'F10'],
		action: 'shared',
		scope: 'all',
	},
	{
		id: 'routing-mode-toggle',
		titleTag: 'shortcut.routingMode.title',
		defaultShortcut: ['SHIFT', 'R'],
		action: 'routingMode',
		remarkTag: 'shortcut.routingMode.remark',
		scope: 'pcb',
	},
];

// 新版 API 使用 Range 名称，旧版 API 使用 DocumentType 名称。两套枚举的
// 公共成员值由 EasyEDA 运行时提供，扩展不在运行时硬编码枚举值。
const RANGE_MEMBER_NAMES: readonly string[] = [
	'BLANK',
	'HOME',
	'SCHEMATIC_PAGE',
	'SYMBOL',
	'PCB',
	'FOOTPRINT',
	'PANEL',
	'PCB_3D_PREVIEW',
	'PCB_2D_PREVIEW',
	'PANEL_3D_PREVIEW',
	'PANEL_LIBRARY',
	'ASSEMBLY_VARIANT',
	'SIMULATION_SCHEMATIC_PAGE_NGSPICE',
	'SIMULATION_SCHEMATIC_PAGE_SIMULIDE',
	'SIMULATION_WAVEFORM',
];

const SCENE_MEMBER_NAMES: readonly (readonly string[])[] = [
	['EDITOR'],
	['CANVAS_SELECTED', 'SELECT_CANVAS'],
	['CANVAS_NOT_SELECT', 'NOT_SELECT_CANVAS'],
	['DRAWING', 'DRAW'],
	['PLACING', 'PLACE'],
	['LOCAL'],
];

const KEY_LABELS: Partial<Record<TSYS_ShortcutKeys[number], string>> = {
	CONTROL: 'Ctrl',
	LEFT_CONTROL: 'Left Ctrl',
	RIGHT_CONTROL: 'Right Ctrl',
	SHIFT: 'Shift',
	LEFT_SHIFT: 'Left Shift',
	RIGHT_SHIFT: 'Right Shift',
	ALT: 'Alt',
	LEFT_ALT: 'Left Alt',
	RIGHT_ALT: 'Right Alt',
	COMMAND: 'Command',
	OPTION: 'Option',
	SUPER: 'Super',
	WIN: 'Win',
};

const ROUTING_MODE_SWITCH_CONFIG_KEY = 'routingModeShortcutEnabled';

let executionCount = 0;
let routingModeSwitchEnabled = false;
let routingModeSwitchOperationInProgress = false;
let routingModeOperationInProgress = false;
let shortcutRegistrationMode: ShortcutRegistrationMode = 'unavailable';
let shortcutRegistrationAttempted = false;
let shortcutRegistrationError: string | undefined;
let shortcutRegistrationPromise: Promise<void> | undefined;
const shortcutRegistrationResults = new Map<string, boolean>();
const shortcutRegistrationErrors = new Map<string, string>();

function text(tag: string, ...args: unknown[]): string {
	return eda.sys_I18n.text(tag, undefined, undefined, ...args);
}

function formatError(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

function formatShortcut(shortcut: TSYS_ShortcutKeys | null | undefined): string {
	if (!shortcut?.length) {
		return text('shortcut.unassigned');
	}
	return shortcut.map(key => KEY_LABELS[key] ?? key).join(' + ');
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function getRuntimeRangeEnum(): RuntimeEnum | undefined {
	if (typeof ESYS_ShortcutKeyEffectiveEditorRange !== 'undefined') {
		return ESYS_ShortcutKeyEffectiveEditorRange as unknown as RuntimeEnum;
	}
	if (typeof ESYS_ShortcutKeyEffectiveEditorDocumentType !== 'undefined') {
		return ESYS_ShortcutKeyEffectiveEditorDocumentType;
	}
	return undefined;
}

function getRuntimeSceneEnum(): RuntimeEnum | undefined {
	if (typeof ESYS_ShortcutKeyEffectiveEditorScene === 'undefined') {
		return undefined;
	}
	return ESYS_ShortcutKeyEffectiveEditorScene as unknown as RuntimeEnum;
}

function resolveRuntimeEnumMember(runtimeEnum: RuntimeEnum, names: readonly string[]): number | undefined {
	for (const name of names) {
		const value = runtimeEnum[name];
		if (typeof value === 'number') {
			return value;
		}
	}
	return undefined;
}

function resolveRuntimeEnumMembers(runtimeEnum: RuntimeEnum, names: readonly string[]): number[] {
	return names.flatMap((name) => {
		const value = resolveRuntimeEnumMember(runtimeEnum, [name]);
		return value === undefined ? [] : [value];
	});
}

function resolveSceneValues(runtimeEnum: RuntimeEnum): number[] {
	const values: number[] = [];
	for (const names of SCENE_MEMBER_NAMES) {
		const value = resolveRuntimeEnumMember(runtimeEnum, names);
		if (value === undefined) {
			throw new Error(text('shortcut.runtimeEnumMemberUnavailable'));
		}
		values.push(value);
	}
	return values;
}

function resolveShortcutScope(definition: ShortcutDefinition): ShortcutScope {
	const rangeEnum = getRuntimeRangeEnum();
	const sceneEnum = getRuntimeSceneEnum();
	if (!rangeEnum || !sceneEnum) {
		throw new Error(text('shortcut.runtimeEnumUnavailable'));
	}

	const scene = resolveSceneValues(sceneEnum);
	if (definition.scope === 'pcb') {
		const pcb = resolveRuntimeEnumMember(rangeEnum, ['PCB']);
		if (pcb === undefined) {
			throw new Error(text('shortcut.runtimeEnumMemberUnavailable'));
		}
		return { range: [pcb], scene };
	}

	const range = resolveRuntimeEnumMembers(rangeEnum, RANGE_MEMBER_NAMES);
	if (range.length === 0) {
		throw new Error(text('shortcut.runtimeEnumMemberUnavailable'));
	}
	return { range, scene };
}

function getShortcutApi(): RuntimeShortcutApi {
	if (typeof eda === 'undefined') {
		throw new TypeError(text('shortcut.apiUnavailable'));
	}

	const shortcutApi = (eda as unknown as { sys_ShortcutKey?: unknown }).sys_ShortcutKey;
	if (!isRecord(shortcutApi)) {
		throw new Error(text('shortcut.apiUnavailable'));
	}
	return shortcutApi as RuntimeShortcutApi;
}

function detectShortcutRegistrationMode(api: RuntimeShortcutApi): ShortcutRegistrationMode {
	if (typeof api.register === 'function') {
		return 'id';
	}
	if (typeof api.registerShortcutKey === 'function') {
		return 'legacy';
	}
	return 'unavailable';
}

function getShortcutAction(action: ShortcutAction): RuntimeShortcutCallback {
	return action === 'routingMode' ? toggleRoutingConflictMode : runSharedAction;
}

async function registerShortcut(
	api: RuntimeShortcutApi,
	mode: ShortcutRegistrationMode,
	definition: ShortcutDefinition,
	scope: ShortcutScope,
): Promise<boolean> {
	const shortcutKey = [...definition.defaultShortcut] as TSYS_ShortcutKeys;
	const title = text(definition.titleTag);
	const callback = getShortcutAction(definition.action);

	if (mode === 'legacy') {
		if (typeof api.registerShortcutKey !== 'function') {
			return false;
		}
		return Boolean(await api.registerShortcutKey(
			shortcutKey,
			title,
			callback,
			scope.range,
			scope.scene,
		));
	}

	if (mode === 'id') {
		if (typeof api.register !== 'function') {
			return false;
		}
		return Boolean(await api.register(definition.id, {
			shortcutKey,
			title,
			remark: text(definition.remarkTag ?? 'shortcut.remark'),
			range: scope.range,
			scene: scope.scene,
			callFn: callback,
		}));
	}

	return false;
}

function showShortcutToast(message: string, messageType: ESYS_ToastMessageType, timer: number): void {
	eda.sys_Message.showToastMessage(message, messageType, timer);
}

function handleShortcutRegistrationError(error: unknown): void {
	const message = formatError(error);
	shortcutRegistrationError = message;
	for (const definition of SHORTCUT_DEFINITIONS) {
		if (!shortcutRegistrationResults.has(definition.id)) {
			shortcutRegistrationResults.set(definition.id, false);
		}
	}
	console.error(`[${extensionConfig.displayName}] Shortcut registration error:`, error);
	showShortcutToast(
		text('shortcut.registration.error', message),
		ESYS_ToastMessageType.ERROR,
		5,
	);
}

async function registerShortcuts(): Promise<void> {
	shortcutRegistrationAttempted = true;
	shortcutRegistrationMode = 'unavailable';
	shortcutRegistrationError = undefined;
	shortcutRegistrationResults.clear();
	shortcutRegistrationErrors.clear();

	try {
		const api = getShortcutApi();
		const mode = detectShortcutRegistrationMode(api);
		shortcutRegistrationMode = mode;
		if (mode === 'unavailable') {
			throw new Error(text('shortcut.apiUnavailable'));
		}

		const scopes = new Map<ShortcutScopeKind, ShortcutScope>();
		for (const definition of SHORTCUT_DEFINITIONS) {
			if (!scopes.has(definition.scope)) {
				scopes.set(definition.scope, resolveShortcutScope(definition));
			}
		}

		for (const definition of SHORTCUT_DEFINITIONS) {
			try {
				const scope = scopes.get(definition.scope);
				if (!scope) {
					throw new Error(text('shortcut.runtimeEnumUnavailable'));
				}
				const registered = await registerShortcut(api, mode, definition, scope);
				shortcutRegistrationResults.set(definition.id, registered);
				if (!registered) {
					shortcutRegistrationErrors.set(definition.id, text('shortcut.registration.resultFalse'));
				}
			}
			catch (error) {
				shortcutRegistrationResults.set(definition.id, false);
				shortcutRegistrationErrors.set(definition.id, formatError(error));
				console.error(`[${extensionConfig.displayName}] Failed to register ${definition.id}:`, error);
			}
		}

		const failedIds = SHORTCUT_DEFINITIONS
			.filter(definition => shortcutRegistrationResults.get(definition.id) !== true)
			.map(definition => definition.id);
		if (failedIds.length > 0) {
			console.error(`[${extensionConfig.displayName}] Shortcut registration failed: ${failedIds.join(', ')}`);
			showShortcutToast(
				text('shortcut.registration.partialFailure'),
				ESYS_ToastMessageType.WARNING,
				5,
			);
		}
		else {
			console.log(`[${extensionConfig.displayName}] Registered ${SHORTCUT_DEFINITIONS.length} shortcuts via ${mode}.`);
		}
	}
	catch (error) {
		handleShortcutRegistrationError(error);
	}
}

function ensureShortcutRegistration(): Promise<void> {
	if (!shortcutRegistrationPromise) {
		shortcutRegistrationPromise = registerShortcuts().catch((error) => {
			handleShortcutRegistrationError(error);
		});
	}
	return shortcutRegistrationPromise;
}

function loadRoutingModeSwitchState(): void {
	try {
		const storage = eda.sys_Storage;
		if (!storage || typeof storage.getExtensionUserConfig !== 'function') {
			return;
		}

		routingModeSwitchEnabled = storage.getExtensionUserConfig(ROUTING_MODE_SWITCH_CONFIG_KEY) === true;
	}
	catch (error) {
		console.error(`[${extensionConfig.displayName}] Failed to load routing mode switch state:`, error);
		routingModeSwitchEnabled = false;
	}
}

export function activate(status?: 'onStartupFinished', arg?: string): void {
	void status;
	void arg;
	loadRoutingModeSwitchState();
	void ensureShortcutRegistration();
}

/**
 * 供菜单诊断和自动化烟测等待异步快捷键注册完成。
 */
export async function waitForShortcutRegistration(): Promise<void> {
	await ensureShortcutRegistration();
}

/**
 * 顶部菜单和两个共享动作快捷键共同调用的唯一动作函数。
 */
export function runSharedAction(): void {
	executionCount += 1;
	showShortcutToast(
		text('action.executed', executionCount),
		ESYS_ToastMessageType.SUCCESS,
		3,
	);
}

function routingModeLabel(mode: number | undefined): string {
	switch (mode) {
		case ROUTING_MODE_IGNORE:
			return text('routingMode.ignore');
		case ROUTING_MODE_PUSH:
			return text('routingMode.push');
		case ROUTING_MODE_SURROUND:
			return text('routingMode.surround');
		case ROUTING_MODE_BLOCK:
			return text('routingMode.block');
		default:
			return text('routingMode.unknown', mode ?? '?');
	}
}

/**
 * 切换当前 PCB 文档的“阻挡”和“忽略”布线冲突模式。
 *
 * 文档源码接口是官方 BETA API；只修改 PREFERENCE 记录中的 routingMode，
 * 不模拟键盘事件，也不覆盖嘉立创EDA系统快捷键。
 */
export async function toggleRoutingConflictMode(): Promise<void> {
	if (!routingModeSwitchEnabled) {
		showShortcutToast(
			text('routingMode.switch.disabledHint'),
			ESYS_ToastMessageType.INFO,
			4,
		);
		return;
	}

	if (routingModeOperationInProgress) {
		showShortcutToast(
			text('routingMode.busy'),
			ESYS_ToastMessageType.WARNING,
			3,
		);
		return;
	}

	routingModeOperationInProgress = true;
	try {
		const fileManager = eda.sys_FileManager;
		if (
			!fileManager
			|| typeof fileManager.getDocumentSource !== 'function'
			|| typeof fileManager.setDocumentSource !== 'function'
		) {
			throw new Error(text('routingMode.apiUnavailable'));
		}

		const source = await fileManager.getDocumentSource();
		if (typeof source !== 'string' || source.length === 0) {
			throw new Error(text('routingMode.documentUnavailable'));
		}

		const update = toggleBlockIgnoreRoutingModeInSource(source);
		if (!update) {
			throw new Error(text('routingMode.notSupported'));
		}

		const updated = await fileManager.setDocumentSource(update.source);
		if (!updated) {
			throw new Error(text('routingMode.saveFailed'));
		}

		showShortcutToast(
			text(
				'routingMode.changed',
				routingModeLabel(update.previousMode),
				routingModeLabel(update.nextMode),
			),
			ESYS_ToastMessageType.SUCCESS,
			3,
		);
	}
	catch (error) {
		console.error(`[${extensionConfig.displayName}] Failed to toggle routing mode:`, error);
		showShortcutToast(
			text('routingMode.error', formatError(error)),
			ESYS_ToastMessageType.ERROR,
			5,
		);
	}
	finally {
		routingModeOperationInProgress = false;
	}
}

/**
 * 持久化开启或关闭 Shift+R 的阻挡/忽略快速切换。
 */
export async function toggleRoutingModeShortcut(): Promise<void> {
	if (routingModeSwitchOperationInProgress) {
		showShortcutToast(
			text('routingMode.switch.busy'),
			ESYS_ToastMessageType.WARNING,
			3,
		);
		return;
	}

	routingModeSwitchOperationInProgress = true;
	const nextState = !routingModeSwitchEnabled;
	try {
		const storage = eda.sys_Storage;
		if (!storage || typeof storage.setExtensionUserConfig !== 'function') {
			throw new Error(text('routingMode.switch.storageUnavailable'));
		}

		const saved = await storage.setExtensionUserConfig(ROUTING_MODE_SWITCH_CONFIG_KEY, nextState);
		if (!saved) {
			throw new Error(text('routingMode.switch.saveFailed'));
		}

		routingModeSwitchEnabled = nextState;
		showShortcutToast(
			text(nextState ? 'routingMode.switch.enabled' : 'routingMode.switch.disabled'),
			ESYS_ToastMessageType.SUCCESS,
			4,
		);
	}
	catch (error) {
		console.error(`[${extensionConfig.displayName}] Failed to change routing mode switch state:`, error);
		showShortcutToast(
			text('routingMode.switch.error', formatError(error)),
			ESYS_ToastMessageType.ERROR,
			5,
		);
	}
	finally {
		routingModeSwitchOperationInProgress = false;
	}
}

function normalizeShortcut(value: unknown): TSYS_ShortcutKeys | null | undefined {
	if (value === null) {
		return null;
	}
	if (!Array.isArray(value) || !value.every(key => typeof key === 'string')) {
		return undefined;
	}
	return value as TSYS_ShortcutKeys;
}

function normalizeShortcutData(value: unknown): RuntimeShortcutData | undefined {
	if (!isRecord(value)) {
		return undefined;
	}
	return {
		shortcutKey: normalizeShortcut(value.shortcutKey),
		title: typeof value.title === 'string' ? value.title : undefined,
		userDefinedShortcutKey: normalizeShortcut(value.userDefinedShortcutKey),
	};
}

async function readLegacyShortcutEntries(api: RuntimeShortcutApi): Promise<RuntimeShortcutData[]> {
	if (typeof api.getShortcutKeys !== 'function') {
		return [];
	}
	const result = await api.getShortcutKeys(false);
	if (!Array.isArray(result)) {
		return [];
	}
	return result
		.map(normalizeShortcutData)
		.filter((entry): entry is RuntimeShortcutData => entry !== undefined);
}

function sameShortcut(left: TSYS_ShortcutKeys | null | undefined, right: TSYS_ShortcutKeys): boolean {
	if (!left || left.length !== right.length) {
		return false;
	}
	return [...left].sort().join('|') === [...right].sort().join('|');
}

async function readIdShortcutData(api: RuntimeShortcutApi, definition: ShortcutDefinition): Promise<RuntimeShortcutData | undefined> {
	if (typeof api.get !== 'function') {
		return undefined;
	}
	const result = await api.get(definition.id);
	return normalizeShortcutData(result);
}

function shortcutApiLabel(mode: ShortcutRegistrationMode): string {
	switch (mode) {
		case 'id':
			return text('shortcut.status.apiId');
		case 'legacy':
			return text('shortcut.status.apiLegacy');
		default:
			return text('shortcut.status.apiUnavailable');
	}
}

function shortcutRegistrationLabel(): string {
	if (!shortcutRegistrationAttempted) {
		return text('shortcut.status.registrationPending');
	}
	const failedCount = SHORTCUT_DEFINITIONS.filter(
		definition => shortcutRegistrationResults.get(definition.id) !== true,
	).length;
	if (failedCount === 0 && shortcutRegistrationResults.size === SHORTCUT_DEFINITIONS.length) {
		return text('shortcut.status.registrationSuccess');
	}
	if (shortcutRegistrationError) {
		return text('shortcut.status.registrationError', shortcutRegistrationError);
	}
	return text('shortcut.status.registrationFailure', failedCount);
}

function shortcutRegistrationResultLabel(definition: ShortcutDefinition): string {
	const result = shortcutRegistrationResults.get(definition.id);
	if (result === true) {
		return text('shortcut.status.registrationOk');
	}
	const error = shortcutRegistrationErrors.get(definition.id);
	return error
		? text('shortcut.status.registrationItemError', error)
		: text('shortcut.status.registrationNotOk');
}

export async function showShortcutStatus(): Promise<void> {
	try {
		await ensureShortcutRegistration();
		const api = getShortcutApi();
		const legacyEntries = shortcutRegistrationMode === 'legacy'
			? await readLegacyShortcutEntries(api)
			: [];
		const routingSwitchStatus = routingModeSwitchEnabled
			? text('routingMode.switch.statusEnabled')
			: text('routingMode.switch.statusDisabled');
		const statusLines: string[] = [];

		for (const definition of SHORTCUT_DEFINITIONS) {
			const title = text(definition.titleTag);
			const registered = shortcutRegistrationMode === 'legacy'
				? legacyEntries.find(entry => entry.title === title
					|| sameShortcut(entry.shortcutKey, definition.defaultShortcut))
				: await readIdShortcutData(api, definition);

			if (!registered) {
				statusLines.push([
					title,
					`  ${text('shortcut.status.registration')}: ${shortcutRegistrationResultLabel(definition)}`,
					`  ${text('shortcut.status.notRegistered')}`,
				].join('\n'));
				continue;
			}

			if (shortcutRegistrationMode === 'legacy') {
				statusLines.push([
					title,
					`  ${text('shortcut.status.registration')}: ${shortcutRegistrationResultLabel(definition)}`,
					`  ${text('shortcut.status.legacyKey')}: ${formatShortcut(registered.shortcutKey)}`,
				].join('\n'));
				continue;
			}

			const hasUserDefinition = registered.userDefinedShortcutKey !== undefined;
			const effectiveShortcut = hasUserDefinition
				? registered.userDefinedShortcutKey
				: registered.shortcutKey;
			const source = hasUserDefinition
				? text('shortcut.status.userDefined')
				: text('shortcut.status.default');

			statusLines.push([
				title,
				`  ${text('shortcut.status.registration')}: ${shortcutRegistrationResultLabel(definition)}`,
				`  ${text('shortcut.status.defaultKey')}: ${formatShortcut(registered.shortcutKey)}`,
				`  ${text('shortcut.status.effectiveKey')}: ${formatShortcut(effectiveShortcut)} (${source})`,
			].join('\n'));
		}

		eda.sys_Dialog.showInformationMessage(
			[
				text('shortcut.status.api', shortcutApiLabel(shortcutRegistrationMode)),
				text('shortcut.status.registrationSummary', shortcutRegistrationLabel()),
				text('routingMode.switch.status', routingSwitchStatus),
				...statusLines,
			].join('\n\n'),
			text('shortcut.status.title'),
			text('dialog.close'),
		);
	}
	catch (error) {
		console.error(`[${extensionConfig.displayName}] Failed to read shortcut status:`, error);
		eda.sys_Dialog.showInformationMessage(
			text('shortcut.status.error', formatError(error)),
			text('shortcut.status.title'),
			text('dialog.close'),
		);
	}
}

export function about(): void {
	const routingModeShortcut = SHORTCUT_DEFINITIONS.find(definition => definition.action === 'routingMode');
	eda.sys_Dialog.showInformationMessage(
		[
			text('about.description'),
			'',
			text('about.defaultPrimary', formatShortcut(SHORTCUT_DEFINITIONS[0].defaultShortcut)),
			text('about.defaultSecondary', formatShortcut(SHORTCUT_DEFINITIONS[1].defaultShortcut)),
			text('about.defaultRoutingMode', formatShortcut(routingModeShortcut?.defaultShortcut)),
			text(
				'routingMode.switch.aboutStatus',
				routingModeSwitchEnabled
					? text('routingMode.switch.statusEnabled')
					: text('routingMode.switch.statusDisabled'),
			),
			'',
			text('about.settingsHint'),
			text('about.systemLimit'),
			text('about.betaNotice'),
			'',
			text('about.version', extensionConfig.version),
		].join('\n'),
		text('about.title'),
		text('dialog.close'),
	);
}
