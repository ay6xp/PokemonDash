import KeyboardState from "./KeyboardState.js";
import { gamestate } from "./main.js";

export function setupKeyboard(pikachu, game_state) {
   
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

    input.addMapping('KeyP', keyState => {        
        if(game_state.state === gamestate.PLAYING && keyState){
            game_state.state = gamestate.PAUSED;
        } 
        else if 
        (game_state.state === gamestate.PAUSED && keyState) {
            game_state.state = gamestate.PLAYING;
        }
        
    });

    input.addMapping('KeyT', keyState => {    
        if(keyState & !pikachu.killable.dead && pikachu.behavior.thunderboltsLeft > 0) {
            pikachu.activeMoves.push(pikachu.moves[0]);
            pikachu.activeMoves[0].start();
            pikachu.behavior.thunderboltsLeft--;
        }    
    });

    // input.addMapping('KeyO', keyState => {
    //     pikachu.turbo();
    // });
    return input;
}