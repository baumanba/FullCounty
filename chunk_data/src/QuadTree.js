"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuadTree = void 0;
var Rectangle_1 = require("./Rectangle");
var QuadTree = (function () {
    function QuadTree(rect, parent) {
        this.parent = parent;
        this.children = new Array(4);
        this.quadNames = {
            topLeft: 0,
            topRight: 1,
            bottomLeft: 2,
            bottomRight: 3
        };
        this.rect = new Rectangle_1.Rectangle(rect.location, {
            x: rect.size.x > rect.size.y ? rect.size.x : rect.size.y,
            y: rect.size.x > rect.size.y ? rect.size.x : rect.size.y,
        });
        if (this.rect.size.x > this.rect.size.y) {
            this.rect.size.y = this.rect.size.x;
        }
        else if (this.rect.size.y > this.rect.size.x) {
            this.rect.size.x = this.rect.size.y;
        }
        var center = this.rect.center;
        this.uniqueId = "".concat(center.x, "x").concat(center.y);
    }
    QuadTree.prototype.forEachPoint = function (fn) {
        var actualChildren = [];
        this.children.forEach(function (child) {
            if (child && !(child instanceof QuadTree)) {
                actualChildren.push(child);
            }
            else {
                child.forEachPoint(fn);
            }
        });
        if (actualChildren.length > 0) {
            fn(this.rect, actualChildren);
        }
    };
    QuadTree.prototype.addRectangle = function (rect, data) {
        this.add(rect.location, data);
        this.add({
            x: rect.location.x + rect.size.x,
            y: rect.location.y
        }, data);
        this.add({
            x: rect.location.x,
            y: rect.location.y + rect.size.y
        }, data);
        this.add({
            x: rect.location.x + rect.size.x,
            y: rect.location.y + rect.size.y
        }, data);
    };
    QuadTree.prototype.add = function (coords, data) {
        var quadIndex = this.getIndexForCoords(coords);
        if (quadIndex === undefined) {
            return;
        }
        var halfSize = this.getHalfSize();
        var center = this.rect.center;
        var quadrant = this.children[quadIndex];
        if (quadrant === undefined) {
            if (halfSize <= 1) {
                this.children[quadIndex] = { point: coords, data: [data] };
                return;
            }
            else {
                var newX = quadIndex === this.quadNames.topLeft || quadIndex === this.quadNames.bottomLeft ? this.rect.location.x : center.x;
                var newY = quadIndex === this.quadNames.topLeft || quadIndex === this.quadNames.topRight ? this.rect.location.y : center.y;
                var newQuad = new QuadTree(new Rectangle_1.Rectangle({ x: newX, y: newY }, { x: halfSize, y: halfSize }), this);
                this.children[quadIndex] = newQuad;
                return newQuad.add(coords, data);
            }
        }
        else if (halfSize > 1) {
            return quadrant.add(coords, data);
        }
        else {
            quadrant.data.push(data);
        }
    };
    QuadTree.prototype.findClosest = function (coords) {
        var quadIndex = this.getIndexForCoords(coords);
        if (quadIndex === undefined) {
            return;
        }
        if (this.children[quadIndex] === undefined) {
            return this;
        }
        if (this.getHalfSize() <= 1) {
            return this.children[quadIndex];
        }
        return this.children[quadIndex].findClosest(coords);
    };
    QuadTree.prototype.get = function (coords) {
        var quadIndex = this.getIndexForCoords(coords);
        if (quadIndex === undefined || this.children[quadIndex] === undefined) {
            return;
        }
        var child = this.children[quadIndex];
        if (!(child instanceof QuadTree)) {
            return child;
        }
        return child.get(coords);
    };
    QuadTree.prototype.closest = function (coords) {
        var closest = this.findClosest(coords);
        var best = { point: undefined, distanceSquared: Infinity };
        var checked = {};
        if (!(closest instanceof QuadTree)) {
            return closest;
        }
        closest.recurseClosest(coords, checked, best);
        return best.point;
    };
    QuadTree.prototype.recurseClosest = function (coords, checked, best) {
        var uniqueId = this.uniqueId;
        if (checked[uniqueId]) {
            return;
        }
        checked[uniqueId] = true;
        if (this.rect.distanceToPointSquared(coords) > best.distanceSquared) {
            return;
        }
        this.children.forEach(function (child) {
            if (child !== undefined) {
                if (child instanceof QuadTree) {
                    child.recurseClosest(coords, checked, best);
                }
                else {
                    var pointChild = child;
                    var xDiff = (pointChild.point.x - coords.x);
                    var yDiff = (pointChild.point.y - coords.y);
                    var distSquared = (xDiff * xDiff) + (yDiff * yDiff);
                    if (distSquared < best.distanceSquared) {
                        best.distanceSquared = distSquared;
                        best.point = pointChild;
                    }
                }
            }
        });
        if (this.parent !== undefined) {
            this.parent.recurseClosest(coords, checked, best);
        }
    };
    QuadTree.prototype.getHalfSize = function () {
        return this.rect.size.x > this.rect.size.y ? this.rect.size.y / 2 : this.rect.size.x / 2;
    };
    QuadTree.prototype.getIndexForCoords = function (coords) {
        if (!this.rect.contains(coords)) {
            return;
        }
        var center = this.rect.center;
        if (coords.x < center.x) {
            if (coords.y < center.y) {
                return this.quadNames.topLeft;
            }
            else {
                return this.quadNames.bottomLeft;
            }
        }
        else {
            if (coords.y < center.y) {
                return this.quadNames.topRight;
            }
            else {
                return this.quadNames.bottomRight;
            }
        }
    };
    return QuadTree;
}());
exports.QuadTree = QuadTree;
//# sourceMappingURL=QuadTree.js.map