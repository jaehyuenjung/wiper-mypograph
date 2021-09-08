import { b2Vec2 } from "./box2dConf";

export function Deg2Rad(degree) {
    //deg -> rad
    return (degree / 180) * Math.PI;
}

export function getRandomInt(to, from = 0) {
    return Math.floor(Math.random() * (to - from)) + from;
}

export function getRandomDbl(to, from = 0.0) {
    return Math.random() * (to - from) + from;
}

export function getCalVelocity(distance, degree) {
    return new b2Vec2(
        distance * Math.cos(Deg2Rad(degree)),
        distance * Math.sin(Deg2Rad(degree))
    );
}
