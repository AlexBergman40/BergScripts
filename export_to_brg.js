//requires the tileset to be in indexed color palette
const TILE_SIZE = 8;
const color = app.pixelColor;
const image = app.activeImage;
const palette = app.activeSprite.palette;

function getPaletteIndex(x, y)
{
    var pixelC = color.rgbaR(image.getPixel(x, y));
    //console.log("x: " + x + " y: " + y + " color: " + pixelC);

    return pixelC;
}

function setPixelIndex(array, index, row, col)
{
    for (var i = 0; i < 4; i++)
    {
        array[ row+(i*8) ] |= (((index >> i) & 1) << col);
    }
}

//This function builds each tile as an 32 byte Uint8Array.
//Each row of pixels is represented by 4 bytes, row n is represented by
//bytes n, n+8, n+16, n+24
//Each pixel in the row has a color index from 0 to 15, in binary.
//pixel x,y is byte y+24 bit x, byte y+16 bit x, byte y+8 bit x, byte y bit x

function buildTileArray()
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
var tileSheetString = buildTileArray();

storage.set(tileSheetString, "brg", filename);
const path = storage.save("brg", filename);
console.log(path);
console.log("Is this thing on?");
