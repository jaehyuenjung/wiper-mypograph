import { b2Vec2, GetWorldPoint } from "../utils/box2dConf";
import Word from "./Word";
import { getCalVelocity, getRandomDbl, getRandomInt } from "../utils/math";

class Sprinkler {
    constructor(world, ctx, x, y, width, height, options = {}) {
        let baseSize;
        if (width >= height) {
            baseSize = width * 0.75;
        } else {
            baseSize = height;
        }
        const fontSize = baseSize * 0.03;
        this.world = world;
        this.ctx = ctx;
        this.words = [];
        this.clock = {};
        this.settings = {
            fontSize,
            density: 0,
            angularDamping: 0,
            position: new b2Vec2(x, y),
        };
        this.options = {
            unitMaximum: 20,
            perClock: 0.1,
            minDist: (fontSize * 50000) / 36,
            maxDist: (fontSize * 100000) / 36,
            ...options,
        };
    }

    update(width, height) {
        const { words } = this;
        for (let idx = words.length - 1; idx >= 0; idx--) {
            const word = words[idx];
            if (
                word.settings.position.x - word.settings.size < 0 ||
                word.settings.position.x + word.settings.size > width
            ) {
                word.destroy();
                words.splice(idx, 1);
                continue;
            }
            if (
                // word.settings.position.y - word.settings.size < 0 ||
                word.settings.position.y + word.settings.size >
                height
            ) {
                word.destroy();
                words.splice(idx, 1);
                continue;
            }
            word.update();
        }
    }

    draw(timestamp) {
        const { world, ctx, words, settings, options, clock } = this;
        words.forEach((word) => word.draw(0));
        if (!clock.start) clock.start = timestamp;

        const time = timestamp - clock.start;
        if (!clock.pt) clock.pt = 0;

        if (words.length < options.unitMaximum && clock.pt <= time) {
            const word = new Word(
                world,
                ctx,
                settings.position.x,
                settings.position.y,
                {
                    text: String.fromCharCode(
                        "A".charCodeAt() + getRandomInt(26)
                    ),
                    color: "#ffffff",
                    fontSize: settings.fontSize,
                },
                {
                    density: settings.density,
                    angularDamping: settings.angularDamping,
                }
            );

            let initForce = getCalVelocity(
                getRandomDbl(options.maxDist, options.minDist),
                getRandomDbl(160.0, 20.0)
            );

            initForce = GetWorldPoint(initForce);
            word.body.ApplyForce(initForce, word.body.GetWorldCenter());
            words.push(word);
            clock.pt = time + options.perClock * 1000;
        }
    }
}

export default Sprinkler;
