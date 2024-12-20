//for each 8x8 tile
//each 8x8 tile is 8 / width and 8 / height of the image
const TILE_SIZE = 8;
const color = app.pixelColor;
const image = app.activeImage;
const palette = app.activeSprite.palette;

function getPaletteIndex(x, y)
{
    var pixelC = color.rgbaR(image.getPixel(x, y));

    return pixelC;
}

function setPixelIndex(array, index, row, col)
{
    for (var i = 0; i < 4; i++)
    {
        array[ row+(i*8) ] |= (((index >> i) & 1) << col);
    }
}

function Uint8ToStr(array) {
    var out, i;
    out = "";
    while (i < 32)
    {
        out += String.fromCharCode(array[i]);
    }
    return out;
}

function buildTileString()
{
    var out = [];

    for (var y = 0; y < image.height; y += TILE_SIZE){
        for (var x = 0; x < image.width; x += TILE_SIZE){

            var tile = new Uint8Array(8*4);

            for (var row = 0; row < TILE_SIZE; row++){
                for (var col = 0; col < TILE_SIZE; col++){

                    colorIndex = getPaletteIndex(col + x, row + y);
                    setPixelIndex(tile, colorIndex, row, col);

                }
            }

            out.push(tile);
        }
    }

    var combinedArray = new Uint8Array(out.length * 32);
    for (var i = 0; i < out.length; i++){
        combinedArray.set(out[i], i * 32);
    }

    return combinedArray;
}

const filename = "helloworld";
var tileSheetString = buildTileString();

storage.set(tileSheetString, "brg", filename);
const path = storage.save("brg", filename);
console.log(path);
console.log("Is this thing on?");
