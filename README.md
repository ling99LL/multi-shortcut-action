# 多快捷键动作

一个符合嘉立创EDA扩展 API 结构的独立扩展：顶部菜单、主快捷键和备用快捷键共同调用同一个 `runSharedAction()` 函数，并在 PCB 编辑器中提供可开关的阻挡/环绕布线模式快速切换。

![多快捷键动作图标](images/multi-shortcut-action.png)

## 功能

- 同一个共享动作绑定两个独立快捷键注册项。
- 默认主快捷键：`Ctrl + Alt + Shift + F9`。
- 默认备用快捷键：`Ctrl + Alt + Shift + F10`。
- PCB 编辑器增加一个独立的布线模式快捷键，默认：`Shift + R`。
- 快速切换开关首次安装时默认关闭，开关状态会随扩展用户配置保存。
- 从插件菜单开启开关后，`Shift + R` 只在“阻挡”和“环绕”之间切换。
- 当前是“忽略”或“推挤”等其他模式时，第一次按下会先切换到“阻挡”；之后只在“阻挡”和“环绕”之间往返。
- 三个快捷键都可以在嘉立创EDA的快捷键设置中分别修改或清除。
- 首页和 PCB 顶部菜单提供“开关：Shift+R 仅切换阻挡/环绕”；还提供快捷键状态和关于入口。
- 支持简体中文和英文界面文本。

每次执行共享动作都会显示成功提示和当前会话内的累计执行次数，因此可以直观看出两个快捷键是否调用了同一份状态与函数。

## 适用边界

本扩展只注册自身提供的动作，不会修改、覆盖或转发嘉立创EDA的系统快捷键，也不是任意内置命令重映射器。若快捷键与系统快捷键冲突，系统快捷键优先生效。

`SYS_ShortcutKey.register()` 自 EDA v4.2 提供，目前仍是 BETA 接口。扩展将最低兼容引擎声明为 `^4.2.0`；用于正式环境前，应在目标嘉立创EDA版本中完成安装、改键、冲突和实际按键测试。

布线模式切换使用官方 `SYS_FileManager.getDocumentSource()` / `setDocumentSource()` BETA 接口，只修改当前 PCB 文档 `PREFERENCE` 记录中的 `routingMode` 字段（`2` 为环绕，`3` 为阻挡）。开关状态使用官方 `SYS_Storage` 扩展用户配置保存。扩展不会模拟系统键盘事件，也不会修改嘉立创EDA系统快捷键。源码写回成功后，文档按嘉立创EDA正常编辑流程保存即可。

由于 `Shift + R` 可能与嘉立创EDA系统快捷键冲突，系统快捷键优先生效；扩展不能通过官方 API 强制覆盖它。若你必须使用 `Shift + R`，需要先在“设置 → 快捷键”中清除或改掉占用该组合键的系统动作；否则只能给本扩展改用其他组合键。

由于文档源码读写接口属于 BETA，目标版本可能在源码格式或实时刷新时存在差异。尤其应验证：快捷键在布线过程中是否立即生效、切换后画布提示是否同步、撤销/重做与保存是否符合预期。没有连接到实际嘉立创EDA客户端时，构建和烟测不能替代这项验收。

## 构建

需要 Node.js 20.17.0 或更高版本。

```powershell
npm install
npm run lint
npm run build
```

生成的 `.eext` 文件位于 `build/dist/`。

## 安装与验证

1. 在嘉立创EDA扩展管理器中导入 `build/dist/` 下的 `.eext` 文件。
2. 重新加载或启用扩展。
3. 使用顶部“多快捷键”菜单执行共享动作。
4. 分别按下两个默认快捷键，确认累计次数连续增加。
5. 在“多快捷键”菜单中开启“Shift+R 仅切换阻挡/环绕”开关。
6. 如果系统已有动作占用 `Shift + R`，先到“设置 → 快捷键”清除或改掉它的绑定。
7. 打开 PCB，确认当前模式为“阻挡”或“环绕”，按 `Shift + R`，观察两种模式是否往返切换。
8. 关闭开关后再次按 `Shift + R`，确认本扩展不再执行切换。
9. 在快捷键设置中修改任意一个绑定，再检查“查看快捷键状态”并实际按键验证。

## License

Apache License 2.0

---

## English

Multi-Shortcut Action is an independent EasyEDA extension demonstrating two separately configurable shortcut registrations that call the same `runSharedAction()` function, plus a switchable PCB-only shortcut that toggles routing mode between block and surround with Shift+R. It targets EDA v4.2 or later, uses the official storage API, and relies on the currently BETA shortcut and document-source APIs.
