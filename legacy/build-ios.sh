./build.sh
rm -rf cordova/www
mkdir cordova/www
cp -r build/* cordova/www
cd cordova
cordova build ios
cd ..

