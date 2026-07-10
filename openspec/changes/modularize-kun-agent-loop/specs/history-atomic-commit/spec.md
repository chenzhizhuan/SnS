## ADDED Requirements

### Requirement: Derived history replacements are revision-aware
The runtime SHALL associate each persisted session snapshot used for a derived
replacement with a revision and SHALL reject a replacement whose expected revision
is no longer current.

#### Scenario: Compaction races with a newer append
- **WHEN** compaction derives a replacement from revision N and another turn
  commits history revision N+1 before compaction persists
- **THEN** compaction SHALL not overwrite revision N+1 with its stale snapshot.

### Requirement: History transformations retry only from fresh persisted state
The history coordinator SHALL reload and recompute a pure derived transformation
after a revision conflict before it commits the replacement.

#### Scenario: Repair loses a compare-and-swap race
- **WHEN** history repair encounters a revision conflict
- **THEN** it SHALL recompute the repair from the newer persisted session without
  replaying model calls, tool calls, approvals, or runtime events.

### Requirement: Legacy sessions remain readable
The session store SHALL interpret a persisted session without revision metadata as
revision zero and SHALL preserve its session items when it is subsequently written
with revision metadata.

#### Scenario: Existing session file is loaded
- **WHEN** the runtime opens a session file created before revision metadata
- **THEN** it SHALL expose the same session items and allow a successful
  revision-aware replacement write.
