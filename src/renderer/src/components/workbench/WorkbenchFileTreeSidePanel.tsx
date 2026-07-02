import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { WorkspaceFileTarget } from '@shared/workspace-file'
import { ChatFileTreePanel, type ChatFileTreeReference } from '../chat/ChatFileTreePanel'

export type WorkbenchFileTreeSidePanelProps = {
  open: boolean
  width: number
  workspaceRoot: string
  selectedTarget?: WorkspaceFileTarget | null
  onPreviewFile: (path: string) => void
  onAddReference: (reference: ChatFileTreeReference) => void
}

export function WorkbenchFileTreeSidePanel({
  open,
  width,
  workspaceRoot,
  selectedTarget,
  onPreviewFile,
  onAddReference
}: WorkbenchFileTreeSidePanelProps): ReactElement | null {
  const { t } = useTranslation()
  if (!open) return null
  return (
    <>
      <div
        role="separator"
        aria-orientation="vertical"
        className="ds-workbench-divider ds-no-drag relative z-20 shrink-0"
      />
      <aside
        className="ds-no-drag h-full min-h-0 shrink-0 border-l border-ds-border-muted bg-ds-sidebar"
        style={{ width }}
      >
        {workspaceRoot ? (
          <ChatFileTreePanel
            workspaceRoot={workspaceRoot}
            selectedPath={selectedTarget?.path}
            onPreviewFile={onPreviewFile}
            onAddReference={onAddReference}
            t={t}
            fill
          />
        ) : (
          <div className="px-4 py-3 text-[12px] leading-5 text-ds-muted">
            {t('workspaceRequiredToCreateThread')}
          </div>
        )}
      </aside>
    </>
  )
}
