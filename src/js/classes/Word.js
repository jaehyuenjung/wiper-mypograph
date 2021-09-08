import {
    b2PolygonShape,
    b2Vec2,
    GetWorldLen,
    b2Body,
    b2BodyDef,
    b2FixtureDef,
    GetWorldPoint,
    GetLocalPoint,
} from "../utils/box2dConf";

class Word {
    constructor(world, ctx, x, y, styles, options = {}) {
        this.world = world;
        this.ctx = ctx;
        this.settings = {
            position: new b2Vec2(x, y),
        };
        this.styles = styles;
        this.options = {
            density: 1.0,
            friction: 1.0,
            restitution: 0.5,

            linearDamping: 0.0,
            angularDamping: 0.0,

            type: b2Body.b2_dynamicBody,

            ...options,
        };
        this.setUp();
    }

    setUp() {
        const { world, ctx, settings, styles, options } = this;
        const body_def = new b2BodyDef();
        const fix_def = new b2FixtureDef();

        fix_def.density = options.density;
        fix_def.friction = options.friction;
        fix_def.restitution = options.restitution;

        const shape = new b2PolygonShape();
        fix_def.shape = shape;

        const lineHeight = styles.fontSize * 1.286;
        const lineAscent = lineHeight - styles.fontSize;
        const textHeight = lineHeight - lineAscent;

        ctx.save();
        ctx.font = `bold ${styles.fontSize}px Open Sans`;
        const textWidth = ctx.measureText(styles.text).width;
        ctx.restore();

        settings.size = Math.max(textHeight, textWidth) / 2;
        shape.SetAsBox(GetWorldLen(settings.size), GetWorldLen(settings.size));

        const wp = GetWorldPoint(settings.position);
        body_def.position.Set(wp.x, wp.y);

        body_def.linearDamping = options.linearDamping;
        body_def.angularDamping = options.angularDamping;

        body_def.type = options.type;

        this.body = world.CreateBody(body_def);
        this.body.SetAngularVelocity(-2);
        this.shape = shape;
        this.fixDef = this.body.CreateFixture(fix_def);
    }

    update() {
        const { settings, body } = this;
        const velocity = body.GetLinearVelocity();
        const speed = velocity.Length();
        const dragMagnitude = (settings.size / 20) * speed * speed;

        const drag = velocity.Copy();
        drag.Normalize();
        drag.Multiply(-1);
        drag.Multiply(dragMagnitude);
        body.ApplyForce(drag, body.GetWorldCenter());
    }

    destroy() {
        const { world, body } = this;
        world.DestroyBody(body);
    }

    animate(timestamp) {}

    draw(timestamp) {
        const { ctx, styles, body, settings, animate } = this;
        animate(timestamp);
        settings.position = GetLocalPoint(body.GetWorldCenter());
        ctx.beginPath();
        ctx.fillStyle = settings.color;
        ctx.translate(settings.position.x, settings.position.y);
        ctx.rotate(-body.GetAngle());
        ctx.translate(-settings.position.x, -settings.position.y);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${styles.fontSize}px serif`;
        ctx.fillStyle = styles.color;
        ctx.fillText(styles.text, settings.position.x, settings.position.y);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.closePath();
    }
}

export default Word;
