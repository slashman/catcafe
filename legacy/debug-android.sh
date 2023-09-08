./build.sh
rm -rf cordova/www
mkdir cordova/www
cp -r build/* cordova/www
cd cordova
cordova run android
cd ..

