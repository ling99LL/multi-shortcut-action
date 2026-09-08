import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { runInThisContext } from 'node:vm';

const bundlePath = new URL('../dist/index.js', import.meta.url);
const placeholder = `${String.fromCharCode(36)}{1}`;

function replacePlaceholders(value, args) {
	return value.replace(/\$\{(\d+)\}/g, (_match, index) => String(args[Number(index) - 1] ?? ''));
}

function installEnums(kind) {
	Reflect.deleteProperty(globalThis, 'ESYS_ShortcutKeyEffectiveEditorRange');
	Reflect.deleteProperty(globalThis, 'ESYS_ShortcutKeyEffectiveEditorDocumentType');
	if (kind === 'legacy') {
		globalThis.ESYS_ShortcutKeyEffectiveEditorDocumentType = Object.freeze({
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
		});
		globalThis.ESYS_ShortcutKeyEffectiveEditorScene = Object.freeze({
			EDITOR: 1,
			SELECT_CANVAS: 2,
			NOT_SELECT_CANVAS: 3,
			DRAW: 4,
			PLACE: 5,
			LOCAL: 6,
		});
		return;
	}

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
}

function loadExtension(source) {
	return runInThisContext(`${source}\nedaEsbuildExportName;`, {
		filename: bundlePath.pathname,
	});
}

function createHarness(kind) {
	const registrations = new Map();
	const toasts = [];
	const dialogs = [];
	const documentSourceWrites = [];
	const userConfigs = new Map();
	let documentSource = [
		'{"type":"DOCHEAD","ticket":1}||{"docType":"PCB","uuid":"pcb-1"}|',
		'{"type":"PREFERENCE","ticket":1}||{"routingMode":3,"routingCorner":"L45","note":"brace } and delimiter ||",}|',
	].join('\n');

	const messages = new Map([
		['shortcut.status.api', `api:${placeholder}`],
		['shortcut.status.apiLegacy', 'legacy'],
		['shortcut.status.apiId', 'id'],
		['shortcut.status.registrationSummary', `summary:${placeholder}`],
		['shortcut.status.registrationSuccess', 'success'],
		['routingMode.switch.status', `routing-switch:${placeholder}`],
		['routingMode.switch.statusEnabled', 'enabled'],
		['routingMode.switch.statusDisabled', 'disabled'],
		['routingMode.switch.aboutStatus', `about-routing-switch:${placeholder}`],
	]);

	const sysShortcutKey = kind === 'legacy'
		? {
				async registerShortcutKey(shortcutKey, title, callbackFn, documentType, scene) {
					registrations.set(title, {
						shortcutKey: [...shortcutKey],
						title,
						callbackFn,
						documentType: [...documentType],
						scene: [...scene],
					});
					return true;
				},
				async getShortcutKeys() {
					return [...registrations.values()].map(({ shortcutKey, title, documentType, scene }) => ({
						shortcutKey,
						title,
						documentType,
						scene,
					}));
				},
			}
		: {
				register(id, props) {
					registrations.set(id, props);
					return true;
				},
				get(id) {
					return registrations.get(id);
				},
			};

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
				return replacePlaceholders(messages.get(tag) ?? tag, args);
			},
		},
		sys_Message: {
			showToastMessage(message, messageType, timer) {
				toasts.push({ message, messageType, timer });
			},
		},
		sys_ShortcutKey: sysShortcutKey,
		sys_FileManager: {
			async getDocumentSource() {
				return documentSource;
			},
			async setDocumentSource(source) {
				documentSource = source;
				documentSourceWrites.push(source);
				return true;
			},
		},
		sys_Storage: {
			getExtensionUserConfig(key) {
				return userConfigs.get(key);
			},
			async setExtensionUserConfig(key, value) {
				userConfigs.set(key, value);
				return true;
			},
		},
	};

	return {
		registrations,
		toasts,
		dialogs,
		documentSourceWrites,
		userConfigs,
		get documentSource() {
			return documentSource;
		},
		set documentSource(source) {
			documentSource = source;
		},
	};
}

async function runLegacySmokeTest(source) {
	installEnums('legacy');
	const harness = createHarness('legacy');
	const extension = loadExtension(source);

	extension.activate('onStartupFinished');
	await extension.waitForShortcutRegistration();

	assert.equal(harness.registrations.size, 3, 'legacy activate() should register three shortcuts');
	const primary = harness.registrations.get('shortcut.primary.title');
	const secondary = harness.registrations.get('shortcut.secondary.title');
	const routingMode = harness.registrations.get('shortcut.routingMode.title');
	assert.ok(primary, 'legacy primary shortcut should be registered');
	assert.ok(secondary, 'legacy secondary shortcut should be registered');
	assert.ok(routingMode, 'legacy routing shortcut should be registered');
	assert.deepEqual(primary.shortcutKey, ['CONTROL', 'ALT', 'SHIFT', 'F9']);
	assert.deepEqual(secondary.shortcutKey, ['CONTROL', 'ALT', 'SHIFT', 'F10']);
	assert.deepEqual(routingMode.shortcutKey, ['SHIFT', 'R']);
	assert.strictEqual(primary.callbackFn, secondary.callbackFn, 'legacy action shortcuts must share one callback');
	assert.strictEqual(primary.callbackFn, extension.runSharedAction);
	assert.strictEqual(routingMode.callbackFn, extension.toggleRoutingConflictMode);
	assert.deepEqual(routingMode.documentType, [4], 'legacy routing shortcut must be PCB-only');
	assert.deepEqual(routingMode.scene, [1, 2, 3, 4, 5, 6]);
	assert.deepEqual(primary.documentType, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

	primary.callbackFn();
	secondary.callbackFn();
	assert.equal(harness.toasts.length, 2, 'shared callbacks should execute');

	await routingMode.callbackFn();
	assert.equal(harness.documentSourceWrites.length, 0, 'disabled switch must not write');
	assert.equal(harness.toasts.at(-1).message, 'routingMode.switch.disabledHint');

	await extension.toggleRoutingModeShortcut();
	assert.equal(harness.userConfigs.get('routingModeShortcutEnabled'), true);
	await routingMode.callbackFn();
	assert.equal(harness.documentSourceWrites.length, 1);
	assert.match(harness.documentSource, /"routingMode":0/);
	await routingMode.callbackFn();
	assert.equal(harness.documentSourceWrites.length, 2);
	assert.match(harness.documentSource, /"routingMode":3/);

	// Other modes enter Block first, then the next press enters Ignore.
	harness.documentSource = '{"type":"PREFERENCE"}||{"routingMode":1}|';
	await routingMode.callbackFn();
	assert.match(harness.documentSource, /"routingMode":3/);
	harness.documentSource = '{"type":"PREFERENCE"}||{"routingMode":2}|';
	await routingMode.callbackFn();
	assert.match(harness.documentSource, /"routingMode":3/);
	harness.documentSource = '{"type":"PREFERENCE"}||{"routingMode":"NONE"}|';
	await routingMode.callbackFn();
	assert.match(harness.documentSource, /"routingMode":"OBSTRUCT"/);
	await routingMode.callbackFn();
	assert.match(harness.documentSource, /"routingMode":"NONE"/);
	harness.documentSource = '{"type":"PREFERENCE"}||{"routingMode":"SURROUND&PUSH"}|';
	await routingMode.callbackFn();
	assert.match(harness.documentSource, /"routingMode":"OBSTRUCT"/);

	// Also cover the array record form used by newer source serializers.
	harness.documentSource = '["PREFERENCE",{"routingMode":0,"nested":{"text":"[]"}}]|';
	await routingMode.callbackFn();
	assert.match(harness.documentSource, /\["PREFERENCE",\{"routingMode":3/);

	await extension.toggleRoutingModeShortcut();
	const writesBeforeDisabledSource = harness.documentSourceWrites.length;
	await routingMode.callbackFn();
	assert.equal(harness.documentSourceWrites.length, writesBeforeDisabledSource);
	assert.equal(harness.toasts.at(-1).message, 'routingMode.switch.disabledHint');
	await extension.toggleRoutingModeShortcut();

	const writesBeforeUnsupportedSource = harness.documentSourceWrites.length;
	harness.documentSource = '{"type":"DOCHEAD"}||{"docType":"PCB"}|';
	const originalConsoleError = console.error;
	console.error = () => {};
	try {
		await routingMode.callbackFn();
	}
	finally {
		console.error = originalConsoleError;
	}
	assert.equal(harness.documentSourceWrites.length, writesBeforeUnsupportedSource);
	assert.equal(harness.toasts.at(-1).message, 'routingMode.error');

	await extension.showShortcutStatus();
	assert.equal(harness.dialogs.length, 1);
	assert.match(harness.dialogs[0].content, /api:legacy/);
	assert.match(harness.dialogs[0].content, /success/);
	assert.match(harness.dialogs[0].content, /shortcut\.status\.legacyKey/);
	extension.about();
	assert.equal(harness.dialogs.length, 2);
	assert.ok(harness.dialogs[1].content.includes('about.defaultRoutingMode'));
}

async function runIdApiSmokeTest(source) {
	installEnums('id');
	const harness = createHarness('id');
	const extension = loadExtension(source);

	extension.activate('onStartupFinished');
	await extension.waitForShortcutRegistration();

	assert.equal(harness.registrations.size, 3, 'ID API should register three shortcuts');
	const primary = harness.registrations.get('shared-action-primary');
	const secondary = harness.registrations.get('shared-action-secondary');
	const routingMode = harness.registrations.get('routing-mode-toggle');
	assert.ok(primary && secondary && routingMode);
	assert.deepEqual(primary.shortcutKey, ['CONTROL', 'ALT', 'SHIFT', 'F9']);
	assert.deepEqual(routingMode.shortcutKey, ['SHIFT', 'R']);
	assert.strictEqual(primary.callFn, secondary.callFn);
	assert.strictEqual(primary.callFn, extension.runSharedAction);
	assert.strictEqual(routingMode.callFn, extension.toggleRoutingConflictMode);
	assert.deepEqual(routingMode.range, [4]);
	assert.deepEqual(routingMode.scene, [1, 2, 3, 4, 5, 6]);
	assert.equal(primary.range.length, 15);

	harness.registrations.get('shared-action-primary').userDefinedShortcutKey = ['ALT', 'F9'];
	await extension.showShortcutStatus();
	assert.match(harness.dialogs[0].content, /api:id/);
	assert.match(harness.dialogs[0].content, /Alt \+ F9/);
}

async function main() {
	const source = await readFile(bundlePath, 'utf8');
	await runLegacySmokeTest(source);
	await runIdApiSmokeTest(source);
	console.log('Smoke test passed: legacy/new shortcut registration, diagnostics, persistence, and Block/Ignore routing toggle are exercised.');
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
