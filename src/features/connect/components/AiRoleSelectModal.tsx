import { FullScreenModal } from '@/src/components/FullScreenModal';
import { AiRolePicker } from '@/src/features/connect/components/AiRolePicker';

interface AiRoleSelectModalProps {
  visible: boolean;
  confirming: boolean;
  onClose: () => void;
  onConfirm: (roleId: string) => void;
}

export function AiRoleSelectModal({
  visible,
  confirming,
  onClose,
  onConfirm,
}: AiRoleSelectModalProps) {
  return (
    <FullScreenModal visible={visible} title="选择角色" onBack={onClose}>
      <AiRolePicker confirming={confirming} onConfirm={onConfirm} />
    </FullScreenModal>
  );
}
