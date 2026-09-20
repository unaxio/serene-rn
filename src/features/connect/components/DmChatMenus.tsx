import * as Clipboard from 'expo-clipboard';

import { DmActionSheet } from '@/src/features/connect/components/DmActionSheet';
import { CONNECT_COPIED_MESSAGE } from '@/src/features/connect/constants';
import type { DmMessage } from '@/src/features/connect/types';
import { dmMessageText } from '@/src/features/connect/utils/dmMessageText';
import { ReportContentModal } from '@/src/features/square/components/ReportContentModal';
import { showToast } from '@/src/utils/toast';

interface DmChatMenusProps {
  active: DmMessage | null;
  mine: boolean;
  reportOpen: boolean;
  reporting: boolean;
  onCloseMenu: () => void;
  onQuote: (message: DmMessage) => void;
  onDelete: (message: DmMessage) => void;
  onOpenReport: () => void;
  onCloseReport: () => void;
  onSubmitReport: (reason: string, detail: string) => Promise<boolean>;
}

export function DmChatMenus({
  active,
  mine,
  reportOpen,
  reporting,
  onCloseMenu,
  onQuote,
  onDelete,
  onOpenReport,
  onCloseReport,
  onSubmitReport,
}: DmChatMenusProps) {
  return (
    <>
      <DmActionSheet
        visible={active !== null}
        mine={mine}
        onClose={onCloseMenu}
        onCopy={() => {
          void Clipboard.setStringAsync(active ? dmMessageText(active) : '');
          showToast(CONNECT_COPIED_MESSAGE);
        }}
        onQuote={() => {
          if (active) {
            onQuote(active);
          }
        }}
        onReport={onOpenReport}
        onDelete={() => {
          if (active) {
            onDelete(active);
          }
        }}
      />
      <ReportContentModal
        visible={reportOpen}
        isSubmitting={reporting}
        onClose={onCloseReport}
        onSubmit={onSubmitReport}
      />
    </>
  );
}
