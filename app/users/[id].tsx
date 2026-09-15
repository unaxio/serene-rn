import { UserProfileScreen } from '@/src/features/profile/components/UserProfileScreen';
import { useLocalSearchParams } from 'expo-router';

export default function UserProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = Array.isArray(id) ? id[0] : id;
  return <UserProfileScreen userId={userId ?? ''} />;
}
