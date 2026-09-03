import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { runInThisContext } from 'node:vm';

const registrations = new Map();
const toasts = [];
const dialogs = [];

globalThis.ESYS_ShortcutKeyEffectiveEditorRange = Object.freeze({
	BLANK: 0,
	HOME: 1,
	SCHEMATIC_PAGE: 2,
	SYMBOL: 3,
	PCB: 4,
	FOOTPRINT: 5,
	PANEL: 6,
	PCB_3D_PREVIEW: 7,
	PCB_2D_PREVIEW: 8,
	PANEL_3D_PREVIEW: 9,
	PANEL_LIBRARY: 10,
	ASSEMBLY_VARIANT: 11,
	SIMULATION_SCHEMATIC_PAGE_NGSPICE: 12,
	SIMULATION_SCHEMATIC_PAGE_SIMULIDE: 13,
	SIMULATION_WAVEFORM: 14,
});

globalThis.ESYS_ShortcutKeyEffectiveEditorScene = Object.freeze({
	EDITOR: 1,
	CANVAS_SELECTED: 2,
	CANVAS_NOT_SELECT: 3,
	DRAWING: 4,
	PLACING: 5,
	LOCAL: 6,
});

globalThis.ESYS_ToastMessageType = Object.freeze({
	ERROR: 'error',
	WARNING: 'warn',
	INFO: 'info',
	SUCCESS: 'success',
	ASK: 'question',
});

globalThis.eda = {
	sys_Dialog: {
		showInformationMessage(content, title, buttonTitle) {
			dialogs.push({ content, title, buttonTitle });
		},
	},
	sys_I18n: {
		text(tag, _namespace, _language, ...args) {
			return args.reduce(
				(value, argument, index) => value.replaceAll(`\${${index + 1}}`, String(argument)),
				tag,
			);
		},
	},
	sys_Message: {
		showToastMessage(message, messageType, timer) {
			toasts.push({ message, messageType, timer });
		},
	},
	sys_ShortcutKey: {
		get(id) {
			return registrations.get(id);
		},
		register(id, props) {
			registrations.set(id, props);
			return true;
		},
	},
};

async function main() {
	const bundlePath = new URL('../dist/index.js', import.meta.url);
	const bundle = await readFile(bundlePath, 'utf8');
	const extension = runInThisContext(`${bundle}\nedaEsbuildExportName;`, {
		filename: bundlePath.pathname,
	});

	extension.activate('onStartupFinished');

	assert.equal(registrations.size, 2, 'activate() should register exactly two shortcuts');

	const primary = registrations.get('shared-action-primary');
	const secondary = registrations.get('shared-action-secondary');

	assert.ok(primary, 'primary shortcut should be registered');
	assert.ok(secondary, 'secondary shortcut should be registered');
	assert.deepEqual(primary.shortcutKey, ['CONTROL', 'ALT', 'SHIFT', 'F9']);
	assert.deepEqual(secondary.shortcutKey, ['CONTROL', 'ALT', 'SHIFT', 'F10']);
	assert.strictEqual(primary.callFn, secondary.callFn, 'both shortcuts must share one callback object');
	assert.strictEqual(primary.callFn, extension.runSharedAction, 'shortcut callback must be the exported menu action');
	assert.ok(primary.range.every(value => value !== undefined));
	assert.ok(primary.scene.every(value => value !== undefined));

	primary.callFn();
	secondary.callFn();

	assert.equal(toasts.length, 2, 'both shortcut callbacks should execute the shared action');
	assert.equal(toasts[0].message, 'action.executed');
	assert.equal(toasts[1].message, 'action.executed');

	extension.showShortcutStatus();
	extension.about();

	assert.equal(dialogs.length, 2, 'status and about menu actions should both open a dialog');

	console.log('Smoke test passed: two shortcuts share one action callback.');
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
