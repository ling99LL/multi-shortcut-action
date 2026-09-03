"use strict";
var edaEsbuildExportName = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    about: () => about,
    activate: () => activate,
    runSharedAction: () => runSharedAction,
    showShortcutStatus: () => showShortcutStatus
  });

  // extension.json
  var extension_default = {
    name: "multi-shortcut-action",
    uuid: "fc3eb57005174eb08b1858b99e4f1f02",
    displayName: "\u591A\u5FEB\u6377\u952E\u52A8\u4F5C",
    description: "\u8BA9\u9876\u90E8\u83DC\u5355\u3001\u4E3B\u5FEB\u6377\u952E\u548C\u5907\u7528\u5FEB\u6377\u952E\u5171\u540C\u89E6\u53D1\u540C\u4E00\u4E2A\u63D2\u4EF6\u52A8\u4F5C\uFF0C\u4E24\u4E2A\u5FEB\u6377\u952E\u5747\u53EF\u5728\u8BBE\u7F6E\u4E2D\u4FEE\u6539\u3002",
    version: "1.0.0",
    publisher: "\u9E22\u67AD",
    engines: {
      eda: "^4.2.0"
    },
    license: "Apache-2.0",
    repository: {
      type: "git",
      url: "https://github.com/ling99LL/multi-shortcut-action.git"
    },
    categories: "Other",
    keywords: [
      "Shortcut",
      "Hotkey",
      "Productivity",
      "Tool"
    ],
    images: {
      logo: "./images/multi-shortcut-action.png"
    },
    homepage: "https://github.com/ling99LL/multi-shortcut-action#readme",
    bugs: "https://github.com/ling99LL/multi-shortcut-action/issues",
    activationEvents: {},
    entry: "./dist/index",
    dependentExtensions: {},
    headerMenus: {
      home: [
        {
          id: "multi-shortcut-action-home",
          title: "\u591A\u5FEB\u6377\u952E",
          menuItems: [
            {
              id: "multi-shortcut-action-run-home",
              title: "\u6267\u884C\u5171\u4EAB\u52A8\u4F5C",
              registerFn: "runSharedAction"
            },
            {
              id: "multi-shortcut-action-status-home",
              title: "\u67E5\u770B\u5FEB\u6377\u952E\u72B6\u6001",
              registerFn: "showShortcutStatus"
            },
            {
              id: "multi-shortcut-action-about-home",
              title: "\u5173\u4E8E...",
              registerFn: "about"
            }
          ]
        }
      ],
      sch: [
        {
          id: "multi-shortcut-action-sch",
          title: "\u591A\u5FEB\u6377\u952E",
          menuItems: [
            {
              id: "multi-shortcut-action-run-sch",
              title: "\u6267\u884C\u5171\u4EAB\u52A8\u4F5C",
              registerFn: "runSharedAction"
            },
            {
              id: "multi-shortcut-action-status-sch",
              title: "\u67E5\u770B\u5FEB\u6377\u952E\u72B6\u6001",
              registerFn: "showShortcutStatus"
            },
            {
              id: "multi-shortcut-action-about-sch",
              title: "\u5173\u4E8E...",
              registerFn: "about"
            }
          ]
        }
      ],
      pcb: [
        {
          id: "multi-shortcut-action-pcb",
          title: "\u591A\u5FEB\u6377\u952E",
          menuItems: [
            {
              id: "multi-shortcut-action-run-pcb",
              title: "\u6267\u884C\u5171\u4EAB\u52A8\u4F5C",
              registerFn: "runSharedAction"
            },
            {
              id: "multi-shortcut-action-status-pcb",
              title: "\u67E5\u770B\u5FEB\u6377\u952E\u72B6\u6001",
              registerFn: "showShortcutStatus"
            },
            {
              id: "multi-shortcut-action-about-pcb",
              title: "\u5173\u4E8E...",
              registerFn: "about"
            }
          ]
        }
      ]
    }
  };

  // src/index.ts
  var SHORTCUT_DEFINITIONS = [
    {
      id: "shared-action-primary",
      titleTag: "shortcut.primary.title",
      defaultShortcut: ["CONTROL", "ALT", "SHIFT", "F9"]
    },
    {
      id: "shared-action-secondary",
      titleTag: "shortcut.secondary.title",
      defaultShortcut: ["CONTROL", "ALT", "SHIFT", "F10"]
    }
  ];
  var EFFECTIVE_RANGES = [
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
    ESYS_ShortcutKeyEffectiveEditorRange.SIMULATION_WAVEFORM
  ];
  var EFFECTIVE_SCENES = [
    ESYS_ShortcutKeyEffectiveEditorScene.EDITOR,
    ESYS_ShortcutKeyEffectiveEditorScene.CANVAS_SELECTED,
    ESYS_ShortcutKeyEffectiveEditorScene.CANVAS_NOT_SELECT,
    ESYS_ShortcutKeyEffectiveEditorScene.DRAWING,
    ESYS_ShortcutKeyEffectiveEditorScene.PLACING,
    ESYS_ShortcutKeyEffectiveEditorScene.LOCAL
  ];
  var KEY_LABELS = {
    CONTROL: "Ctrl",
    LEFT_CONTROL: "Left Ctrl",
    RIGHT_CONTROL: "Right Ctrl",
    SHIFT: "Shift",
    LEFT_SHIFT: "Left Shift",
    RIGHT_SHIFT: "Right Shift",
    ALT: "Alt",
    LEFT_ALT: "Left Alt",
    RIGHT_ALT: "Right Alt",
    COMMAND: "Command",
    OPTION: "Option",
    SUPER: "Super",
    WIN: "Win"
  };
  var executionCount = 0;
  function text(tag, ...args) {
    return eda.sys_I18n.text(tag, void 0, void 0, ...args);
  }
  function formatError(error) {
    return error instanceof Error ? error.message : String(error);
  }
  function formatShortcut(shortcut) {
    if (!shortcut?.length) {
      return text("shortcut.unassigned");
    }
    return shortcut.map((key) => KEY_LABELS[key] ?? key).join(" + ");
  }
  function registerShortcut(definition) {
    return eda.sys_ShortcutKey.register(definition.id, {
      shortcutKey: [...definition.defaultShortcut],
      title: text(definition.titleTag),
      remark: text("shortcut.remark"),
      range: [...EFFECTIVE_RANGES],
      scene: [...EFFECTIVE_SCENES],
      callFn: runSharedAction
    });
  }
  function activate(status, arg) {
    try {
      const failedIds = SHORTCUT_DEFINITIONS.filter((definition) => !registerShortcut(definition)).map((definition) => definition.id);
      if (failedIds.length > 0) {
        console.error(`[${extension_default.displayName}] Shortcut registration failed: ${failedIds.join(", ")}`);
        eda.sys_Message.showToastMessage(
          text("shortcut.registration.partialFailure"),
          ESYS_ToastMessageType.WARNING,
          5
        );
      }
    } catch (error) {
      console.error(`[${extension_default.displayName}] Shortcut registration error:`, error);
      eda.sys_Message.showToastMessage(
        text("shortcut.registration.error", formatError(error)),
        ESYS_ToastMessageType.ERROR,
        5
      );
    }
  }
  function runSharedAction() {
    executionCount += 1;
    eda.sys_Message.showToastMessage(
      text("action.executed", executionCount),
      ESYS_ToastMessageType.SUCCESS,
      3
    );
  }
  function showShortcutStatus() {
    try {
      const statusLines = SHORTCUT_DEFINITIONS.map((definition) => {
        const registered = eda.sys_ShortcutKey.get(definition.id);
        if (!registered) {
          return `${text(definition.titleTag)}
  ${text("shortcut.status.notRegistered")}`;
        }
        const hasUserDefinition = registered.userDefinedShortcutKey !== void 0;
        const effectiveShortcut = hasUserDefinition ? registered.userDefinedShortcutKey : registered.shortcutKey;
        const source = hasUserDefinition ? text("shortcut.status.userDefined") : text("shortcut.status.default");
        return [
          text(definition.titleTag),
          `  ${text("shortcut.status.defaultKey")}: ${formatShortcut(registered.shortcutKey)}`,
          `  ${text("shortcut.status.effectiveKey")}: ${formatShortcut(effectiveShortcut)} (${source})`
        ].join("\n");
      });
      eda.sys_Dialog.showInformationMessage(
        statusLines.join("\n\n"),
        text("shortcut.status.title"),
        text("dialog.close")
      );
    } catch (error) {
      console.error(`[${extension_default.displayName}] Failed to read shortcut status:`, error);
      eda.sys_Dialog.showInformationMessage(
        text("shortcut.status.error", formatError(error)),
        text("shortcut.status.title"),
        text("dialog.close")
      );
    }
  }
  function about() {
    eda.sys_Dialog.showInformationMessage(
      [
        text("about.description"),
        "",
        text("about.defaultPrimary", formatShortcut(SHORTCUT_DEFINITIONS[0].defaultShortcut)),
        text("about.defaultSecondary", formatShortcut(SHORTCUT_DEFINITIONS[1].defaultShortcut)),
        "",
        text("about.settingsHint"),
        text("about.systemLimit"),
        text("about.betaNotice"),
        "",
        text("about.version", extension_default.version)
      ].join("\n"),
      text("about.title"),
      text("dialog.close")
    );
  }
  return __toCommonJS(src_exports);
})();
