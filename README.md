
# LocalNotes

Last Edit: 02.2024 <br>
Language: Typescript React Capacitor<br>

With this app, it is possible to securely store notes locally with AES & Triple DES encryption, edit/delete them and search them.
It is also possible to decrypt the notes using native biometrics (e.g. fingerprint sensor). (More on this under Security)

Google Play Store: https://play.google.com/store/apps/details?id=de.scheub.localNotes
<br />
Apple App Store: https://apps.apple.com/de/app/local-notes/id6474680128
<br><br><br>

Deutsche Kurzbeschreibung:
Mit dieser App ist es möglich Notizen mit AES-Verschlüsselung & TripleDES sicher lokal zu speichern, sie zu bearbeiten/löschen und sie zu durchsuchen.
Zudem ist es möglich mithilfe der Native Biometric (z.B. Fingerabdruck Sensor) die Notizen zu entschlüsseln. (Mehr dazu unter Security)

| Start Screen | Notes Overview | Note Edit | Settings |
|--------------|----------------|-----------|-----------|
| <img src="images/startScreen.jpeg" alt="Start Screen" height="300"> | <img src="images/notesOverview.png" alt="Notes Overview" height="300"> | <img src="images/editScreen.jpeg" alt="Note Edit" height="300"> | <img src="images/settingsScreen.png" alt="Note Edit" height="300"> |

## Security
First of all: All notes are stored encrypted with AES256. 

- The user's password is first hashed using PBKDF2 with 60,001 iterations and a fixed salt.
- This hash is then passed through 2,000 iterations using PBKDF2 with a different salt for each note. 
- The resulting hash is then used for AES256 encryption.
- In addition, the data is encrypted with a SHA256 hash based on the device ID using TripleDES.
- No data is transferred to a cloud or similar. 
- All data is processed and stored locally on the device.
<img src="images/encryptionDataFlow.png" alt="Encryption Engine Work Flow">

### Justification
- Why is PBKDF2 performed twice? 
  - So that it is possible to use a different salt for each note. This increases the protection against rainbow table attacks.
  - In addition, the recommended number of iterations for PBKDF2 can still be carried out without extremely poor performance. This increases protection against Brutal Force Attacks.
  - Such a high number of iterations in combination with different salts for each note has proven to be very slow and impractical on current devices (e.g. iPhone 14).
  - Furthermore, if a single note is decrypted, the others are not threatened.

- Why just use SHA256 for the PBKDF2?
  - Quick answer, simply because of the performance. 
  - With a SHA512 hash for the login, a current Android flagship smartphone (from 2023) took an average of 50 seconds and a current iPhone around 15 seconds. 
  - Since the performance with SHA256 is significantly better with Android around 10 seconds and iPhone 2-3 seconds, this was used.

- Why AES and TripleDES?
  - AES256 is currently the general recommendation. And since the goal was to use an additional encryption with a different password (here the deviceID), it was the right opportunity to use a different method.
  - So if AES256 or TripleDES have security problems, this can work as a further protection measure. 
  - It also increases the effort for attackers as they have to decrypt two different methods.
  - Since it also offers no disadvantages (except performance), e.g. a hack of the TripleDES encryption still leads to the AES encryption having to be decrypted, the advantages were seen to outweigh the disadvantages. 


<br />

### Encryption Engine Flow

The encryption and decryption process is also shown here. 
The password is already understood to be the PBKDF2 processed hash with 60,001 iterations, as only this is used within the application as soon as it has been generated after opening the app.

Anyone interested is free to take a closer look at this and make suggestions for improvement. The entire encryption/decryption logic takes place in the EncryptionEngine. (Except the logic of the biometric login)
<img src="images/EncryptionEngineFlow.png" alt="Encryption Engine Work Flow" height="600">
<br /><br /><br />

### Security Fingerprint Login
- The password is stored in the KeyStore on Android and in the keychain on iOS if biometric authentication is enabled. These stores are secure according to the OS publisher. 
If this is not used, the password is not saved either.
- Only the first PBKDF2 hash from the first derivation is used. No password in plain text or similar. This is also the reason for the significantly faster login with a biometric login.
- The password hash is encrypted with TripleDES as it does not usually need to be decrypted frequently.
- The password hash is encrypted with a SHA256 hash from the deviceID/identifier of the device provided by Capacitor before it is stored. (Just to be safe and independent of OS security.)

    <i>On iOS, the identifier is a UUID that uniquely identifies a device to the app’s vendor ([read more](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor)).
     
    On Android 8+, __the identifier is a 64-bit number (expressed as a hexadecimal string)__, unique to each combination of app-signing key, user, and device ([read more](https://developer.android.com/reference/android/provider/Settings.Secure#ANDROID_ID)).</i>

### Security Export/Import
- When the notes are exported, they are no longer encrypted with the SHA256 hash of the DeviceID. However, they are encrypted using AES with a specific word which is hard-coded here.

- As before, the notes are also encrypted with PBKDF2 and should only be decryptable with the user's password. 

- When importing the data, the data must be decrypted with the user's password, otherwise it should not be visible.

### Note on the security measures
- The secure encryption of data/notes cannot be guaranteed. 
- The application has been developed to be as secure as possible from the developer's point of view. 
- It is open to anyone to review the security measures here and report any security vulnerabilities identified here. (This is why the application is open source)
- The Crypto-JS node package is used for encryption. If this has security gaps or similar, the data here is insecure!

## Distribution
- Android/iOS: The app is distributed in the Google Play Store and Apple App Store with the help of Capacitor.
- Windows: With the help of Electron, it is distributed in the Microsoft App Store as MSI. Installation. (Without support for Windows Hello/fingerprint scanner)
- Mac: It is possible to use the Electron app from the repo. However, it is recommended to simply download the iOS app from the Apple App Store for M1 MacBooks. This app also supports Touch ID etc. directly.

## Automated Build & Deployment

This project uses GitHub Actions for automated building and deployment:

### Continuous Integration
- **Automatic testing**: Every push and pull request triggers automated tests with coverage reporting
- **Build validation**: Ensures the app builds successfully across all target platforms
- **Dependency security**: Automated security auditing and vulnerability detection

### Deployment Workflows
- **iOS Deployment**: Automated build and deployment to TestFlight for beta testing and App Store for production
- **Android Deployment**: Automated build and deployment to Google Play Store with internal testing
- **Release Management**: Tagged releases automatically trigger deployment to both platforms

### Setup & Configuration
For detailed setup instructions including required secrets and deployment configuration, see [GitHub Actions Setup Guide](.github/DEPLOY.md).

Quick deployment:
```bash
# Create and push a release tag to trigger deployment
git tag v1.4.1
git push origin v1.4.1
```

Or manually trigger deployment from the Actions tab in GitHub.

## Testing
The Jest testing framework is used for testing.
The tests here are always written in Typescript. 

Under modules are modules from other projects of mine for which I have not written further tests.

The goal is actually to have about 80% test coverage. This number appears to be enough as this is a freetime project.


File                                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------------------------|---------|----------|---------|---------|-------------------
All files                                      |   87.16 |    65.32 |   88.42 |   87.22 |                   
 src                                           |     100 |      100 |     100 |     100 |                   
  App.tsx                                      |     100 |      100 |     100 |     100 |                   
  i18n.ts                                      |     100 |      100 |     100 |     100 |                   
  index.tsx                                    |     100 |      100 |     100 |     100 |                   
 src/custom_components/handleNotes             |      90 |      100 |   85.71 |      90 |                   
  encryptionEngine.ts                          |      90 |      100 |   85.71 |      90 | 23-30             
 src/custom_components/handleNotes/editNote    |     100 |       50 |     100 |     100 |                   
  container-editNote.tsx                       |     100 |       50 |     100 |     100 | 20-44             
  screen-editNote.tsx                          |     100 |      100 |     100 |     100 |                   
 src/custom_components/handleNotes/viewNote    |   95.55 |       70 |     100 |   95.23 |                   
  container-viewNote.tsx                       |     100 |      100 |     100 |     100 |                   
  getNotes.ts                                  |   96.29 |    66.66 |     100 |      96 | 19                
  screen-viewNote.tsx                          |   88.88 |       75 |     100 |    87.5 | 28                
 src/custom_components/notNotesRelated         |   97.72 |    92.85 |     100 |   97.72 |                   
  fingerprintLogic.ts                          |   97.72 |    92.85 |     100 |   97.72 | 60                
 ...omponents/notNotesRelated/encryption_modal |   97.05 |      100 |   93.33 |   97.05 |                   
  container-encryption-modal.tsx               |     100 |      100 |     100 |     100 |                   
  screen-encryption-modal.tsx                  |   83.33 |      100 |   66.66 |   83.33 | 45                
 src/custom_components/notNotesRelated/navBar  |   84.61 |    68.42 |   85.71 |   84.61 |                   
  container-navBar.tsx                         |   83.33 |    61.53 |   83.33 |   83.33 | 26,45-47          
  screen-navBar.tsx                            |     100 |    83.33 |     100 |     100 | 61                
 ...custom_components/notNotesRelated/settings |   64.03 |    28.94 |   63.63 |   64.28 |                   
  container_settings.tsx                       |   60.57 |    16.66 |      50 |   60.78 | ...59-175,181-193 
  screen_settings.tsx                          |     100 |       75 |     100 |     100 | 44-61             
 ..._components/notNotesRelated/welcomeOverlay |     100 |      100 |     100 |     100 |                   
  welcomeOverlay.tsx                           |     100 |      100 |     100 |     100 |                   
 src/modules/app_configuration                 |     100 |      100 |     100 |     100 |                   
  app_texts.ts                                 |     100 |      100 |     100 |     100 |                   
 src/modules/legal                             |     100 |    71.42 |     100 |     100 |                   
  codeToTextParser.tsx                         |     100 |      100 |     100 |     100 |                   
  datenschutz.tsx                              |     100 |       50 |     100 |     100 | 20-37             
  impressum.tsx                                |     100 |       50 |     100 |     100 | 17-34             
 src/modules/legal/usedLibs                    |     100 |      100 |     100 |     100 |                   
  container_usedLibList.tsx                    |     100 |      100 |     100 |     100 |                   
  screen_usedLibList.tsx                       |     100 |      100 |     100 |     100 |                   
 src/modules/ui                                |     100 |      100 |     100 |     100 |                   
  floatingBtn.tsx                              |     100 |      100 |     100 |     100 |               
     


## Architecture
The components used are divided into two categories:
- `custom_components`: Components which I only use in this project. These are on the left and in the middle of the architecture diagram.
- `modules`: Components/functions that I also use in other projects, which are therefore kept generic. (Possibly, however, slightly adapted e.g. the colors here)  These components can be seen on the right of the architecture diagram. (Except for the floating button which is left)

As a result of the use from the modules, there is also one configuration file:
- `app_texts`: Contains texts such as the description, imprint text, data protection text etc.

![Local Notes Architecture](images/LocalNotesArchitecture.png)
Note: The cookie banner and footer text are already present here as they may be used in the future for the web version.

## Troubleshooting

### While generate Electron App for Windows/Mac/LNX

```
node_modules/builder-util-runtime/out/httpExecutor.d.ts:9:5 - error TS2411: Property '"accept-charset"' of type 'string | string[]' is not assignable to 'string' index type 'string'.

9     [key: string]: string;
      ~~~~~~~~~~~~~~~~~~~~~~
```

For whatever reason, this NPM module is not 100% compatible. The easy fix is to simply change the location in the error so that the file type matches.
Just adjust the module inside the Electron folder under node_modules by adjust the line:
```
export interface RequestHeaders extends OutgoingHttpHeaders {
    [key: string]: string | string[]|number | undefined;
}
```

is adapted to this:
export interface RequestHeaders extends OutgoingHttpHeaders {
    [key: string]: string | string[];
}



## Available Scripts

In the project directory you can run the following npm scripts (current scripts are taken from `package.json`):

### `npm run dev` or `npm start`

Starts the development server using Vite.
Open http://localhost:5173 in your browser (Vite's default port) to view the app.
The page reloads on changes and hot module replacement (HMR) is enabled.

### `npm run build`

Creates a production build using Vite and outputs optimized files to the `dist` folder.

### `npm run preview`

Locally previews the production build (serves the `dist` output).

### `npm test`

Runs the Jest test suite (configured to use `ts-jest` for TypeScript). This is the project's primary test command and runs tests in a single process.

### `npm run test:vitest`

An alias to run Vitest (optional). The project currently uses Jest by default but a Vitest configuration remains available as an alternative.

### `npm run electron-pack`

Builds an unpacked Electron application (developer-friendly output). This uses `electron-builder` with the `--dir` option.

### `npm run electron-dist`

Creates distributable packages for desktop platforms (platform-specific targets like `dmg`, `nsis`, etc.) via `electron-builder`.

Notes
- Dev server: Vite serves on port 5173 by default. If you have a different port configured or a proxy, adjust accordingly.
- Tests: run `npm test` for Jest. If you prefer Vitest, use the `test:vitest` script, but some tests rely on Jest semantics (e.g. jest.mock hoisting).
- If you encounter engine or install warnings (EBADENGINE), consider using a stable Node LTS (18.x or 20.x) via nvm.



## Used NPM Modules
According to the command npm list
You can see the deeper NPM modules used and which of these are used in the licenses.json.

<br /> ├── @babel/core@7.28.4
<br /> ├── @babel/plugin-proposal-private-property-in-object@7.21.11
<br /> ├── @babel/preset-env@7.28.3
<br /> ├── @capacitor-community/electron@5.0.1
<br /> ├── @capacitor/android@7.4.3
<br /> ├── @capacitor/app@7.1.0
<br /> ├── @capacitor/cli@7.4.3
<br /> ├── @capacitor/core@7.4.3
<br /> ├── @capacitor/device@7.0.2
<br /> ├── @capacitor/filesystem@7.1.4
<br /> ├── @capacitor/ios@7.4.3
<br /> ├── @capacitor/share@7.0.2
<br /> ├── @emotion/react@11.14.0
<br /> ├── @emotion/styled@11.14.1
<br /> ├── @mui/material@7.3.4
<br /> ├── @testing-library/dom@10.4.1
<br /> ├── @testing-library/jest-dom@6.9.1
<br /> ├── @testing-library/react@16.3.0
<br /> ├── @testing-library/user-event@14.6.1
<br /> ├── @types/crypto-js@4.2.2
<br /> ├── @types/jest@30.0.0
<br /> ├── @types/node@24.7.2
<br /> ├── @types/react-dom@19.2.2
<br /> ├── @types/react@19.2.2
<br /> ├── @vitejs/plugin-react@5.0.4
<br /> ├── babel-jest@30.2.0
<br /> ├── bootstrap-icons@1.13.1
<br /> ├── bootstrap@5.3.8
<br /> ├── capacitor-native-biometric@4.2.2
<br /> ├── crypto-js@4.2.0
<br /> ├── electron-builder@26.0.12
<br /> ├── i18next-browser-languagedetector@8.2.0
<br /> ├── i18next@25.6.0
<br /> ├── identity-obj-proxy@3.0.0
<br /> ├── jest-environment-jsdom@30.2.0
<br /> ├── jest@30.2.0
<br /> ├── jsdom@24.1.3
<br /> ├── license-checker@25.0.1
<br /> ├── react-bootstrap@2.10.10
<br /> ├── react-dom@19.2.0
<br /> ├── react-i18next@16.0.1
<br /> ├── react-icons@5.5.0
<br /> ├── react-router-dom@7.9.4
<br /> ├── react-router@7.9.4
<br /> ├── react@19.2.0
<br /> ├── ts-jest@29.4.5
<br /> ├── typescript@5.9.3
<br /> ├── vite@5.4.20
<br /> └── vitest@1.6.1