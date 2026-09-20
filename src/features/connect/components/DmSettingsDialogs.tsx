import { ConfirmDangerModal } from '@/src/features/square/components/ConfirmDangerModal';
import { ReportContentModal } from '@/src/features/square/components/ReportContentModal';
import { reportUser } from '@/src/features/profile/api';
import { toastCaughtFailure } from '@/src/utils/requestError';
import { showToast } from '@/src/utils/toast';

interface DmSettingsDialogsProps {
  peerId?: string;
  blockedByMe: boolean;
  busy: boolean;
  clearOpen: boolean;
  blockOpen: boolean;
  reportOpen: boolean;
  onCloseClear: () => void;
  onCloseBlock: () => void;
  onCloseReport: () => void;
  onConfirmClear: () => void;
  onConfirmBlock: () => void;
  onBusy: (busy: boolean) => void;
}

export function DmSettingsDialogs({
  peerId,
  blockedByMe,
  busy,
  clearOpen,
  blockOpen,
  reportOpen,
  onCloseClear,
  onCloseBlock,
  onCloseReport,
  onConfirmClear,
  onConfirmBlock,
  onBusy,
}: DmSettingsDialogsProps) {
  return (
    <>
      <ConfirmDangerModal
        visible={clearOpen}
        title="清空聊天记录"
        message="只清除你这边的记录，之后的新消息仍会保留"
        confirmLabel="清空"
        isSubmitting={busy}
        onCancel={onCloseClear}
        onConfirm={onConfirmClear}
      />
      <ConfirmDangerModal
        visible={blockOpen}
        title={blockedByMe ? '解除黑名单' : '加入黑名单'}
        message="加入黑名单后，双方都不能再发送消息"
        confirmLabel="确定"
        isSubmitting={busy}
        onCancel={onCloseBlock}
        onConfirm={onConfirmBlock}
      />
      <ReportContentModal
        visible={reportOpen}
        isSubmitting={busy}
        onClose={onCloseReport}
        onSubmit={async (reason, detail) => {
          if (!peerId) {
            return false;
          }
          onBusy(true);
          try {
            await reportUser({ userId: peerId, reason, detail });
            showToast('已提交举报');
            return true;
          } catch (error) {
            toastCaughtFailure(error);
            return false;
          } finally {
            onBusy(false);
          }
        }}
      />
    </>
  );
}
