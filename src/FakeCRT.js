// This module is based on @zacharyjohnson article at http://www.zachstronaut.com/posts/2012/08/17/webgl-fake-crt-html5.html

// This isn't actually being used for the following reason: The way the game scaling
// works (via CSS to the canvas element) doesn't play well with the vignette shader and
// the scanlines rendering proposed here.
// In order for this to work, a manual scaling would be needed to a bigger canvas.

// A different method for scanlines (placing an overlay image over the canvas) is used here.

// This script requires glfx.js

//var lines = new Image();
//lines.src = 'img/scanlines.png';

function fakeCRT() {
    var glcanvas, source, srcctx, texture, w, h, hw, hh, w75;
    
    try {
        glcanvas = fx.canvas();
    } catch (e) {return;}
    
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
    source.id = 'old_' + source.id;

    // Locate the TV overlay 
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