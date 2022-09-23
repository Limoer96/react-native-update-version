import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-update-version' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

interface UpdateConfig {
  url: string;
  apkName?: string;
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

const UpdateVersion: UpdateVersionType = NativeModules.UpdateVersion
  ? NativeModules.UpdateVersion
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

UpdateVersion.listen = (onProgress, onError) => {
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
};

export default UpdateVersion;
