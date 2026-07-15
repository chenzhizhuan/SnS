## 1. Tab state and layout foundation

- [x] 1.1 Add built-in contribution IDs and a pure versioned Code right-tab state model with open, activate, close, collapse, normalization, and legacy migration behavior
- [x] 1.2 Integrate per-workspace tab persistence and derived active `rightPanelMode` into the workbench layout while removing the vertical-rail width reservation

## 2. Tab navigation chrome

- [x] 2.1 Build the accessible horizontal tab strip, dynamic labels, close behavior, overflow handling, collapse control, and single-level `+` tool menu
- [x] 2.2 Replace Code-mode rail/top actions and route existing Dev Preview, review, canvas, subagent, file-preview, terminal, and extension launch paths through the tab controller

## 3. Tool integration and lifecycle

- [x] 3.1 Move Terminal into a keep-alive right-workspace tab while preserving internal PTY tabs, shortcut behavior, and visible refitting
- [x] 3.2 Move Files and File preview into distinct tabs while preserving workspace/design trees, file references, preview tabs, pins, and thread-retention rules
- [x] 3.3 Add a docked Side conversations tab with count/running state and keep Subagents as its existing independent detail tab
- [x] 3.4 Keep trusted extension tabs mounted across selection, preserve locked permission review, and dispose tabs on close, revocation, or workspace invalidation

## 4. Compatibility, copy, and specifications

- [x] 4.1 Add English and Simplified Chinese tab/menu labels and update extension/video-editor guidance from direct rail icons to direct tool-menu tabs
- [x] 4.2 Preserve Write, Design, and SDD panel behavior and remove obsolete Code rail, file-column, and terminal-drawer state without changing public IPC/runtime contracts

## 5. Verification

- [x] 5.1 Add focused state, accessibility, tool-routing, layout, side-conversation, terminal, file, and extension lifecycle tests
- [x] 5.2 Run focused Vitest, typecheck, full tests, build, strict OpenSpec validation, visual smoke checks, and diff hygiene checks
