/**
 * 多快捷键动作 / Multi-Shortcut Action
 *
 * 两个独立快捷键注册项共享同一个回调函数，并提供一个可开关、仅在 PCB
 * 编辑器生效的阻挡/环绕布线模式快捷切换。每个快捷键都可以在嘉立创EDA
 * 的快捷键设置中单独修改。
 */
import extensionConfig from '../extension.json' with { type: 'json' };
import {
	ROUTING_MODE_BLOCK,
	ROUTING_MODE_IGNORE,
	ROUTING_MODE_PUSH,
	ROUTING_MODE_SURROUND,
	toggleBlockSurroundRoutingModeInSource,
} from './routing-mode';

type ShortcutAction = 'shared' | 'routingMode';

interface ShortcutDefinition {
	id: string;
	titleTag: string;
	defaultShortcut: TSYS_ShortcutKeys;
	action: ShortcutAction;
	remarkTag?: string;
	range?: ESYS_ShortcutKeyEffectiveEditorRange[];
}

const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
	{
		id: 'shared-action-primary',
		titleTag: 'shortcut.primary.title',
		defaultShortcut: ['CONTROL', 'ALT', 'SHIFT', 'F9'],
		action: 'shared',
	},
	{
		id: 'shared-action-secondary',
		titleTag: 'shortcut.secondary.title',
		defaultShortcut: ['CONTROL', 'ALT', 'SHIFT', 'F10'],
		action: 'shared',
	},
	{
		id: 'routing-mode-toggle',
		titleTag: 'shortcut.routingMode.title',
		defaultShortcut: ['SHIFT', 'R'],
		action: 'routingMode',
		remarkTag: 'shortcut.routingMode.remark',
		range: [ESYS_ShortcutKeyEffectiveEditorRange.PCB],
	},
];

const EFFECTIVE_RANGES: ESYS_ShortcutKeyEffectiveEditorRange[] = [
	ESYS_ShortcutKeyEffectiveEditorRange.BLANK,
	ESYS_ShortcutKeyEffectiveEditorRange.HOME,
	ESYS_ShortcutKeyEffectiveEditorRange.SCHEMATIC_PAGE,
	ESYS_ShortcutKeyEffectiveEditorRange.SYMBOL,
	ESYS_ShortcutKeyEffectiveEditorRange.PCB,
	ESYS_ShortcutKeyEffectiveEditorRange.FOOTPRINT,
	ESYS_ShortcutKeyEffectiveEditorRange.PANEL,
	ESYS_ShortcutKeyEffectiveEditorRange.PCB_3D_PREVIEW,
	ESYS_ShortcutKeyEffectiveEditorRange.PCB_2D_PREVIEW,
	ESYS_ShortcutKeyEffectiveEditorRange.PANEL_3D_PREVIEW,
	ESYS_ShortcutKeyEffectiveEditorRange.PANEL_LIBRARY,
	ESYS_ShortcutKeyEffectiveEditorRange.ASSEMBLY_VARIANT,
	ESYS_ShortcutKeyEffectiveEditorRange.SIMULATION_SCHEMATIC_PAGE_NGSPICE,
	ESYS_ShortcutKeyEffectiveEditorRange.SIMULATION_SCHEMATIC_PAGE_SIMULIDE,
	ESYS_ShortcutKeyEffectiveEditorRange.SIMULATION_WAVEFORM,
];

const EFFECTIVE_SCENES: ESYS_ShortcutKeyEffectiveEditorScene[] = [
	ESYS_ShortcutKeyEffectiveEditorScene.EDITOR,
	ESYS_ShortcutKeyEffectiveEditorScene.CANVAS_SELECTED,
	ESYS_ShortcutKeyEffectiveEditorScene.CANVAS_NOT_SELECT,
	ESYS_ShortcutKeyEffectiveEditorScene.DRAWING,
	ESYS_ShortcutKeyEffectiveEditorScene.PLACING,
	ESYS_ShortcutKeyEffectiveEditorScene.LOCAL,
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

function getShortcutAction(action: ShortcutAction): () => void | Promise<void> {
	return action === 'routingMode' ? toggleRoutingConflictMode : runSharedAction;
}

function registerShortcut(definition: ShortcutDefinition): boolean {
	return eda.sys_ShortcutKey.register(definition.id, {
		shortcutKey: [...definition.defaultShortcut],
		title: text(definition.titleTag),
		remark: text(definition.remarkTag ?? 'shortcut.remark'),
		range: [...(definition.range ?? EFFECTIVE_RANGES)],
		scene: [...EFFECTIVE_SCENES],
		callFn: getShortcutAction(definition.action),
	});
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

	try {
		const failedIds = SHORTCUT_DEFINITIONS
			.filter(definition => !registerShortcut(definition))
			.map(definition => definition.id);

		if (failedIds.length > 0) {
			console.error(`[${extensionConfig.displayName}] Shortcut registration failed: ${failedIds.join(', ')}`);
			eda.sys_Message.showToastMessage(
				text('shortcut.registration.partialFailure'),
				ESYS_ToastMessageType.WARNING,
				5,
			);
		}
	}
	catch (error) {
		console.error(`[${extensionConfig.displayName}] Shortcut registration error:`, error);
		eda.sys_Message.showToastMessage(
			text('shortcut.registration.error', formatError(error)),
			ESYS_ToastMessageType.ERROR,
			5,
		);
	}
}

/**
 * 顶部菜单和两个共享动作快捷键共同调用的唯一动作函数。
 */
export function runSharedAction(): void {
	executionCount += 1;
	eda.sys_Message.showToastMessage(
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
 * 切换当前 PCB 文档的“阻挡”和“环绕”布线冲突模式。
 *
 * 文档源码接口是官方 BETA API；只修改 PREFERENCE 记录中的 routingMode，
 * 不模拟键盘事件，也不覆盖嘉立创EDA系统快捷键。
 */
export async function toggleRoutingConflictMode(): Promise<void> {
	if (!routingModeSwitchEnabled) {
		eda.sys_Message.showToastMessage(
			text('routingMode.switch.disabledHint'),
			ESYS_ToastMessageType.INFO,
			4,
		);
		return;
	}

	if (routingModeOperationInProgress) {
		eda.sys_Message.showToastMessage(
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

		const update = toggleBlockSurroundRoutingModeInSource(source);
		if (!update) {
			throw new Error(text('routingMode.notSupported'));
		}

		const updated = await fileManager.setDocumentSource(update.source);
		if (!updated) {
			throw new Error(text('routingMode.saveFailed'));
		}

		eda.sys_Message.showToastMessage(
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
		eda.sys_Message.showToastMessage(
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
 * 持久化开启或关闭 Shift+R 的阻挡/环绕快速切换。
 */
export async function toggleRoutingModeShortcut(): Promise<void> {
	if (routingModeSwitchOperationInProgress) {
		eda.sys_Message.showToastMessage(
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
		eda.sys_Message.showToastMessage(
			text(nextState ? 'routingMode.switch.enabled' : 'routingMode.switch.disabled'),
			ESYS_ToastMessageType.SUCCESS,
			4,
		);
	}
	catch (error) {
		console.error(`[${extensionConfig.displayName}] Failed to change routing mode switch state:`, error);
		eda.sys_Message.showToastMessage(
			text('routingMode.switch.error', formatError(error)),
			ESYS_ToastMessageType.ERROR,
			5,
		);
	}
	finally {
		routingModeSwitchOperationInProgress = false;
	}
}

export function showShortcutStatus(): void {
	try {
		const routingSwitchStatus = routingModeSwitchEnabled
			? text('routingMode.switch.statusEnabled')
			: text('routingMode.switch.statusDisabled');
		const statusLines = SHORTCUT_DEFINITIONS.map((definition) => {
			const registered = eda.sys_ShortcutKey.get(definition.id);
			if (!registered) {
				return `${text(definition.titleTag)}\n  ${text('shortcut.status.notRegistered')}`;
			}

			const hasUserDefinition = registered.userDefinedShortcutKey !== undefined;
			const effectiveShortcut = hasUserDefinition
				? registered.userDefinedShortcutKey
				: registered.shortcutKey;
			const source = hasUserDefinition
				? text('shortcut.status.userDefined')
				: text('shortcut.status.default');

			return [
				text(definition.titleTag),
				`  ${text('shortcut.status.defaultKey')}: ${formatShortcut(registered.shortcutKey)}`,
				`  ${text('shortcut.status.effectiveKey')}: ${formatShortcut(effectiveShortcut)} (${source})`,
			].join('\n');
		});

		eda.sys_Dialog.showInformationMessage(
			[
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
