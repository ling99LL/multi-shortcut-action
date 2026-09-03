/**
 * 多快捷键动作 / Multi-Shortcut Action
 *
 * 两个独立快捷键注册项共享同一个回调函数。每个快捷键都可以在
 * 嘉立创EDA的快捷键设置中单独修改。
 */
import extensionConfig from '../extension.json' with { type: 'json' };

interface ShortcutDefinition {
	id: string;
	titleTag: string;
	defaultShortcut: TSYS_ShortcutKeys;
}

const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
	{
		id: 'shared-action-primary',
		titleTag: 'shortcut.primary.title',
		defaultShortcut: ['CONTROL', 'ALT', 'SHIFT', 'F9'],
	},
	{
		id: 'shared-action-secondary',
		titleTag: 'shortcut.secondary.title',
		defaultShortcut: ['CONTROL', 'ALT', 'SHIFT', 'F10'],
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

let executionCount = 0;

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

function registerShortcut(definition: ShortcutDefinition): boolean {
	return eda.sys_ShortcutKey.register(definition.id, {
		shortcutKey: [...definition.defaultShortcut],
		title: text(definition.titleTag),
		remark: text('shortcut.remark'),
		range: [...EFFECTIVE_RANGES],
		scene: [...EFFECTIVE_SCENES],
		callFn: runSharedAction,
	});
}

export function activate(status?: 'onStartupFinished', arg?: string): void {
	void status;
	void arg;

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
 * 顶部菜单和两个快捷键共同调用的唯一动作函数。
 */
export function runSharedAction(): void {
	executionCount += 1;
	eda.sys_Message.showToastMessage(
		text('action.executed', executionCount),
		ESYS_ToastMessageType.SUCCESS,
		3,
	);
}

export function showShortcutStatus(): void {
	try {
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
			statusLines.join('\n\n'),
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
	eda.sys_Dialog.showInformationMessage(
		[
			text('about.description'),
			'',
			text('about.defaultPrimary', formatShortcut(SHORTCUT_DEFINITIONS[0].defaultShortcut)),
			text('about.defaultSecondary', formatShortcut(SHORTCUT_DEFINITIONS[1].defaultShortcut)),
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
