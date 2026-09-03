import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

import { showErrorToast } from '@/src/utils/toast';

export interface PickedImageFile {
  uri: string;
  name: string;
  type: string;
}

const DEFAULT_IMAGE_TYPE = 'image/jpeg';
const IMAGE_QUALITY = 0.8;

function toPickedFile(asset: ImagePicker.ImagePickerAsset): PickedImageFile {
  const type = asset.mimeType ?? DEFAULT_IMAGE_TYPE;
  const extension = type.includes('png') ? 'png' : 'jpg';
  return {
    uri: asset.uri,
    name: asset.fileName ?? `cover.${extension}`,
    type,
  };
}

async function launchLibrary(): Promise<PickedImageFile | null> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showErrorToast('需要相册权限才能上传封面');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: IMAGE_QUALITY,
    });
    const asset = result.canceled ? undefined : result.assets[0];
    return asset ? toPickedFile(asset) : null;
  } catch {
    showErrorToast('打开相册失败');
    return null;
  }
}

async function launchCamera(): Promise<PickedImageFile | null> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showErrorToast('需要相机权限才能拍照');
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: IMAGE_QUALITY,
    });
    const asset = result.canceled ? undefined : result.assets[0];
    return asset ? toPickedFile(asset) : null;
  } catch {
    showErrorToast('打开相机失败');
    return null;
  }
}

export async function pickSquareImages(maxCount: number): Promise<PickedImageFile[]> {
  if (maxCount <= 0) {
    return [];
  }
  if (Platform.OS === 'web') {
    const file = await launchLibrary();
    return file ? [file] : [];
  }

  return new Promise((resolve) => {
    Alert.alert('选择图片', undefined, [
      {
        text: '相册',
        onPress: () => {
          void launchLibraryMany(maxCount).then(resolve);
        },
      },
      {
        text: '拍照',
        onPress: () => {
          void launchCamera().then((file) => resolve(file ? [file] : []));
        },
      },
      { text: '取消', style: 'cancel', onPress: () => resolve([]) },
    ]);
  });
}

async function launchLibraryMany(maxCount: number): Promise<PickedImageFile[]> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showErrorToast('需要相册权限才能上传图片');
      return [];
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: IMAGE_QUALITY,
      allowsMultipleSelection: maxCount > 1,
      selectionLimit: maxCount,
    });
    if (result.canceled) {
      return [];
    }
    return result.assets.slice(0, maxCount).map(toPickedFile);
  } catch {
    showErrorToast('打开相册失败');
    return [];
  }
}

export function pickSquareImage(): Promise<PickedImageFile | null> {
  if (Platform.OS === 'web') {
    return launchLibrary();
  }

  return new Promise((resolve) => {
    Alert.alert('选择封面', undefined, [
      {
        text: '相册',
        onPress: () => {
          void launchLibrary().then(resolve);
        },
      },
      {
        text: '拍照',
        onPress: () => {
          void launchCamera().then(resolve);
        },
      },
      { text: '取消', style: 'cancel', onPress: () => resolve(null) },
    ]);
  });
}
