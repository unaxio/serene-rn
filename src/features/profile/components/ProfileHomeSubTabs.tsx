import { ProfileSubTabs } from '@/src/features/profile/components/ProfileSubTabs';
import {
  PROFILE_COLLECT_SUB_TABS,
  PROFILE_FLOWER_SUB_TABS,
  PROFILE_PUBLISH_SUB_TABS,
  PROFILE_RESONATE_SUB_TABS,
  type FlowerSentFilterId,
  type ProfileContentTabId,
} from '@/src/features/profile/constants';

type PublishSubId = (typeof PROFILE_PUBLISH_SUB_TABS)[number]['id'];
type CollectSubId = (typeof PROFILE_COLLECT_SUB_TABS)[number]['id'];
type ResonateSubId = (typeof PROFILE_RESONATE_SUB_TABS)[number]['id'];

interface ProfileHomeSubTabsProps {
  mainTab: ProfileContentTabId;
  publishSub: PublishSubId;
  collectSub: CollectSubId;
  resonateSub: ResonateSubId;
  flowerSub: FlowerSentFilterId;
  onPublishSub: (id: PublishSubId) => void;
  onCollectSub: (id: CollectSubId) => void;
  onResonateSub: (id: ResonateSubId) => void;
  onFlowerSub: (id: FlowerSentFilterId) => void;
}

export function ProfileHomeSubTabs({
  mainTab,
  publishSub,
  collectSub,
  resonateSub,
  flowerSub,
  onPublishSub,
  onCollectSub,
  onResonateSub,
  onFlowerSub,
}: ProfileHomeSubTabsProps) {
  if (mainTab === 'publish') {
    return (
      <ProfileSubTabs options={PROFILE_PUBLISH_SUB_TABS} value={publishSub} onChange={onPublishSub} />
    );
  }
  if (mainTab === 'flower') {
    return (
      <ProfileSubTabs options={PROFILE_FLOWER_SUB_TABS} value={flowerSub} onChange={onFlowerSub} />
    );
  }
  if (mainTab === 'collect') {
    return (
      <ProfileSubTabs options={PROFILE_COLLECT_SUB_TABS} value={collectSub} onChange={onCollectSub} />
    );
  }
  if (mainTab === 'resonate') {
    return (
      <ProfileSubTabs
        options={PROFILE_RESONATE_SUB_TABS}
        value={resonateSub}
        onChange={onResonateSub}
      />
    );
  }
  return null;
}
