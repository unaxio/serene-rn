import { ConnectAuthGate } from '@/src/features/connect/components/ConnectAuthGate';
import { ConnectHomeScreen } from '@/src/features/connect/components/ConnectHomeScreen';

export default function ConnectTabScreen() {
  return (
    <ConnectAuthGate>
      <ConnectHomeScreen />
    </ConnectAuthGate>
  );
}
