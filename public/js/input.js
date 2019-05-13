import KeyboardState from "./KeyboardState.js";
export function setupKeyboard(pikachu) {
   
    const input = new KeyboardState();
    input.addMapping('Space', keyState => {
    if(!pikachu.killable.dead) {
        if (keyState) {
            pikachu.jump.start();
        } else {
            pikachu.jump.cancel();
        }
    }
    });
    input.addMapping('ArrowRight', keyState => {

        if (!pikachu.killable.dead) {       
        pikachu.go.dir += keyState ? 1 : -1;
        pikachu.facing = 1;
        } else {
            pikachu.go.dir = 0;
        }
        
    });

    input.addMapping('ArrowLeft', keyState => {
     if(!pikachu.killable.dead) {
        pikachu.go.dir += keyState ? -1 : 1;
        pikachu.facing = 0;
     } else {
         pikachu.go.dir = 0;
     }
       
    });

    input.addMapping('KeyB', keyState => {
    
        if (keyState & !pikachu.killable.dead) {
            pikachu.bash.start();        
        } 
           
    });

    input.addMapping('KeyT', keyState => {    
        if(keyState & !pikachu.killable.dead) {
            pikachu.activeMoves.push(pikachu.moves[0]);
            pikachu.activeMoves[0].start();
        }    
    });

    // input.addMapping('KeyO', keyState => {
    //     pikachu.turbo();
    // });
    return input;
}