"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePoint = exports.addPoints = exports.pointDistance = exports.pointDistanceSquared = exports.pointsAreEqual = void 0;
var pointsAreEqual = function (point, otherPoint) {
    return point.x === otherPoint.x && point.y === otherPoint.y;
};
exports.pointsAreEqual = pointsAreEqual;
var pointDistanceSquared = function (point, otherPoint) {
    return Math.pow(point.x - otherPoint.x, 2) + Math.pow(point.y - otherPoint.y, 2);
};
exports.pointDistanceSquared = pointDistanceSquared;
var pointDistance = function (point, otherPoint) {
    return Math.sqrt((0, exports.pointDistanceSquared)(point, otherPoint));
};
exports.pointDistance = pointDistance;
var addPoints = function (point, otherPoint) {
    return { x: point.x + otherPoint.x, y: point.y + otherPoint.y };
};
exports.addPoints = addPoints;
var normalizePoint = function (point) {
    return { x: point.x / Math.abs(point.x), y: point.y / Math.abs(point.y) };
};
exports.normalizePoint = normalizePoint;
//# sourceMappingURL=Point.js.map