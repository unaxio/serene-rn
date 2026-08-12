/** App 默认主题文字颜色 */
export const APP_TEXT_COLOR = '#1F195C';

const tintColorLight = '#7e68d7';
const tintColorDark = '#fff';

export default {
  light: {
    text: APP_TEXT_COLOR,
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
