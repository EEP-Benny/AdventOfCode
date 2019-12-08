import { getInput } from '../utils';

function chunkSubstr(str: string, size: number): string[] {
    // https://stackoverflow.com/a/29202760
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }

    return chunks
}

function getLayers() {
    const imagedata = getInput(8);
    const layersize = 25 * 6;
    const layers = chunkSubstr(imagedata, layersize);
    return layers;
}

export function solution1() {
    const layers = getLayers();
    let fewestZeroes = Infinity;
    let result: number;
    layers.forEach(layer => {
        const count = (char: string) => Array.from(layer).filter(c => c === char).length;
        const zeroesCount = count("0");
        if (zeroesCount < fewestZeroes) {
            fewestZeroes = zeroesCount;
            result = count("1") * count("2");
        }
    })
    return result;
}

enum Color {
    Black = 0,
    White = 1,
    Transparent = 2
}
export function solution2() {
    const layers = getLayers();
    const mergedLayers: Color[] = new Array(layers[0].length);
    for (let pixelIndex = 0; pixelIndex < mergedLayers.length; pixelIndex++) {
        for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
            const pixelColor = parseInt(layers[layerIndex][pixelIndex]);
            if (pixelColor !== Color.Transparent) {
                mergedLayers[pixelIndex] = pixelColor;
                break;
            }
        }
    }
    const displayablePixels = mergedLayers.map(c => c == Color.White ? "█" : " ");
    return "\n" + chunkSubstr(displayablePixels.join(""), 25).join("\n");
}