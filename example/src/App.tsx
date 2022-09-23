import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import UpdateVersion from 'react-native-update-version';

const MOCK_URL =
  'https://file-007.obs.cn-southwest-2.myhuaweicloud.com/software/apk/starbridge-peach-v.1.13.0.apk';

export default function App() {
  const [percent, setPercent] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  function handleUpdate() {
    console.log('run this!!!');
    UpdateVersion.update({ url: MOCK_URL });
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
