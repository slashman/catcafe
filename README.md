# Cat Cafe

A game where you are the waitress on a Cat Cafe and have to deliver desserts to impatient cats.

![cat cafe title](./screenshot.png)

# Developer Notes

- `npm install -g cordova`
- `npm install`

## Running the local browser

- `npm run build`
- `cordova prepare`
- `cordova run browser`
- *Cordova will automatically start a browser pointing to `http://localhost:8080/index.html`*

## Running the iOS Simulator

- `npm run build`
- `cordova prepare`
- Open `platforms/ios` in XCode
- Build or Run from there

## Running on Android

- `npm run build`
- `cordova prepare`
- Open `platforms/android` in Android Studio
- Build or Run from there