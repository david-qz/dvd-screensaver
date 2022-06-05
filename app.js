class BouncingLogo {
    static filename = 'assets/dvd.png';
    static elementClass = 'logo';
    static velocities = [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }, { x: 1, y: -1 }];
    static velFactor = 0.15; // As a percentage of screen width per second.

    static get randomVelocity() {
        const vel = Object.assign({}, BouncingLogo.velocities[Math.floor(Math.random() * this.velocities.length)]);
        vel.x *= BouncingLogo.velFactor;
        vel.y *= BouncingLogo.velFactor;
        return vel;
    }

    constructor(pos, vel) {
        this.img = document.createElement('img');
        this.img.src = BouncingLogo.filename;
        this.img.classList.add(BouncingLogo.elementClass);
        document.body.appendChild(this.img);
        this.parent = this.img.parentElement;

        this.initialized = false;
        this.pos = pos || this.randomPosition;
        this.vel = vel || BouncingLogo.randomVelocity;
        this.hueRotation = Math.floor(Math.random() * 6) * 60;
    }

    get randomPosition() {
        return {
            x: Math.random() * this.parent.clientWidth,
            y: Math.random() * this.parent.clientHeight,
        };
    }

    tick(deltaTime) {
        this.#handleBounds();

        this.pos.x += this.vel.x * this.parent.clientWidth * deltaTime;
        this.pos.y += this.vel.y * this.parent.clientWidth * deltaTime;

        this.#syncToDOM();
    }

    #handleBounds() {
        const containingRect = this.parent.getBoundingClientRect();
        const imgRect = this.img.getBoundingClientRect();

        if (imgRect.left < containingRect.left) {
            this.pos.x = 0;
            this.vel.x *= -1;
            this.#onBounce();
        }
        if (imgRect.top < containingRect.top) {
            this.pos.y = 0;
            this.vel.y *= -1;
            this.#onBounce();
        }
        if (imgRect.right > containingRect.right) {
            this.pos.x = containingRect.width - imgRect.width;
            this.vel.x *= -1;
            this.#onBounce();
        }
        if (imgRect.bottom > containingRect.bottom) {
            this.pos.y = containingRect.height - imgRect.height;
            this.vel.y *= -1;
            this.#onBounce();
        }
    }

    #onBounce() {
        this.hueRotation = (this.hueRotation + 60) % 360;
    }

    #syncToDOM() {
        this.img.style.left = this.pos.x + 'px';
        this.img.style.top = this.pos.y + 'px';
        this.img.style.filter = `hue-rotate(${this.hueRotation}deg) brightness(200%) saturate(200%)`;
    }
}

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
