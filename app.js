import BouncingLogo from './src/BouncingLogo.js';

const logos = [new BouncingLogo()];

let lastTime;
function advance(timestamp) {
    if (!lastTime) lastTime = timestamp;

    const elapsedTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    for (const logo of logos) {
        logo.tick(elapsedTime);
    }
    requestAnimationFrame(advance);
}

// Begin loop
requestAnimationFrame(advance);

// TODO: increase faithfulness to original color
