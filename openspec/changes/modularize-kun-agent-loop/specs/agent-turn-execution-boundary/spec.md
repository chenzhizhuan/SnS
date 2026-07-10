## ADDED Requirements

### Requirement: AgentLoop preserves its public turn boundary
The runtime SHALL retain `AgentLoop` as the externally consumed turn entry point
while delegating internal turn responsibilities through typed internal contracts.
No renderer, preload, Electron IPC, HTTP route, SSE event schema, or tool schema
change is required by this capability.

#### Scenario: Existing runtime starts a turn
- **WHEN** an existing runtime calls the current AgentLoop turn entry point
- **THEN** the turn SHALL retain the existing public inputs, result semantics, and
  observable runtime event contract.

### Requirement: Internal turn services use explicit outcomes
The runtime SHALL represent prepared turn context, model-round outcomes, and
tool-dispatch outcomes with explicit typed records rather than implicit mutation
of an AgentLoop instance.

#### Scenario: Model requests tools
- **WHEN** a model round finishes with one or more tool calls
- **THEN** the model-round service SHALL return a tool-call outcome for the
  orchestrator to dispatch in the existing order.

### Requirement: Turn finalization is once-only
The runtime SHALL finalize a turn at most once across normal completion, error,
cancellation, interruption, and thread deletion.

#### Scenario: Cancellation races with completion
- **WHEN** cancellation is observed while a turn is completing
- **THEN** the runtime SHALL persist and emit no more than one terminal
  finalization outcome for that turn.
