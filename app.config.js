/**
 * Expo 应用配置。
 * Web 测试部署：EXPO_PUBLIC_WEB_DEPLOY=1 时启用子路径 /flower。
 */
const IS_WEB_DEPLOY = process.env.EXPO_PUBLIC_WEB_DEPLOY === '1';

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'serene-rn',
  slug: 'serene-rn',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'serenern',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    // single：产出 dist/index.html + _expo/static，便于挂到 /flower
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    'expo-image',
    'expo-secure-store',
    [
      'expo-image-picker',
      {
        photosPermission: '需要访问相册以上传封面',
        cameraPermission: '需要使用相机以上传封面',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    ...(IS_WEB_DEPLOY ? { baseUrl: '/flower' } : {}),
  },
  extra: {
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api',
    webBasePath: IS_WEB_DEPLOY ? '/flower' : '',
  },
};

module.exports = config;
