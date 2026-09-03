# 多快捷键动作

一个符合嘉立创EDA扩展 API 结构的独立示例扩展：顶部菜单、主快捷键和备用快捷键共同调用同一个 `runSharedAction()` 函数。

![多快捷键动作图标](images/multi-shortcut-action.png)

## 功能

- 同一个共享动作绑定两个独立快捷键注册项。
- 默认主快捷键：`Ctrl + Alt + Shift + F9`。
- 默认备用快捷键：`Ctrl + Alt + Shift + F10`。
- 两个快捷键都可以在嘉立创EDA的快捷键设置中分别修改或清除。
- 顶部菜单提供“执行共享动作”“查看快捷键状态”和“关于”。
- 支持简体中文和英文界面文本。

每次执行共享动作都会显示成功提示和当前会话内的累计执行次数，因此可以直观看出两个快捷键是否调用了同一份状态与函数。

## 适用边界

本扩展只注册自身提供的动作，不会修改、覆盖或转发嘉立创EDA的系统快捷键，也不是任意内置命令重映射器。若快捷键与系统快捷键冲突，系统快捷键优先生效。

`SYS_ShortcutKey.register()` 自 EDA v4.2 提供，目前仍是 BETA 接口。扩展将最低兼容引擎声明为 `^4.2.0`；用于正式环境前，应在目标嘉立创EDA版本中完成安装、改键、冲突和实际按键测试。

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
5. 在快捷键设置中修改其中一个绑定，再检查“查看快捷键状态”并实际按键验证。

## License

Apache License 2.0

---

## English

Multi-Shortcut Action is an independent EasyEDA extension demonstrating two separately configurable shortcut registrations that call the same `runSharedAction()` function. It targets EDA v4.2 or later and uses the currently BETA `SYS_ShortcutKey` API.
