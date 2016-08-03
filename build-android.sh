./build.sh
rm -rf cordova/www
rm -rf apk
mkdir cordova/www
mkdir apk
cp -r build/* cordova/www
cd cordova
cordova build android --release
cp platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk ../apk
cp platforms/android/build/outputs/apk/android-x86-release-unsigned.apk ../apk

cd ../apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../catcafe.keystore android-armv7-release-unsigned.apk catcafe
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../catcafe.keystore android-x86-release-unsigned.apk catcafe
/Volumes/Macintosh\ HD/Users/slash/Software/adt-bundle-mac-x86_64-20130717/sdk/build-tools/23.0.1/zipalign -v 4 android-armv7-release-unsigned.apk catcafe-arm.apk
/Volumes/Macintosh\ HD/Users/slash/Software/adt-bundle-mac-x86_64-20130717/sdk/build-tools/23.0.1/zipalign -v 4 android-x86-release-unsigned.apk catcafe-x86.apk
rm android-armv7-release-unsigned.apk
rm android-x86-release-unsigned.apk
cd ..

