import KeyboardState from "./KeyboardState.js";
export function setupKeyboard(pikachu) {
   
    const input = new KeyboardState();
    input.addMapping('Space', keyState => {
        if (keyState) {
            pikachu.jump.start();
        } else {
            pikachu.jump.cancel();
        }
    });
    input.addMapping('ArrowRight', keyState => {
        pikachu.go.dir += keyState ? 1 : -1;
    });

    input.addMapping('ArrowLeft', keyState => {
        pikachu.go.dir += keyState ? -1 : 1;
    });

    // input.addMapping('KeyO', keyState => {
    //     pikachu.turbo();
    // });
    return input;
}