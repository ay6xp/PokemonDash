


export function createSpriteLayer(entities, width = 255, height = 255) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');
    
    return function drawSpriteLayer(context, camera) {
               
        entities.forEach((entity) => {
            spriteBufferContext.clearRect(0,0, width, height);
            entity.draw(spriteBufferContext);
         
            context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);    
            spriteBufferContext.clearRect(0,0, width, height);
            if(entity.activeMoves) {
                if(entity.activeMoves.length > 0) {
                    entity.activeMoves[0].draw(spriteBufferContext);
                    context.drawImage(spriteBuffer, entity.activeMoves[0].pos.x - camera.pos.x, entity.activeMoves[0].pos.y - camera.pos.y);  
                    
                }
            }
         
        });
    }
}
