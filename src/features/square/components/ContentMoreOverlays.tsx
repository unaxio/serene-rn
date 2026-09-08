import { ConfirmDangerModal } from '@/src/features/square/components/ConfirmDangerModal';
import { ContentMoreMenu } from '@/src/features/square/components/ContentMoreMenu';
import { ReportContentModal } from '@/src/features/square/components/ReportContentModal';
import type { useContentMoreController } from '@/src/features/square/hooks/useContentMoreController';
import type { ContentMoreKind } from '@/src/features/square/utils/contentMoreActions';

type ContentMoreController = ReturnType<typeof useContentMoreController>;

interface ContentMoreOverlaysProps {
  controller: ContentMoreController;
  contentKind: ContentMoreKind;
}

export function ContentMoreOverlays({
  controller,
  contentKind,
}: ContentMoreOverlaysProps) {
  return (
    <>
      <ContentMoreMenu
        visible={controller.menuVisible}
        onClose={controller.closeMenu}
        isOwn={controller.isOwn}
        contentKind={contentKind}
        isFollowing={controller.isFollowing}
        onAction={controller.handleAction}
      />
      <ReportContentModal
        visible={controller.reportVisible}
        isSubmitting={controller.isReporting}
        onClose={controller.closeReport}
        onSubmit={controller.submitReport}
      />
      <ConfirmDangerModal
        visible={controller.deleteVisible}
        title={controller.deleteTitle}
        message={controller.deleteMessage}
        confirmLabel={controller.deleteConfirmLabel}
        isSubmitting={controller.isDeleting}
        onCancel={controller.closeDelete}
        onConfirm={() => {
          void controller.confirmDelete();
        }}
      />
    </>
  );
}
