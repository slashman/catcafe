import CatCafe from './CatCafe'

const onDeviceReady = () => {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');


    CatCafe.init()
}


window.onload = () => {
    console.log('startup')
    document.addEventListener('deviceready', onDeviceReady, false)
}

