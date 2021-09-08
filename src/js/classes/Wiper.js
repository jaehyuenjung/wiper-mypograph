import {
    b2BodyDef,
    b2CircleShape,
    b2FixtureDef,
    GetLocalPoint,
    GetWorldPoint,
    b2Body,
    b2Vec2,
    GetWorldLen,
    b2PolygonShape,
    b2RevoluteJointDef,
} from "../utils/box2dConf";
import { Deg2Rad } from "../utils/math";

class Circle {
    constructor(world, ctx, x, y, r, options = {}) {
        this.world = world;
        this.ctx = ctx;
        this.settings = {
            position: new b2Vec2(x, y),
            r,
        };
        this.options = {
            density: 1.0,
            friction: 0.5,
            restitution: 0.5,

            linearDamping: 0.0,
            angularDamping: 0.0,

            type: b2Body.b2_dynamicBody,

            ...options,
        };
        this.setUp();
    }

    setUp() {
        const body_def = new b2BodyDef();
        const fix_def = new b2FixtureDef();

        fix_def.density = this.options.density;
        fix_def.friction = this.options.friction;
        fix_def.restitution = this.options.restitution;

        this.shape = new b2CircleShape(GetWorldLen(this.settings.r));
        fix_def.shape = this.shape;

        const wp = GetWorldPoint(this.settings.position);
        body_def.position.Set(wp.x, wp.y);

        body_def.linearDamping = this.options.linearDamping;
        body_def.angularDamping = this.options.angularDamping;

        body_def.type = this.options.type;
        body_def.userData = this.options.user_data;

        this.body = this.world.CreateBody(body_def);
        this.fixDef = this.body.CreateFixture(fix_def);
    }

    draw(timestamp) {
        const { ctx, body, settings } = this;
        settings.position = GetLocalPoint(body.GetWorldCenter());
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.translate(settings.position.x, settings.position.y);
        ctx.rotate(-body.GetAngle());
        ctx.translate(-settings.position.x, -settings.position.y);
        ctx.arc(
            settings.position.x,
            settings.position.y,
            settings.r,
            0,
            2 * Math.PI,
            false
        );
        ctx.fill();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.closePath();
    }
}

class Rectangle {
    constructor(world, ctx, x, y, width, height, options = {}) {
        this.world = world;
        this.ctx = ctx;
        this.settings = {
            position: new b2Vec2(x, y),
            width,
            height,
        };
        this.options = {
            density: 1.0,
            friction: 0.5,
            restitution: 0.5,

            linearDamping: 0.0,
            angularDamping: 0.0,

            type: b2Body.b2_dynamicBody,

            ...options,
        };
        this.setUp();
    }

    setUp() {
        const body_def = new b2BodyDef();
        const fix_def = new b2FixtureDef();

        fix_def.density = this.options.density;
        fix_def.friction = this.options.friction;
        fix_def.restitution = this.options.restitution;

        this.shape = new b2PolygonShape();
        fix_def.shape = this.shape;

        this.shape.SetAsBox(
            GetWorldLen(this.settings.width * 0.5),
            GetWorldLen(this.settings.height * 0.5)
        );

        const cp = this.settings.position.Copy();
        cp.x += this.settings.width * 0.5;
        cp.y += this.settings.height * 0.5;
        const wp = GetWorldPoint(cp);
        body_def.position.Set(wp.x, wp.y);

        body_def.linearDamping = this.options.linearDamping;
        body_def.angularDamping = this.options.angularDamping;
        body_def.gravityScale = this.options.gravityScale;

        body_def.type = this.options.type;

        this.body = this.world.CreateBody(body_def);
        this.fixDef = this.body.CreateFixture(fix_def);
    }

    draw(timestamp) {
        const { ctx, body, settings } = this;
        const translateX = settings.position.x + settings.width;
        const translateY = settings.position.y + settings.height * 0.5;
        const omega = -body.GetAngle();
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.translate(translateX, translateY);
        ctx.rotate(omega);
        ctx.translate(-translateX, -translateY);
        ctx.rect(
            settings.position.x,
            settings.position.y,
            settings.width,
            settings.height
        );
        ctx.fill();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.closePath();
    }
}

class Wiper {
    constructor(world, ctx, width, height) {
        this.world = world;
        this.ctx = ctx;
        this.settings = {
            delay: 0,
            wait: 25,
        };
        this.setUp(width, height);
    }

    setUp(width, height) {
        let baseSize;
        if (width >= height) {
            baseSize = width * 0.75;
        } else {
            baseSize = height;
        }
        const barWidth = baseSize * 0.8;
        const barHeight = baseSize * 0.04;
        this.anchor = new Circle(
            this.world,
            this.ctx,
            width * 0.5,
            height - barHeight / 2,
            barHeight / 2,
            {
                type: b2Body.b2_kinematicBody,
            }
        );

        this.bar = new Rectangle(
            this.world,
            this.ctx,
            width * 0.5 - barWidth,
            height - barHeight,
            barWidth,
            barHeight,
            {
                density: 0,
                friction: 0,
                restitution: 0,
                gravityScale: 0,
                type: b2Body.b2_dynamicBody,
            }
        );

        this.bar.body.SetAngularVelocity(Math.random() < 0.5 ? -1 : 1);

        const rjd = new b2RevoluteJointDef();
        rjd.Initialize(
            this.anchor.body,
            this.bar.body,
            this.anchor.body.GetWorldCenter()
        );

        this.world.CreateJoint(rjd);
    }

    update(width, height) {
        const { bar, settings } = this;
        const omega = ((bar.body.GetAngle() * 180) / Math.PI) % 360;
        if (omega >= 0) {
            bar.body.SetAngularVelocity(-1);
        }
        if (omega <= -180 && settings.delay < settings.wait) {
            settings.delay++;
            bar.body.SetAngularVelocity(0);
        } else if (omega <= -180 && settings.delay >= settings.wait) {
            settings.delay = 0;
            bar.body.SetAngularVelocity(1);
        }
    }
    animate(timestamp) {}
    draw(timestamp) {
        this.animate(timestamp);
        this.anchor.draw(timestamp);
        this.bar.draw(timestamp);
    }
}

export default Wiper;
