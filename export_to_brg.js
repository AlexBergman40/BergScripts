//requires the tileset to be in indexed color palette
const TILE_SIZE = 8;
const color = app.pixelColor;
const image = app.activeImage;
const palette = app.activeSprite.palette;
var dialog

function getPaletteIndex(x, y)
{
    var pixelC = color.rgbaR(image.getPixel(x, y));
    //console.log("x: " + x + " y: " + y + " color: " + pixelC);

    return pixelC;
}

function setPixelIndex(byte, colorindex, x)
{
    //half a byte per pixel
    //x%2 = 0 left half 
    //x%2 = 1 right half
    //reading left to right
    byte |= (colorindex << (1 - (x % 2))*4)

    return byte
}



//build a uint8array which holds the index of two pixels per byte.
//even pixels are stored in the left half of the byte
//odd pixels are stored in the right half of the byte
function buildTileArray()
{
    var out = [];

    for (var y = 0; y < image.height; y++){
        for (var x = 0; x < image.width; x ++){

            var byte = Uint8Array[1];

            //left half of the byte
            colorIndex = getPaletteIndex(x, y);
            byte = setPixelIndex( byte, colorIndex, x );

            //right half of the byte
            colorIndex = getPaletteIndex(++x, y);
            byte = setPixelIndex( byte, colorIndex, x );

            out.push(byte);
        }
    }

    var combinedArray = new Uint8Array(out);

    return combinedArray;
}

const eventHandlers = {
    init:function(){
        if(!app.activeImage){
            app.createDialog('Error').addLabel('Need an image to export to bitmap');
            return;
        }
        
        if (dialog)
            dialog.close();
        dialog = app.createDialog('dialog');
        dialog.addLabel('File Name');
        dialog.addEntry("File Name", "fileName");
        dialog.addBreak();
        dialog.addButton("Run", "run");
    },

    run_click:function(){
        dialog.close();
        dialog = null;

        
        const filename = storage.get("fileName");
        var tileSheetString = buildTileArray();

        storage.set(tileSheetString, "brg", filename);
        const path = storage.save("brg", filename);
        console.log(path);
        console.log("Is this thing on?");
    }
}

function onEvent(eventName){
    var handler = eventHandlers[eventName]
    if (typeof handler == 'function')
        handler();
}
