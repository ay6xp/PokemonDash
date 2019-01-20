
import SpriteSheet from './SpriteSheet.js';
import { createAnim } from './Animation.js';

export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

export function loadJSON(url) {
    return fetch(url).then(r => r.json()).catch(e => console.log(e));
}

export async function loadSpriteSheet(name) {   

    const sheetSpec = await loadJSON(`/sprites/${name}.json`);
    const image = await loadImage(sheetSpec.imageURL);
    const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
    if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach(tileSpec => {
            sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1]);
        });
    }

    if (sheetSpec.frames) {
        sheetSpec.frames.forEach(frameSpec=> {
            sprites.define(frameSpec.name, ...frameSpec.rect);
        });
    }

    if (sheetSpec.animations) {
        sheetSpec.animations.forEach(animSpec=> {
            const animation = createAnim(animSpec.frames, animSpec.frameLen);
            sprites.defineAnim(animSpec.name, animation);
        });
    }

    return sprites;
            
}   