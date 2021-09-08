import Sprinkler from "./classes/Sprinkler";
import Wiper from "./classes/Wiper";
import { b2DebugDraw, b2Vec2, b2World, SCALE } from "./utils/box2dConf";
("strict-mode");

class App {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.units = [];
        this.options = {
            splCount: 6,
        };
        this.init();
        this.setUp();
    }
    init() {
        this.canvas.width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        this.canvas.height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
    }

    setUp() {
        let baseSize;
        if (this.canvas.width >= this.canvas.height) {
            baseSize = this.canvas.width * 0.75;
        } else {
            baseSize = this.canvas.height;
        }
        const gravity = new b2Vec2(0, -baseSize / 10000);
        this.world = new b2World(gravity, true);

        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetSprite(this.ctx);
        this.debugDraw.SetDrawScale(SCALE);
        this.debugDraw.SetFillAlpha(0.5);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(
            b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit
        );

        this.world.SetDebugDraw(this.debugDraw);

        let per = this.canvas.width / (this.options.splCount + 1);
        let leftX = per;
        for (let idx = 0; idx < this.options.splCount; idx++) {
            const sprinkler = new Sprinkler(
                this.world,
                this.ctx,
                leftX,
                0,
                this.canvas.width,
                this.canvas.height
            );
            leftX += per;
            this.units.push(sprinkler);
        }

        this.wiper = new Wiper(
            this.world,
            this.ctx,
            this.canvas.width,
            this.canvas.height
        );
        this.units.push(this.wiper);
    }

    draw(timestamp) {
        const fps = 60;
        const timeStep = 1.0 / fps;

        //move the world ahead , step ahead man!!
        this.world.Step(timeStep, 8, 3);
        this.world.ClearForces();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.units.forEach((unit) => {
            unit.draw(timestamp);
        });
        this.units.forEach((unit) => {
            unit.update(this.canvas.width, this.canvas.height);
        });

        requestAnimationFrame((timestamp) => {
            this.draw.call(this, timestamp);
        });
    }
}

window.onload = function () {
    const canvas = document.getElementById("canvas");
    const app = new App(canvas);
    requestAnimationFrame((timestamp) => {
        app.draw.call(app, timestamp);
    });
};
