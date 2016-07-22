rm -rf build
mkdir build
mkdir build/img
mkdir build/wav
mkdir build/ogg
mkdir build/mp3
cp html/* build
cp jslib/* build
cp res/png/* build/img
cp res/wav/* build/wav
cp res/mp3/* build/mp3
cp res/ogg/* build/ogg
browserify -t uglifyify src/CatCafe.js -o build/catCafe.min.js