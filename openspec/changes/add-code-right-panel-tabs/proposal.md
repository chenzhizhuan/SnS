## Why

Kun's Code mode exposes related workspace tools through three separate interaction models: a single-selection right rail, a floating side-conversation panel, and a bottom terminal drawer. Users cannot keep several tools open as named destinations or switch among them without replacing the current panel, and the model no longer matches the richer files, subagent, side-conversation, browser, and extension surfaces now available.

## What Changes

- Replace the Code-mode vertical right rail with a Host-owned horizontal tab strip and a single-level `+` tool menu.
- Preserve every existing entry as a distinct tool: terminal, browser, files, file preview, side conversations, todo, plan, changes/review, code canvas, subagents, and each right-sidebar extension View.
- Keep one top-level tab per built-in tool or extension contribution, preserve visited panel state while switching, and give tabs accessible close, activation, overflow, and keyboard behavior.
- Move the terminal drawer, file-tree side column, and floating side-conversation panel into the tabbed right workspace while retaining their existing internal multi-session or multi-file behavior.
- Persist ordered tabs, active selection, expanded state, and width per workspace, including migration from the existing stored `rightPanelMode`.
- Replace direct extension rail icons with direct, localized rows in the shared tool menu; trusted selections open isolated tabs and locked selections continue to launch protected permission review.
- Keep Write, Design, SDD assistant, Main/preload IPC, Kun HTTP/SSE, and Extension Manifest contracts unchanged.

## Capabilities

### New Capabilities

- `code-right-panel-tab-navigation`: Code-mode tab state, tool discovery, panel lifecycle, persistence, sizing, accessibility, and integration of built-in tools.

### Modified Capabilities

- `extension-right-sidebar-navigation`: Right-sidebar extension Views move from direct vertical-rail icons to direct tool-menu entries and independently closable tabs while preserving trust, isolation, ordering, and Host ownership.

## Impact

- Renderer workbench layout, right-panel routing, file-tree controller, terminal/browser hosts, side-conversation presentation, extension View lifecycle, localization, and focused UI tests.
- Stored renderer layout state gains a versioned per-workspace tab registry and migrates the legacy single-panel selection.
- The Code-mode rail width reservation and terminal drawer height state become obsolete; terminal settings and PTY APIs remain unchanged.
- Existing extension and video-editor navigation documentation must describe direct tool-menu/tab discovery instead of a direct right-rail icon.
