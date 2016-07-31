// Based on http://www.zachstronaut.com/posts/2012/08/17/webgl-fake-crt-html5.html

// Make sure you've included the glfx.js script in your code!

// Here I load a PNG with scanlines that I overwrite onto the 2D game's canvas.
// This file happens to be customized for the demo game, so to make this a
// general solution we'll need a generic scanline image or we'll generate them
// procedurally.
// Start loading the image right away, not after the onload event.
//var lines = new Image();
//lines.src = 'media/scanlines-vignette-4gl.png';
//lines.src = 'img/scanlines.png';

//window.addEventListener('load', fakeCRT, false);

function fakeCRT() {
    var glcanvas, source, srcctx, texture, w, h, hw, hh, w75;
    
    // Try to create a WebGL canvas (will fail if WebGL isn't supported)
    try {
        glcanvas = fx.canvas();
    } catch (e) {return;}
    
    // Assumes the first canvas tag in the document is the 2D game, but
    // obviously we could supply a specific canvas element here.
    source = document.getElementsByTagName('canvas')[0];
    //srcctx = source.getContext('2d');
    
    // This tells glfx what to use as a source image
    texture = glcanvas.texture(source);
    
    // Just setting up some details to tweak the bulgePinch effect
    w = source.width;
    h = source.height;
    hw = w / 2;
    hh = h / 2;
    w75 = w * 0.75;

    // Hide the source 2D canvas and put the WebGL Canvas in its place
    source.parentNode.insertBefore(glcanvas, source);
    source.style.display = 'none';
    glcanvas.className = source.className;
    glcanvas.id = source.id;
    glcanvas.style.width = source.style.width;
    glcanvas.style.height = source.style.height;
    glcanvas.style.marginLeft = source.style.marginLeft;
    glcanvas.style.marginRight = source.style.marginRight;
   // glcanvas.imageSmoothingEnabled = false;
    source.id = 'old_' + source.id;

    var tvOverlay = document.getElementById('scanlines');
    var canvasMargin = parseInt(glcanvas.style.marginLeft.substr(0, glcanvas.style.marginLeft.indexOf("px")));
    var originalDistance = 418;
    var scale = tvOverlay.clientWidth / 1755;
    var realDistance = Math.round(originalDistance * scale);
    tvOverlay.style.left = (canvasMargin-realDistance)+"px" ;

    // It is pretty silly to setup a separate animation timer loop here, but
    // this lets us avoid monkeying with the source game's code.
    // It would make way more sense to do the following directly in the source
    // game's draw function in terms of performance.
    setInterval(function () {
        
        
        // Give the source scanlines
        //srcctx.drawImage(lines, 0, 0, w, h);
        
        // Load the latest source frame
        texture.loadContentsOf(source);
        
        // Apply WebGL magic
        glcanvas.draw(texture)
            .bulgePinch(hw, hh, w75, 0.12)
            .vignette(0.25, 0.74)
            .update();
    }, Math.floor(1000 / 40));
}

module.exports = fakeCRT;