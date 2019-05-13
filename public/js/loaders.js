
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


export async function loadBackgroundSpriteSheet(name) {
    const sheetSpec = await loadJSON(`/sprites/${name}.json`);
    const image = await loadImage(sheetSpec.imageURL);
    

    return function getSprites(getbgObjects = false, name = null) {

    const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);
      if(!getbgObjects) {
        if (sheetSpec.tiles) {
            sheetSpec.tiles.forEach(tileSpec => {
                sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1]);          
            });
        } 

      } else {
          if(sheetSpec.bgObjects) {           
            sheetSpec.bgObjects.forEach(obj => {
           
            if(obj.name === name) {
                if (obj.frames) {
                    obj.frames.forEach(frameSpec=> {
                                               
                        sprites.defineTile(frameSpec.name, frameSpec.index[0], frameSpec.index[1]);
                    });
                }
            
                if (obj.animations) {
                    obj.animations.forEach(animSpec=> {
                        const animation = createAnim(animSpec.frames, animSpec.frameLen);
                        sprites.defineAnim(animSpec.name, animation);
                    });
                    } 
              
                 return sprites;
                }
     
            });


        }        
        
      }          
      
        return sprites;
    };
}


export async function loadSpriteSheet(name) {   

    const sheetSpec = await loadJSON(`/sprites/${name}.json`);
    const image = await loadImage(sheetSpec.imageURL);
   
    const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);   

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

export async function loadObject() {
    const sheetSpec = await loadJSON('/sprites/objects.json');
    items = {};
    if(sheetSpec.objects) {
        sheetSpec.objects.forEach(object => {
            items[object.object_name] = object;
        });
    }
    
    return function loadSheet(sheetName) {
        const image = await loadImage(`./img/${sheetName}.png`);    
        const sprites = new SpriteSheet(image, 16, 16);            
        const currentItem = items[sheetName];

        currentItem.frames.forEach(frameSpec=> {
                    sprites.define(frameSpec.name, ...frameSpec.rect);
        });

        if (currentItem.animations) {
            const animation = createAnim(currentItem.animations.frames, currentItem.animations.frameLen);
            sprites.defineAnim(object.animations.name, animation);
        }         
                
    
        return sprites;
    }   

  
}



export async function loadMoves(sheetName) {
  
    const sheetSpec = await loadJSON('/sprites/moves.json');  
    const image = await loadImage(`./img/${sheetName}.png`);    
    const sprites = new SpriteSheet(image, 16, 16);

    if(sheetSpec.moves) {
        sheetSpec.moves.forEach(move => {         
            move.frames.forEach(frameSpec=> {
                sprites.define(frameSpec.name, ...frameSpec.rect);
            });

         
                const animation = createAnim(move.animations.frames, move.animations.frameLen);
                sprites.defineAnim(move.animations.name, animation);
           

        });
    }

    return sprites;

}

