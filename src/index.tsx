import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rn-update-version' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const isIOS = Platform.OS === 'ios';

export interface UpdateConfig {
  url?: string;
  apkName?: string;
  appleId?: string;
}

interface ProgressPayload {
  /**
   * 上传进度0-100整数
   */
  percent: number;
  max?: number;
  progress?: number;
  /**
   * 下载完成后的路径
   */
  apkPath?: string;
}
interface ErrorPayload {
  /**
   * 错误信息
   */
  message?: string;
}
interface UpdateVersionType {
  /**
   * 启动应用更新（下载apk并安装）
   */
  update: (config: UpdateConfig) => void;
  /**
   * 取消应用更新
   */
  cancel: () => void;
  /**
   * 更新过程中事件监听
   */
  listen: (
    onProgress: (payload: ProgressPayload) => void,
    onError?: (payload: ErrorPayload) => void
  ) => () => void;
}

interface NativeUpdateVersionType extends Omit<UpdateVersionType, ''> {
  /**
   * 启动应用更新（下载apk并安装）
   */
  update: (config: Omit<UpdateConfig, 'appleId'>) => void;
  /**
   * ios更新（跳转到应用商店）
   */
  updateIOS: (config: Pick<UpdateConfig, 'appleId'>) => void;
}

const UpdateVersionNative: NativeUpdateVersionType = NativeModules.UpdateVersion
  ? NativeModules.UpdateVersion
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const UpdateVersion: UpdateVersionType = {
  cancel: () => {
    if (isIOS) {
      return;
    }
    UpdateVersionNative.cancel();
  },
  listen: (onProgress, onError) => {
    const eventEmitter = new NativeEventEmitter(NativeModules.UpdateVersion);
    const progressChangeEvent = eventEmitter.addListener(
      'downloadProgress',
      (payload) => {
        onProgress(payload);
      }
    );
    const errorEvent = eventEmitter.addListener('error', (payload) => {
      onError?.(payload);
    });
    return () => {
      progressChangeEvent.remove();
      errorEvent.remove();
    };
  },
  update: (config) => {
    if (config.appleId) {
      UpdateVersionNative.updateIOS({ appleId: config.appleId });
    } else {
      UpdateVersionNative.update({ url: config.url, apkName: config.apkName });
    }
  },
};

/**
 * 用户处理更新进度的hooks（如果不自定义事件监听）
 * @returns
 */
export const useUpdateVersion = () => {
  const [progress, setProgress] = useState<ProgressPayload>();
  const [errorMsg, setErrorMsg] = useState('');
  useEffect(() => {
    const remove = UpdateVersion.listen(
      (payload) => {
        setProgress(payload);
      },
      (info) => {
        setErrorMsg(info.message!);
      }
    );
    return remove;
  }, []);
  return {
    update: UpdateVersion.update,
    cancel: UpdateVersion.cancel,
    progress,
    errorMsg,
  };
};

export default UpdateVersion;
