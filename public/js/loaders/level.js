import Level from '../Level.js';
import Matrix from "../math.js";
import {createSpriteLayer} from '../layers/sprites.js';
import {createBackgroundLayer} from '../layers/background.js';
import {loadJSON, loadBackgroundSpriteSheet} from '../loaders.js';
import { getBgEntityFactory } from '../entities.js';


function* expandSpan(xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield {x, y};
        }
    }
}

function expandRange(range) {
    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(xStart, xLen, yStart, yLen);

    } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpan(xStart, xLen, yStart, 1);

    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(xStart, 1, yStart, 1);
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

function* expandTiles(tiles, patterns) {

    function* walkTiles(tiles, offsetX, offsetY) {

        for (const tile of tiles) {
            for (const {x, y} of expandRanges(tile.ranges)) {             
                const derivedX = x + offsetX;
                const derivedY = y + offsetY;
                if (tile.pattern) {
                    const tiles = patterns[tile.pattern].tiles;
                    yield* walkTiles(tiles, derivedX, derivedY);
                } else {
                    yield ({
                        tile,
                        x: derivedX,
                        y: derivedY,
                    });
                }
            }
        }
    }
    //generator yield
  
    yield* walkTiles(tiles, 0, 0);
}

function setupCollision(levelSpec, level) {
    let mergedTiles = levelSpec.layers.reduce((mergedTiles, layerSpec) => {
        return mergedTiles.concat(layerSpec.tiles);
    }, []);   
    mergedTiles = mergedTiles.concat(levelSpec.bgObjects);
    
    const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
   level.setCollisionGrid(collisionGrid);
   
    
}

function setupBackground(levelSpec, level, backgroundSprites) {
   levelSpec.layers.forEach(layer => {
        const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);        
        level.comp.layers.push(backgroundLayer);
    });
}

async function setupBGObjects(levelSpec, level, bgFactory) {  

    for (const {tile, x ,y} of expandTiles(levelSpec.bgObjects, null)) {
        
        const createBgEntity = bgFactory[tile.name];
        const entity = createBgEntity();
        entity.pos.set(x * entity.size.x,y * entity.size.y); 
        entity.setLevel(level);
        level.entities.add(entity);  
    }

}

 function setupEntities(levelSpec, level, entityFactory) {

    levelSpec.entities.forEach(({name, pos: [x,y]}) => {      
       const createEntity = entityFactory[name];
       const entity = createEntity();
       entity.pos.set(x,y);
       level.entities.add(entity);
    });
    const spriteLayer = createSpriteLayer(level.entities);
    level.comp.layers.push(spriteLayer);
}
export function createLevelLoader(entityFactory) {
    return async function loadLevel(name) { 
   
        const levelSpec = await loadJSON(`/levels/${name}.json`);
        const sheet = await loadBackgroundSpriteSheet(levelSpec.spriteSheet);
        const backgroundSprites = sheet();        
        const level = new Level();
        
       const bgFactory = await createBGFactory(sheet);
       setupCollision(levelSpec, level);
       setupBackground(levelSpec, level, backgroundSprites);
       await setupBGObjects(levelSpec, level, bgFactory);
       setupEntities(levelSpec, level, entityFactory);
       return level;        
    }
}

export async function createBGFactory(sheet) {
    const factory = {};
   
    factory['chance-block'] = await getBgEntityFactory('chance-block', sheet(true, 'chance-block'));
   
    return factory;
}

function createCollisionGrid(tiles, patterns) {
    const grid = new Matrix();
    
    for (const {tile, x ,y} of expandTiles(tiles, patterns)) {
        // problem with collision grid not including chance might be here (expand tiles)
       
        grid.set(x, y, {
            name: tile.name,
            type: tile.type

        });
    }
    return grid;
}

function createBackgroundGrid(tiles, patterns) {
    const grid = new Matrix();

    for (const {tile, x ,y} of expandTiles(tiles, patterns)) {  
    
        grid.set(x, y, {
            name: tile.name            
        });
    }
    return grid;
}
