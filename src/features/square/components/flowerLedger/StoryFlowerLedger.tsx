import { useCallback, useState } from 'react';

import { FlowerLedgerModal } from '@/src/features/square/components/flowerLedger/FlowerLedgerModal';
import { StoryFlowerLedgerCard } from '@/src/features/square/components/flowerLedger/StoryFlowerLedgerCard';
import { useGiftFlowerLedgers } from '@/src/features/square/hooks/useGiftFlowerLedgers';

interface StoryFlowerLedgerProps {
  storyId: string;
  flowerCount: number;
  onSendFlower: () => void;
}

export function StoryFlowerLedger({
  storyId,
  flowerCount,
  onSendFlower,
}: StoryFlowerLedgerProps) {
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
        flowerCount={flowerCount}
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
