import { Alert } from 'react-native';

/**
 * 轻量 Toast 封装；后续可替换为专用 Toast 组件，调用方无需改动。
 */
export function showToast(message: string, title = '提示'): void {
  Alert.alert(title, message);
}

export function showErrorToast(message: string): void {
  showToast(message, '错误');
}
