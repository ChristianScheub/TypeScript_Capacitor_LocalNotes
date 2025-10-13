# GitHub Actions Setup Guide

This document describes the GitHub Actions workflows setup for building and deploying the Local Notes app to iOS and Android platforms.

## Workflows Overview

### 1. CI/CD Pipeline (`ci.yml`)
- **Trigger**: Push to main/develop branches, Pull Requests
- **Purpose**: Run tests, linting, and build validation
- **Actions**: Install dependencies, run tests with coverage, build project, upload artifacts

### 2. iOS Build & Deploy (`ios-deploy.yml`)
- **Trigger**: Git tags starting with 'v*', Manual workflow dispatch
- **Purpose**: Build iOS app and deploy to TestFlight
- **Platform**: macOS latest with latest stable Xcode

### 3. Android Build & Deploy (`android-deploy.yml`)
- **Trigger**: Git tags starting with 'v*', Manual workflow dispatch
- **Purpose**: Build Android app and deploy to Google Play Store
- **Platform**: Ubuntu latest with Java 17

## Required Secrets

To enable the workflows, configure the following secrets in your GitHub repository settings:

### iOS Deployment Secrets

| Secret Name | Description | How to obtain |
|-------------|-------------|---------------|
| `IOS_PROVISIONING_PROFILE` | Base64 encoded provisioning profile | Download from Apple Developer portal, encode with `base64 -i profile.mobileprovision` |
| `IOS_CERTIFICATE` | Base64 encoded distribution certificate (.p12) | Export from Keychain Access, encode with `base64 -i certificate.p12` |
| `IOS_CERTIFICATE_PASSWORD` | Password for the distribution certificate | Set when exporting certificate |
| `IOS_TEAM_ID` | Apple Developer Team ID | Found in Apple Developer portal membership details |
| `APP_STORE_CONNECT_USERNAME` | App Store Connect username | Your Apple ID email |
| `APP_STORE_CONNECT_PASSWORD` | App Store Connect app-specific password | Generate in Apple ID account settings |

### Android Deployment Secrets

| Secret Name | Description | How to obtain |
|-------------|-------------|---------------|
| `ANDROID_KEYSTORE` | Base64 encoded Android keystore file | Encode existing keystore with `base64 -i keystore.jks` |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password | Password used when creating keystore |
| `ANDROID_KEY_ALIAS` | Key alias in keystore | Alias used when creating signing key |
| `ANDROID_KEY_PASSWORD` | Key password | Password for the signing key |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Google Play Console service account JSON | Create service account in Google Cloud Console |

### Coverage Reporting (Optional)

| Secret Name | Description | How to obtain |
|-------------|-------------|---------------|
| `CODECOV_TOKEN` | Codecov upload token | Sign up at codecov.io and get repository token |

## Setup Instructions

### Initial Setup

1. **Fork/Clone Repository**: Ensure you have admin access to set up secrets
2. **Configure Secrets**: Go to repository Settings > Secrets and variables > Actions
3. **Add all required secrets** based on the tables above

### iOS Setup

1. **Apple Developer Account**:
   - Ensure you have a paid Apple Developer account
   - Create App ID matching `de.scheub.localNotes`
   - Create distribution certificate and provisioning profile

2. **App Store Connect**:
   - Create app in App Store Connect
   - Generate app-specific password for deployment

3. **Xcode Project**:
   - Ensure signing configuration is set to automatic
   - Bundle identifier must match the provisioning profile

### Android Setup

1. **Google Play Console**:
   - Create app in Google Play Console
   - Set up internal testing track

2. **Service Account**:
   - Create service account in Google Cloud Console
   - Grant necessary permissions in Google Play Console
   - Download JSON key file

3. **Keystore**:
   - Use existing keystore or create new one for signing
   - Store securely and backup

## Usage

### Manual Deployment

1. **iOS**: Go to Actions tab > iOS Build & Deploy > Run workflow
   - Set "Deploy to TestFlight" to true for TestFlight upload
2. **Android**: Go to Actions tab > Android Build & Deploy > Run workflow
   - Set "Deploy to Google Play Store" to true for Play Store upload

### Automatic Deployment

1. **Create Git Tag**: `git tag v1.0.0 && git push origin v1.0.0`
2. **Both iOS and Android workflows will trigger automatically**
3. **Artifacts will be uploaded to both stores**

## Build Artifacts

All workflows upload build artifacts that can be downloaded from the Actions tab:

- **CI Pipeline**: `build-files` (web build output)
- **iOS**: `ios-app` (signed IPA file)
- **Android**: `android-apk` (signed APK), `android-bundle` (AAB for Play Store)

## Troubleshooting

### Common Issues

1. **iOS Signing Errors**:
   - Check provisioning profile matches bundle ID
   - Ensure certificate is valid and not expired
   - Verify team ID is correct

2. **Android Build Errors**:
   - Check Java version compatibility
   - Verify keystore and key passwords
   - Ensure all Gradle dependencies are available

3. **Capacitor Sync Issues**:
   - Make sure `capacitor.config.ts` is properly configured
   - Check that iOS and Android platforms are added

### Security Notes

- Never commit signing certificates or keystores to git
- Use app-specific passwords for App Store Connect
- Regularly rotate API keys and service account credentials
- Keep base64 encoded secrets secure and backed up

## Maintenance

- **Update workflows**: Review and update GitHub Actions annually
- **Renew certificates**: iOS certificates expire yearly
- **Update dependencies**: Keep Capacitor and build tools updated
- **Monitor builds**: Check action logs for any warnings or deprecations