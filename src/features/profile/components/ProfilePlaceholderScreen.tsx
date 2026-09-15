import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SquarePageHeader } from '@/src/features/square/components/SquarePageHeader';
import { MUTED_TEXT_COLOR, SQUARE_PAGE_BG } from '@/src/features/square/constants';

interface ProfilePlaceholderScreenProps {
  title: string;
  message?: string;
}

const DEFAULT_MESSAGE = '功能开发中，接口就绪后接入';

export function ProfilePlaceholderScreen({
  title,
  message = DEFAULT_MESSAGE,
}: ProfilePlaceholderScreenProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <SquarePageHeader title={title} onBack={() => router.back()} />
      <View style={styles.body}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SQUARE_PAGE_BG,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 14,
    color: MUTED_TEXT_COLOR,
    textAlign: 'center',
  },
});
