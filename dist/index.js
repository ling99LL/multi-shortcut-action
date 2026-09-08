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
    showShortcutStatus: () => showShortcutStatus,
    toggleRoutingConflictMode: () => toggleRoutingConflictMode,
    toggleRoutingModeShortcut: () => toggleRoutingModeShortcut,
    waitForShortcutRegistration: () => waitForShortcutRegistration
  });

  // extension.json
  var extension_default = {
    name: "multi-shortcut-action",
    uuid: "fc3eb57005174eb08b1858b99e4f1f02",
    displayName: "\u591A\u5FEB\u6377\u952E\u52A8\u4F5C",
    description: "\u8BA9\u9876\u90E8\u83DC\u5355\u3001\u4E3B\u5FEB\u6377\u952E\u548C\u5907\u7528\u5FEB\u6377\u952E\u5171\u540C\u89E6\u53D1\u540C\u4E00\u4E2A\u63D2\u4EF6\u52A8\u4F5C\uFF0C\u5E76\u63D0\u4F9B\u53EF\u5F00\u5173\u7684PCB\u5E03\u7EBF\u6A21\u5F0F\u5FEB\u6377\u5207\u6362\uFF1B\u5F00\u542F\u540E\u6309Shift+R\u4EC5\u5728\u963B\u6321\u548C\u5FFD\u7565\u4E4B\u95F4\u5207\u6362\uFF0C\u6240\u6709\u5FEB\u6377\u952E\u5747\u53EF\u5728\u8BBE\u7F6E\u4E2D\u4FEE\u6539\u3002",
    version: "1.3.1",
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
      "Tool",
      "PCB",
      "Routing"
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
              id: "multi-shortcut-action-routing-mode-switch-home",
              title: "\u5F00\u5173\uFF1AShift+R \u4EC5\u5207\u6362\u963B\u6321/\u5FFD\u7565",
              registerFn: "toggleRoutingModeShortcut"
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
              id: "multi-shortcut-action-routing-mode-pcb",
              title: "\u5F00\u5173\uFF1AShift+R \u4EC5\u5207\u6362\u963B\u6321/\u5FFD\u7565",
              registerFn: "toggleRoutingModeShortcut"
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

  // src/routing-mode.ts
  var ROUTING_MODE_IGNORE = 0;
  var ROUTING_MODE_PUSH = 1;
  var ROUTING_MODE_SURROUND = 2;
  var ROUTING_MODE_BLOCK = 3;
  function isJsonObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  function removeTrailingCommas(value) {
    let normalized = "";
    let inString = false;
    let escaped = false;
    for (let index = 0; index < value.length; index += 1) {
      const character = value[index];
      if (inString) {
        normalized += character;
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === '"') {
          inString = false;
        }
        continue;
      }
      if (character === '"') {
        inString = true;
        normalized += character;
        continue;
      }
      if (character === ",") {
        let nextIndex = index + 1;
        while (/\s/.test(value[nextIndex] ?? "")) {
          nextIndex += 1;
        }
        if (value[nextIndex] === "}" || value[nextIndex] === "]") {
          continue;
        }
      }
      normalized += character;
    }
    return normalized;
  }
  function parseJsonText(value) {
    try {
      return JSON.parse(value);
    } catch {
      try {
        return JSON.parse(removeTrailingCommas(value));
      } catch {
        return void 0;
      }
    }
  }
  function parseJsonValueAt(source, start) {
    const firstCharacter = source[start];
    if (firstCharacter !== "{" && firstCharacter !== "[") {
      return void 0;
    }
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let index = start; index < source.length; index += 1) {
      const character = source[index];
      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (character === "\\") {
          escaped = true;
        } else if (character === '"') {
          inString = false;
        }
        continue;
      }
      if (character === '"') {
        inString = true;
      } else if (character === "{" || character === "[") {
        depth += 1;
      } else if (character === "}" || character === "]") {
        depth -= 1;
        if (depth === 0) {
          const value = parseJsonText(source.slice(start, index + 1));
          if (value === void 0) {
            return void 0;
          }
          return { start, end: index + 1, value };
        }
        if (depth < 0) {
          return void 0;
        }
      }
    }
    return void 0;
  }
  function skipWhitespace(source, start) {
    let index = start;
    while (/\s/.test(source[index] ?? "")) {
      index += 1;
    }
    return index;
  }
  function getRoutingModeValue(body) {
    const value = body.routingMode;
    if (typeof value === "number" && Number.isFinite(value)) {
      return {
        mode: value,
        encode: (mode) => mode
      };
    }
    if (typeof value === "string" && value.trim() !== "") {
      const normalizedValue = value.trim().toUpperCase();
      const symbolicModes = {
        NONE: ROUTING_MODE_IGNORE,
        IGNORE: ROUTING_MODE_IGNORE,
        PUSH: ROUTING_MODE_PUSH,
        SURROUND: ROUTING_MODE_SURROUND,
        OBSTRUCT: ROUTING_MODE_BLOCK,
        BLOCK: ROUTING_MODE_BLOCK
      };
      const symbolicMode = symbolicModes[normalizedValue];
      if (symbolicMode !== void 0) {
        return {
          mode: symbolicMode,
          encode: (mode) => mode === ROUTING_MODE_IGNORE ? "NONE" : "OBSTRUCT"
        };
      }
      const numericValue = Number(value);
      if (Number.isFinite(numericValue)) {
        return {
          mode: numericValue,
          encode: (mode) => String(mode)
        };
      }
      return {
        mode: void 0,
        encode: (mode) => mode === ROUTING_MODE_IGNORE ? "NONE" : "OBSTRUCT"
      };
    }
    return {
      mode: void 0,
      encode: (mode) => mode
    };
  }
  function findRoutingModeTarget(source) {
    for (let cursor = 0; cursor < source.length; cursor += 1) {
      const character = source[cursor];
      if (character !== "{" && character !== "[") {
        continue;
      }
      const parsed = parseJsonValueAt(source, cursor);
      if (!parsed) {
        continue;
      }
      if (isJsonObject(parsed.value) && parsed.value.type === "PREFERENCE") {
        if ("routingMode" in parsed.value) {
          return {
            start: parsed.start,
            end: parsed.end,
            body: parsed.value,
            wrap: (body2) => body2
          };
        }
        let bodyStart = skipWhitespace(source, parsed.end);
        if (source.slice(bodyStart, bodyStart + 2) !== "||") {
          cursor = parsed.end - 1;
          continue;
        }
        bodyStart = skipWhitespace(source, bodyStart + 2);
        const body = parseJsonValueAt(source, bodyStart);
        if (body && isJsonObject(body.value)) {
          return {
            start: body.start,
            end: body.end,
            body: body.value,
            wrap: (value) => value
          };
        }
      }
      if (Array.isArray(parsed.value) && parsed.value[0] === "PREFERENCE" && isJsonObject(parsed.value[1])) {
        const body = parsed.value[1];
        return {
          start: parsed.start,
          end: parsed.end,
          body,
          wrap: (value) => {
            const record = [...parsed.value];
            record[1] = value;
            return record;
          }
        };
      }
      cursor = parsed.end - 1;
    }
    return void 0;
  }
  function toggleBlockIgnoreRoutingModeInSource(source) {
    const target = findRoutingModeTarget(source);
    if (!target) {
      return void 0;
    }
    const routingModeValue = getRoutingModeValue(target.body);
    const previousMode = routingModeValue.mode;
    const nextMode = previousMode === ROUTING_MODE_BLOCK ? ROUTING_MODE_IGNORE : ROUTING_MODE_BLOCK;
    const updatedBody = { ...target.body, routingMode: routingModeValue.encode(nextMode) };
    const replacement = JSON.stringify(target.wrap(updatedBody));
    if (replacement === void 0) {
      return void 0;
    }
    return {
      source: `${source.slice(0, target.start)}${replacement}${source.slice(target.end)}`,
      previousMode,
      nextMode
    };
  }

  // src/index.ts
  var SHORTCUT_DEFINITIONS = [
    {
      id: "shared-action-primary",
      titleTag: "shortcut.primary.title",
      defaultShortcut: ["CONTROL", "ALT", "SHIFT", "F9"],
      action: "shared",
      scope: "all"
    },
    {
      id: "shared-action-secondary",
      titleTag: "shortcut.secondary.title",
      defaultShortcut: ["CONTROL", "ALT", "SHIFT", "F10"],
      action: "shared",
      scope: "all"
    },
    {
      id: "routing-mode-toggle",
      titleTag: "shortcut.routingMode.title",
      defaultShortcut: ["SHIFT", "R"],
      action: "routingMode",
      remarkTag: "shortcut.routingMode.remark",
      scope: "pcb"
    }
  ];
  var RANGE_MEMBER_NAMES = [
    "BLANK",
    "HOME",
    "SCHEMATIC_PAGE",
    "SYMBOL",
    "PCB",
    "FOOTPRINT",
    "PANEL",
    "PCB_3D_PREVIEW",
    "PCB_2D_PREVIEW",
    "PANEL_3D_PREVIEW",
    "PANEL_LIBRARY",
    "ASSEMBLY_VARIANT",
    "SIMULATION_SCHEMATIC_PAGE_NGSPICE",
    "SIMULATION_SCHEMATIC_PAGE_SIMULIDE",
    "SIMULATION_WAVEFORM"
  ];
  var SCENE_MEMBER_NAMES = [
    ["EDITOR"],
    ["CANVAS_SELECTED", "SELECT_CANVAS"],
    ["CANVAS_NOT_SELECT", "NOT_SELECT_CANVAS"],
    ["DRAWING", "DRAW"],
    ["PLACING", "PLACE"],
    ["LOCAL"]
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
  var ROUTING_MODE_SWITCH_CONFIG_KEY = "routingModeShortcutEnabled";
  var executionCount = 0;
  var routingModeSwitchEnabled = false;
  var routingModeSwitchOperationInProgress = false;
  var routingModeOperationInProgress = false;
  var shortcutRegistrationMode = "unavailable";
  var shortcutRegistrationAttempted = false;
  var shortcutRegistrationError;
  var shortcutRegistrationPromise;
  var shortcutRegistrationResults = /* @__PURE__ */ new Map();
  var shortcutRegistrationErrors = /* @__PURE__ */ new Map();
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
  function isRecord(value) {
    return typeof value === "object" && value !== null;
  }
  function getRuntimeRangeEnum() {
    if (typeof ESYS_ShortcutKeyEffectiveEditorRange !== "undefined") {
      return ESYS_ShortcutKeyEffectiveEditorRange;
    }
    if (typeof ESYS_ShortcutKeyEffectiveEditorDocumentType !== "undefined") {
      return ESYS_ShortcutKeyEffectiveEditorDocumentType;
    }
    return void 0;
  }
  function getRuntimeSceneEnum() {
    if (typeof ESYS_ShortcutKeyEffectiveEditorScene === "undefined") {
      return void 0;
    }
    return ESYS_ShortcutKeyEffectiveEditorScene;
  }
  function resolveRuntimeEnumMember(runtimeEnum, names) {
    for (const name of names) {
      const value = runtimeEnum[name];
      if (typeof value === "number") {
        return value;
      }
    }
    return void 0;
  }
  function resolveRuntimeEnumMembers(runtimeEnum, names) {
    return names.flatMap((name) => {
      const value = resolveRuntimeEnumMember(runtimeEnum, [name]);
      return value === void 0 ? [] : [value];
    });
  }
  function resolveSceneValues(runtimeEnum) {
    const values = [];
    for (const names of SCENE_MEMBER_NAMES) {
      const value = resolveRuntimeEnumMember(runtimeEnum, names);
      if (value === void 0) {
        throw new Error(text("shortcut.runtimeEnumMemberUnavailable"));
      }
      values.push(value);
    }
    return values;
  }
  function resolveShortcutScope(definition) {
    const rangeEnum = getRuntimeRangeEnum();
    const sceneEnum = getRuntimeSceneEnum();
    if (!rangeEnum || !sceneEnum) {
      throw new Error(text("shortcut.runtimeEnumUnavailable"));
    }
    const scene = resolveSceneValues(sceneEnum);
    if (definition.scope === "pcb") {
      const pcb = resolveRuntimeEnumMember(rangeEnum, ["PCB"]);
      if (pcb === void 0) {
        throw new Error(text("shortcut.runtimeEnumMemberUnavailable"));
      }
      return { range: [pcb], scene };
    }
    const range = resolveRuntimeEnumMembers(rangeEnum, RANGE_MEMBER_NAMES);
    if (range.length === 0) {
      throw new Error(text("shortcut.runtimeEnumMemberUnavailable"));
    }
    return { range, scene };
  }
  function getShortcutApi() {
    if (typeof eda === "undefined") {
      throw new TypeError(text("shortcut.apiUnavailable"));
    }
    const shortcutApi = eda.sys_ShortcutKey;
    if (!isRecord(shortcutApi)) {
      throw new Error(text("shortcut.apiUnavailable"));
    }
    return shortcutApi;
  }
  function detectShortcutRegistrationMode(api) {
    if (typeof api.register === "function") {
      return "id";
    }
    if (typeof api.registerShortcutKey === "function") {
      return "legacy";
    }
    return "unavailable";
  }
  function getShortcutAction(action) {
    return action === "routingMode" ? toggleRoutingConflictMode : runSharedAction;
  }
  async function registerShortcut(api, mode, definition, scope) {
    const shortcutKey = [...definition.defaultShortcut];
    const title = text(definition.titleTag);
    const callback = getShortcutAction(definition.action);
    if (mode === "legacy") {
      if (typeof api.registerShortcutKey !== "function") {
        return false;
      }
      return Boolean(await api.registerShortcutKey(
        shortcutKey,
        title,
        callback,
        scope.range,
        scope.scene
      ));
    }
    if (mode === "id") {
      if (typeof api.register !== "function") {
        return false;
      }
      return Boolean(await api.register(definition.id, {
        shortcutKey,
        title,
        remark: text(definition.remarkTag ?? "shortcut.remark"),
        range: scope.range,
        scene: scope.scene,
        callFn: callback
      }));
    }
    return false;
  }
  function showShortcutToast(message, messageType, timer) {
    eda.sys_Message.showToastMessage(message, messageType, timer);
  }
  function handleShortcutRegistrationError(error) {
    const message = formatError(error);
    shortcutRegistrationError = message;
    for (const definition of SHORTCUT_DEFINITIONS) {
      if (!shortcutRegistrationResults.has(definition.id)) {
        shortcutRegistrationResults.set(definition.id, false);
      }
    }
    console.error(`[${extension_default.displayName}] Shortcut registration error:`, error);
    showShortcutToast(
      text("shortcut.registration.error", message),
      ESYS_ToastMessageType.ERROR,
      5
    );
  }
  async function registerShortcuts() {
    shortcutRegistrationAttempted = true;
    shortcutRegistrationMode = "unavailable";
    shortcutRegistrationError = void 0;
    shortcutRegistrationResults.clear();
    shortcutRegistrationErrors.clear();
    try {
      const api = getShortcutApi();
      const mode = detectShortcutRegistrationMode(api);
      shortcutRegistrationMode = mode;
      if (mode === "unavailable") {
        throw new Error(text("shortcut.apiUnavailable"));
      }
      const scopes = /* @__PURE__ */ new Map();
      for (const definition of SHORTCUT_DEFINITIONS) {
        if (!scopes.has(definition.scope)) {
          scopes.set(definition.scope, resolveShortcutScope(definition));
        }
      }
      for (const definition of SHORTCUT_DEFINITIONS) {
        try {
          const scope = scopes.get(definition.scope);
          if (!scope) {
            throw new Error(text("shortcut.runtimeEnumUnavailable"));
          }
          const registered = await registerShortcut(api, mode, definition, scope);
          shortcutRegistrationResults.set(definition.id, registered);
          if (!registered) {
            shortcutRegistrationErrors.set(definition.id, text("shortcut.registration.resultFalse"));
          }
        } catch (error) {
          shortcutRegistrationResults.set(definition.id, false);
          shortcutRegistrationErrors.set(definition.id, formatError(error));
          console.error(`[${extension_default.displayName}] Failed to register ${definition.id}:`, error);
        }
      }
      const failedIds = SHORTCUT_DEFINITIONS.filter((definition) => shortcutRegistrationResults.get(definition.id) !== true).map((definition) => definition.id);
      if (failedIds.length > 0) {
        console.error(`[${extension_default.displayName}] Shortcut registration failed: ${failedIds.join(", ")}`);
        showShortcutToast(
          text("shortcut.registration.partialFailure"),
          ESYS_ToastMessageType.WARNING,
          5
        );
      } else {
        console.log(`[${extension_default.displayName}] Registered ${SHORTCUT_DEFINITIONS.length} shortcuts via ${mode}.`);
      }
    } catch (error) {
      handleShortcutRegistrationError(error);
    }
  }
  function ensureShortcutRegistration() {
    if (!shortcutRegistrationPromise) {
      shortcutRegistrationPromise = registerShortcuts().catch((error) => {
        handleShortcutRegistrationError(error);
      });
    }
    return shortcutRegistrationPromise;
  }
  function loadRoutingModeSwitchState() {
    try {
      const storage = eda.sys_Storage;
      if (!storage || typeof storage.getExtensionUserConfig !== "function") {
        return;
      }
      routingModeSwitchEnabled = storage.getExtensionUserConfig(ROUTING_MODE_SWITCH_CONFIG_KEY) === true;
    } catch (error) {
      console.error(`[${extension_default.displayName}] Failed to load routing mode switch state:`, error);
      routingModeSwitchEnabled = false;
    }
  }
  function activate(status, arg) {
    loadRoutingModeSwitchState();
    void ensureShortcutRegistration();
  }
  async function waitForShortcutRegistration() {
    await ensureShortcutRegistration();
  }
  function runSharedAction() {
    executionCount += 1;
    showShortcutToast(
      text("action.executed", executionCount),
      ESYS_ToastMessageType.SUCCESS,
      3
    );
  }
  function routingModeLabel(mode) {
    switch (mode) {
      case ROUTING_MODE_IGNORE:
        return text("routingMode.ignore");
      case ROUTING_MODE_PUSH:
        return text("routingMode.push");
      case ROUTING_MODE_SURROUND:
        return text("routingMode.surround");
      case ROUTING_MODE_BLOCK:
        return text("routingMode.block");
      default:
        return text("routingMode.unknown", mode ?? "?");
    }
  }
  async function toggleRoutingConflictMode() {
    if (!routingModeSwitchEnabled) {
      showShortcutToast(
        text("routingMode.switch.disabledHint"),
        ESYS_ToastMessageType.INFO,
        4
      );
      return;
    }
    if (routingModeOperationInProgress) {
      showShortcutToast(
        text("routingMode.busy"),
        ESYS_ToastMessageType.WARNING,
        3
      );
      return;
    }
    routingModeOperationInProgress = true;
    try {
      const fileManager = eda.sys_FileManager;
      if (!fileManager || typeof fileManager.getDocumentSource !== "function" || typeof fileManager.setDocumentSource !== "function") {
        throw new Error(text("routingMode.apiUnavailable"));
      }
      const source = await fileManager.getDocumentSource();
      if (typeof source !== "string" || source.length === 0) {
        throw new Error(text("routingMode.documentUnavailable"));
      }
      const update = toggleBlockIgnoreRoutingModeInSource(source);
      if (!update) {
        throw new Error(text("routingMode.notSupported"));
      }
      const updated = await fileManager.setDocumentSource(update.source);
      if (!updated) {
        throw new Error(text("routingMode.saveFailed"));
      }
      showShortcutToast(
        text(
          "routingMode.changed",
          routingModeLabel(update.previousMode),
          routingModeLabel(update.nextMode)
        ),
        ESYS_ToastMessageType.SUCCESS,
        3
      );
    } catch (error) {
      console.error(`[${extension_default.displayName}] Failed to toggle routing mode:`, error);
      showShortcutToast(
        text("routingMode.error", formatError(error)),
        ESYS_ToastMessageType.ERROR,
        5
      );
    } finally {
      routingModeOperationInProgress = false;
    }
  }
  async function toggleRoutingModeShortcut() {
    if (routingModeSwitchOperationInProgress) {
      showShortcutToast(
        text("routingMode.switch.busy"),
        ESYS_ToastMessageType.WARNING,
        3
      );
      return;
    }
    routingModeSwitchOperationInProgress = true;
    const nextState = !routingModeSwitchEnabled;
    try {
      const storage = eda.sys_Storage;
      if (!storage || typeof storage.setExtensionUserConfig !== "function") {
        throw new Error(text("routingMode.switch.storageUnavailable"));
      }
      const saved = await storage.setExtensionUserConfig(ROUTING_MODE_SWITCH_CONFIG_KEY, nextState);
      if (!saved) {
        throw new Error(text("routingMode.switch.saveFailed"));
      }
      routingModeSwitchEnabled = nextState;
      showShortcutToast(
        text(nextState ? "routingMode.switch.enabled" : "routingMode.switch.disabled"),
        ESYS_ToastMessageType.SUCCESS,
        4
      );
    } catch (error) {
      console.error(`[${extension_default.displayName}] Failed to change routing mode switch state:`, error);
      showShortcutToast(
        text("routingMode.switch.error", formatError(error)),
        ESYS_ToastMessageType.ERROR,
        5
      );
    } finally {
      routingModeSwitchOperationInProgress = false;
    }
  }
  function normalizeShortcut(value) {
    if (value === null) {
      return null;
    }
    if (!Array.isArray(value) || !value.every((key) => typeof key === "string")) {
      return void 0;
    }
    return value;
  }
  function normalizeShortcutData(value) {
    if (!isRecord(value)) {
      return void 0;
    }
    return {
      shortcutKey: normalizeShortcut(value.shortcutKey),
      title: typeof value.title === "string" ? value.title : void 0,
      userDefinedShortcutKey: normalizeShortcut(value.userDefinedShortcutKey)
    };
  }
  async function readLegacyShortcutEntries(api) {
    if (typeof api.getShortcutKeys !== "function") {
      return [];
    }
    const result = await api.getShortcutKeys(false);
    if (!Array.isArray(result)) {
      return [];
    }
    return result.map(normalizeShortcutData).filter((entry) => entry !== void 0);
  }
  function sameShortcut(left, right) {
    if (!left || left.length !== right.length) {
      return false;
    }
    return [...left].sort().join("|") === [...right].sort().join("|");
  }
  async function readIdShortcutData(api, definition) {
    if (typeof api.get !== "function") {
      return void 0;
    }
    const result = await api.get(definition.id);
    return normalizeShortcutData(result);
  }
  function shortcutApiLabel(mode) {
    switch (mode) {
      case "id":
        return text("shortcut.status.apiId");
      case "legacy":
        return text("shortcut.status.apiLegacy");
      default:
        return text("shortcut.status.apiUnavailable");
    }
  }
  function shortcutRegistrationLabel() {
    if (!shortcutRegistrationAttempted) {
      return text("shortcut.status.registrationPending");
    }
    const failedCount = SHORTCUT_DEFINITIONS.filter(
      (definition) => shortcutRegistrationResults.get(definition.id) !== true
    ).length;
    if (failedCount === 0 && shortcutRegistrationResults.size === SHORTCUT_DEFINITIONS.length) {
      return text("shortcut.status.registrationSuccess");
    }
    if (shortcutRegistrationError) {
      return text("shortcut.status.registrationError", shortcutRegistrationError);
    }
    return text("shortcut.status.registrationFailure", failedCount);
  }
  function shortcutRegistrationResultLabel(definition) {
    const result = shortcutRegistrationResults.get(definition.id);
    if (result === true) {
      return text("shortcut.status.registrationOk");
    }
    const error = shortcutRegistrationErrors.get(definition.id);
    return error ? text("shortcut.status.registrationItemError", error) : text("shortcut.status.registrationNotOk");
  }
  async function showShortcutStatus() {
    try {
      await ensureShortcutRegistration();
      const api = getShortcutApi();
      const legacyEntries = shortcutRegistrationMode === "legacy" ? await readLegacyShortcutEntries(api) : [];
      const routingSwitchStatus = routingModeSwitchEnabled ? text("routingMode.switch.statusEnabled") : text("routingMode.switch.statusDisabled");
      const statusLines = [];
      for (const definition of SHORTCUT_DEFINITIONS) {
        const title = text(definition.titleTag);
        const registered = shortcutRegistrationMode === "legacy" ? legacyEntries.find((entry) => entry.title === title || sameShortcut(entry.shortcutKey, definition.defaultShortcut)) : await readIdShortcutData(api, definition);
        if (!registered) {
          statusLines.push([
            title,
            `  ${text("shortcut.status.registration")}: ${shortcutRegistrationResultLabel(definition)}`,
            `  ${text("shortcut.status.notRegistered")}`
          ].join("\n"));
          continue;
        }
        if (shortcutRegistrationMode === "legacy") {
          statusLines.push([
            title,
            `  ${text("shortcut.status.registration")}: ${shortcutRegistrationResultLabel(definition)}`,
            `  ${text("shortcut.status.legacyKey")}: ${formatShortcut(registered.shortcutKey)}`
          ].join("\n"));
          continue;
        }
        const hasUserDefinition = registered.userDefinedShortcutKey !== void 0;
        const effectiveShortcut = hasUserDefinition ? registered.userDefinedShortcutKey : registered.shortcutKey;
        const source = hasUserDefinition ? text("shortcut.status.userDefined") : text("shortcut.status.default");
        statusLines.push([
          title,
          `  ${text("shortcut.status.registration")}: ${shortcutRegistrationResultLabel(definition)}`,
          `  ${text("shortcut.status.defaultKey")}: ${formatShortcut(registered.shortcutKey)}`,
          `  ${text("shortcut.status.effectiveKey")}: ${formatShortcut(effectiveShortcut)} (${source})`
        ].join("\n"));
      }
      eda.sys_Dialog.showInformationMessage(
        [
          text("shortcut.status.api", shortcutApiLabel(shortcutRegistrationMode)),
          text("shortcut.status.registrationSummary", shortcutRegistrationLabel()),
          text("routingMode.switch.status", routingSwitchStatus),
          ...statusLines
        ].join("\n\n"),
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
    const routingModeShortcut = SHORTCUT_DEFINITIONS.find((definition) => definition.action === "routingMode");
    eda.sys_Dialog.showInformationMessage(
      [
        text("about.description"),
        "",
        text("about.defaultPrimary", formatShortcut(SHORTCUT_DEFINITIONS[0].defaultShortcut)),
        text("about.defaultSecondary", formatShortcut(SHORTCUT_DEFINITIONS[1].defaultShortcut)),
        text("about.defaultRoutingMode", formatShortcut(routingModeShortcut?.defaultShortcut)),
        text(
          "routingMode.switch.aboutStatus",
          routingModeSwitchEnabled ? text("routingMode.switch.statusEnabled") : text("routingMode.switch.statusDisabled")
        ),
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
