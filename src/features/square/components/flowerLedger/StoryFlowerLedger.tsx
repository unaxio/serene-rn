import { useCallback, useState } from 'react';

import { FlowerLedgerModal } from '@/src/features/square/components/flowerLedger/FlowerLedgerModal';
import { StoryFlowerLedgerCard } from '@/src/features/square/components/flowerLedger/StoryFlowerLedgerCard';
import { useGiftFlowerLedgers } from '@/src/features/square/hooks/useGiftFlowerLedgers';

interface StoryFlowerLedgerProps {
  storyId: string;
  onSendFlower: () => void;
}

export function StoryFlowerLedger({ storyId, onSendFlower }: StoryFlowerLedgerProps) {
  const ledgers = useGiftFlowerLedgers({
    targetType: 'story',
    targetId: storyId,
  });
  const [recordsVisible, setRecordsVisible] = useState(false);

  const openRecords = useCallback(() => {
    setRecordsVisible(true);
  }, []);

  const closeRecords = useCallback(() => {
    setRecordsVisible(false);
  }, []);

  return (
    <>
      <StoryFlowerLedgerCard
        ledgers={ledgers}
        onSendFlower={onSendFlower}
        onOpenRecords={openRecords}
      />
      <FlowerLedgerModal
        visible={recordsVisible}
        ledgers={ledgers}
        onClose={closeRecords}
      />
    </>
  );
}
