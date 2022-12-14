import * as React from 'react';

import { StyleSheet, View, Text, Button, Platform } from 'react-native';
import UpdateVersion from 'rn-update-version';

const MOCK_URL =
  'https://file-007.obs.cn-southwest-2.myhuaweicloud.com/software/apk/starbridge-peach-v.1.13.0.apk';

export default function App() {
  const [percent, setPercent] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  function handleUpdate() {
    if (Platform.OS === 'ios') {
      UpdateVersion.update({ appleId: '444934666' });
    } else {
      UpdateVersion.update({ url: MOCK_URL });
    }
  }
  function handleCancel() {
    UpdateVersion.cancel();
  }
  React.useEffect(() => {
    const remove = UpdateVersion.listen(
      (payload) => {
        setPercent(payload.percent);
      },
      (info) => {
        setErrorMessage(info.message!);
      }
    );
    return remove;
  }, []);
  return (
    <View style={styles.container}>
      <Button title="update" onPress={handleUpdate} />
      <Button title="cancel" onPress={handleCancel} />
      {errorMessage ? (
        <Text>Error: message</Text>
      ) : (
        <Text>Download: {`${percent}%`}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
