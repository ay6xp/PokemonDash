

export function createDashboardLayer(font, playerEnv) {
    const LINE1 = font.size;
    const LINE2 = font.size * 2;

    const coins = 13;
    const score = 24500;

    return function drawDashboard(context) {
        const {score, time, state} = playerEnv.playerController;
       // const health = playerEnv.playerController.health.getHealth();
        const health = playerEnv.playerController.player.health.getHealth();
        const thunder = playerEnv.playerController.player.behavior.thunderboltsLeft;
         

        font.print('PIKACHU', context, 16, LINE1);
        font.print(score.toString().padStart(6, '0'), context, 16, LINE2);

       // font.print('@x' + coins.toString().padStart(2, '0'), context, 96, LINE2);
       font.print('HEALTH', context, 88, LINE1);
       font.print(health.toFixed().toString(), context, 96, LINE2);

        font.print('THUNDER', context, 145, LINE1);
        font.print(thunder.toFixed().toString(), context, 160, LINE2);

        font.print('TIME', context, 208, LINE1);
        font.print(time.toFixed().toString().padStart(3, '0'), context, 216, LINE2);

        // if(state === gamestate.GAMEOVER) {
        //     font.print('TIME IS OUT! GAME OVER!', context, 400, 400);           

        // }
    };
}

