# Mera Hisab Android APK

The existing app is a native Expo/React Native app. The Android project is generated at `artifacts/mera-hisab/android/` and uses:

- App name: `Mera Hisab`
- Application ID: `com.merahisab.app`
- Local AsyncStorage persistence
- Local JavaScript bundle embedded in the APK
- Custom icon: `assets/images/mera-hisab-icon.png`
- Splash screen configured in `app.json`

The installed APK does not need the Replit website, API server, or an internet connection to open the app or use its local records. Internet is only relevant to optional device actions such as WhatsApp.

## Build a debug APK

From the repository root:

```bash
cd artifacts/mera-hisab
pnpm install
cd android
./gradlew assembleDebug
```

The debug APK will be at:

```text
artifacts/mera-hisab/android/app/build/outputs/apk/debug/app-debug.apk
```

## Build a release APK for local installation

Install Android Studio or the Android command-line tools first, including:

- Android SDK Platform 36
- Android SDK Build-Tools 36.0.0
- Android NDK 27.1.12297006
- Android SDK Platform-Tools

Set the Android SDK path before building:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
```

Then run:

```bash
cd artifacts/mera-hisab/android
./gradlew assembleRelease
```

The installable release APK will be at:

```text
artifacts/mera-hisab/android/app/build/outputs/apk/release/app-release.apk
```

The generated Expo project uses the debug keystore for this local release build. That is suitable for sideloading and testing. For Google Play or a production-signed APK, replace the release signing configuration with a private keystore that you control; do not commit that keystore or its passwords.

## Regenerate the native project after app configuration changes

Run this only when native configuration in `app.json` changes:

```bash
cd artifacts/mera-hisab
pnpm exec expo prebuild --platform android --no-install
```

Do not use `--clean` unless you intentionally want Expo to recreate the `android/` directory.

## Android behavior

- The app embeds the production JavaScript bundle during `assembleDebug`/`assembleRelease`.
- Business data remains on-device in AsyncStorage.
- Android back presses are handled by Expo Router and fall back to the operating system when there is no previous route.
- Bill PDF generation uses `expo-print`.
- System printing uses the Android print service through `expo-print`.
- JSON backup export/import uses the Android document/share sheets.
- WhatsApp uses the Android share/deep-link mechanisms and never sends automatically.