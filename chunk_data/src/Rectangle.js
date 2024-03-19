"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
var Rectangle = (function () {
    function Rectangle(location, size) {
        this.location = location;
        this.size = size;
    }
    Object.defineProperty(Rectangle.prototype, "topLeft", {
        get: function () { return this.location; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Rectangle.prototype, "bottomRight", {
        get: function () { return { x: this.location.x + this.size.x, y: this.location.y + this.size.y }; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Rectangle.prototype, "center", {
        get: function () { return { x: this.location.x + Math.floor(this.size.x / 2), y: this.location.y + Math.floor(this.size.y / 2) }; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Rectangle.prototype, "id", {
        get: function () { return "".concat(this.location.x, "x").concat(this.location.y, "x").concat(this.size.x, "x").concat(this.size.y); },
        enumerable: false,
        configurable: true
    });
    ;
    Rectangle.prototype.overlapsWith = function (other) {
        return !(this.bottomRight.x <= other.topLeft.x || this.topLeft.x >= other.bottomRight.x ||
            this.bottomRight.y <= other.topLeft.y || this.topLeft.y >= other.bottomRight.y);
    };
    Rectangle.prototype.contains = function (point) {
        var bottomRight = this.bottomRight;
        return point.x >= this.location.x && point.x < bottomRight.x
            && point.y >= this.location.y && point.y < bottomRight.y;
    };
    Rectangle.prototype.distanceToCenter = function (other) {
        return Math.sqrt(this.distanceToCenter(other));
    };
    Rectangle.prototype.distanceTo = function (other) {
        return Math.sqrt(this.distanceToSquared(other));
    };
    Rectangle.prototype.distanceToPoint = function (point) {
        return Math.sqrt(this.distanceToPointSquared(point));
    };
    Rectangle.prototype.distanceToCenterSquared = function (other) {
        var center = this.center;
        var otherCenter = other.center;
        var xSquared = (center.x - otherCenter.x) * (center.x * otherCenter.x);
        var ySquared = (center.y - otherCenter.y) * (center.y * otherCenter.y);
        return xSquared + ySquared;
    };
    Rectangle.prototype.distanceToSquared = function (other) {
        var bottomRight = this.bottomRight;
        var otherBr = other.bottomRight;
        var xDiff = 0;
        if (bottomRight.x < other.location.x) {
            xDiff = other.location.x - bottomRight.x;
        }
        else if (otherBr.x < this.location.x) {
            xDiff = this.location.x - otherBr.x;
        }
        var yDiff = 0;
        if (bottomRight.y < other.location.y) {
            yDiff = other.location.y - bottomRight.y;
        }
        else if (otherBr.y < this.location.y) {
            yDiff = this.location.y - otherBr.y;
        }
        return (xDiff * xDiff) + (yDiff * yDiff);
    };
    Rectangle.prototype.distanceToPointSquared = function (point) {
        var bottomRight = this.bottomRight;
        var xDiff = 0;
        if (point.x < this.location.x || point.x > bottomRight.x) {
            xDiff = this.location.x - point.x;
        }
        var yDiff = 0;
        if (point.y < this.location.y || point.y > bottomRight.y) {
            yDiff = this.location.y - point.y;
        }
        return (xDiff * xDiff) + (yDiff * yDiff);
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
//# sourceMappingURL=Rectangle.js.map