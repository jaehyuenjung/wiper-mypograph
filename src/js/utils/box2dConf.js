import Box2D from "box2dweb";

export const SCALE = 100;

export const b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2AABB = Box2D.Collision.b2AABB,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2Shape = Box2D.Collision.Shapes.b2Shape,
    b2Joint = Box2D.Dynamics.Joints.b2Joint,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
    b2Settings = Box2D.Common.b2Settings,
    b2WheelJointDef = Box2D.Dynamics.Joints.b2WheelJointDef,
    b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;

function get_real(p) {
    return new b2Vec2(p.x + 0, 6 - p.y);
}

export function GetWorldPoint(localPos) {
    const lp = localPos.Copy();
    lp.x /= SCALE;
    lp.y /= SCALE;
    return get_real(lp);
}

export function GetLocalPoint(worldPos) {
    let wp = worldPos.Copy();
    wp = get_real(wp);
    wp.Multiply(SCALE);
    return wp;
}

export function GetWorldLen(localLen) {
    const cp = GetWorldPoint(new b2Vec2(0, 0));
    const mp = GetWorldPoint(new b2Vec2(localLen, 0));
    mp.Subtract(cp);
    return mp.Length();
}

export function GetLocalLen(worldLen) {
    const cp = GetLocalPoint(new b2Vec2(0, 0));
    const mp = GetLocalPoint(new b2Vec2(worldLen, 0));
    mp.Subtract(cp);
    return mp.Length();
}
