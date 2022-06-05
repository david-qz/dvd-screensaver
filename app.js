class BouncingLogo {
    static filename = 'assets/dvd.png';
    static elementClass = 'logo';
    static defaultWidth = 15;
    static screenPorch = 0.5;
    static velocities = [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }, { x: 1, y: -1 }];
    static velFactor = 12;

    static get randomVelocity() {
        const vel = Object.assign({}, BouncingLogo.velocities[Math.floor(Math.random() * this.velocities.length)]);
        vel.x *= BouncingLogo.velFactor;
        vel.y *= BouncingLogo.velFactor;
        return vel;
    }

    static get randomPosition() {
        return { x: 30 + Math.random() * 30, y: 30 + Math.random() * 30 };
    }

    constructor(pos, vel, scale = 1) {
        this.img = document.createElement('img');
        this.img.src = BouncingLogo.filename;
        this.img.classList.add(BouncingLogo.elementClass);
        this.width = BouncingLogo.defaultWidth * scale;
        this.img.style.width = this.width + '%';

        this.pos = pos || BouncingLogo.randomPosition;
        this.vel = vel || BouncingLogo.randomVelocity;
        this.hueRotation = Math.floor(Math.random() * 6) * 60;

        // Defer initialization of these values until the element is the in the DOM and
        // has gone through layout.
        this.initialized = false;
        this.bounds = null;
        this.screenAspectRatio = null;
        this.aspectRatio = null;
        this.height = null;

        document.body.appendChild(this.img);
        this.parent = this.img.parentElement;
    }

    #initialize() {
        this.screenAspectRatio = this.parent.clientWidth / this.parent.clientHeight;
        this.aspectRatio = this.img.clientWidth / this.img.clientHeight;
        this.height = this.width / this.aspectRatio * this.screenAspectRatio;

        // Sometimes we're too early and the browser hasn't ran lay out on the img
        // element yet.
        if (this.height <= 0) return;

        this.bounds = {
            xMin: 0 + BouncingLogo.screenPorch,
            yMin: 0 + BouncingLogo.screenPorch,
            xMax: 100 - this.width - BouncingLogo.screenPorch,
            yMax: 100 - this.height - BouncingLogo.screenPorch,
        };
        this.initialized = true;
    }

    tick(deltaTime) {
        if (!this.initialized) this.#initialize();
        if (!this.initialized) return;

        this.#handleBounds();

        this.pos.x += this.vel.x * deltaTime * this.screenAspectRatio;
        this.pos.y += this.vel.y * deltaTime;

        this.#syncToDOM();
    }

    #handleBounds() {
        const { xMin, xMax, yMin, yMax } = this.bounds;

        if (this.pos.x < xMin || this.pos.x > xMax) {
            this.pos.x = Math.min(xMax, Math.max(xMin, this.pos.x));
            this.vel.x *= -1;
            this.#onBounce();
        }
        if (this.pos.y < yMin || this.pos.y > yMax) {
            this.pos.y = Math.min(yMax, Math.max(yMin, this.pos.y));
            this.vel.y *= -1;
            this.#onBounce();
        }
    }

    #onBounce() {
        this.hueRotation = (this.hueRotation + 60) % 360;
    }

    #syncToDOM() {
        this.img.style.left = this.pos.x + '%';
        this.img.style.top = this.pos.y + '%';
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
