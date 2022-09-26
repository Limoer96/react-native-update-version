# rn-update-version

Download and update react-native app on android, customize your own UI.

## Installation

```sh
npm install rn-update-version
# or
yarn add rn-update-version
```

## Usage

```tsx
import UpdateVersion from 'rn-update-version';

// ...
const [percent, setPercent] = React.useState(0);
const [errorMessage, setErrorMessage] = React.useState('');
UpdateVersion.update({ url: MOCK_URL });
UpdateVersion.cancel();
useEffect(() => {
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
```

> or use `useUpdateVersion` hook

```tsx
import { useUpdateVersion } from 'rn-update-version';
// ...
const { update, cancel, progress, errorMsg } = useUpdateVersion();
```

## API

### update(config: UpdateConfig)

> Start update action, donwload and install app.

### cancel

> Cancel the update process.

### listen(onProgress: (payload: ProgressPayload) => void,onError?: (payload: ErrorPayload) => void)

> Event listeners during the update process.

### useUpdateVersion

> React hooks for the update process.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
