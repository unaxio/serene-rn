import Svg, { Path } from 'react-native-svg';

interface CrossStarIconProps {
  size?: number;
  color: string;
}

const DEFAULT_SIZE = 14;

export function CrossStarIcon({ size = DEFAULT_SIZE, color }: CrossStarIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <Path
        d="M7 0.5L7.8 5.2L12.5 6L7.8 6.8L7 11.5L6.2 6.8L1.5 6L6.2 5.2L7 0.5Z"
        fill={color}
      />
      <Path
        d="M0.5 7L5.2 6.2L6 1.5L6.8 6.2L11.5 7L6.8 7.8L6 12.5L5.2 7.8L0.5 7Z"
        fill={color}
        opacity={0.85}
      />
    </Svg>
  );
}
