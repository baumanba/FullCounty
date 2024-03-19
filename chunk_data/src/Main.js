"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs/promises");
var path = require("path");
var QuadTree_1 = require("./QuadTree");
var Rectangle_1 = require("./Rectangle");
function chunk_file(fileName, outDir, chunkSize) {
    return __awaiter(this, void 0, void 0, function () {
        var contents, _a, _b, factor, min, max, quadTree, index, fileIndex, promises;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4, fs.readFile(fileName, { encoding: 'utf8' })];
                case 1:
                    contents = _b.apply(_a, [_c.sent()]);
                    factor = 1 / chunkSize;
                    if (!Number.isInteger(factor)) {
                        throw new Error('chunkSize must multiply into 1');
                    }
                    min = { x: Infinity, y: Infinity };
                    max = { x: -Infinity, y: -Infinity };
                    contents.features.forEach(function (feature) {
                        var coord = feature.geometry.coordinates[0][0];
                        while (Array.isArray(coord[0])) {
                            coord = coord[0];
                        }
                        min = {
                            x: Math.min(min.x, coord[0]),
                            y: Math.min(min.y, coord[1]),
                        };
                        max = {
                            x: Math.max(max.x, coord[0]),
                            y: Math.max(max.y, coord[1]),
                        };
                    });
                    min = {
                        x: min.x > 0 ? prevSquare(min.x * factor) : nextSquare(min.x * factor),
                        y: min.y > 0 ? prevSquare(min.y * factor) : nextSquare(min.y * factor),
                    };
                    max = {
                        x: max.x > 0 ? nextSquare(max.x * factor) : prevSquare(max.x * factor),
                        y: max.y > 0 ? nextSquare(max.y * factor) : prevSquare(max.y * factor)
                    };
                    quadTree = new QuadTree_1.QuadTree(new Rectangle_1.Rectangle(min, {
                        x: max.x - min.x,
                        y: max.y - min.y
                    }));
                    contents.features.forEach(function (feature) {
                        var coord = feature.geometry.coordinates[0][0];
                        while (Array.isArray(coord[0])) {
                            coord = coord[0];
                        }
                        quadTree.add({
                            x: coord[0] * factor,
                            y: coord[1] * factor
                        }, feature);
                    });
                    index = 0;
                    fileIndex = [];
                    promises = [];
                    quadTree.forEachPoint(function (rect, data) { return __awaiter(_this, void 0, void 0, function () {
                        var fileName, geoJson;
                        return __generator(this, function (_a) {
                            index++;
                            fileName = "chunk_".concat(index, ".geojson");
                            geoJson = {
                                type: contents.type,
                                crs: contents.crs,
                                features: []
                            };
                            data.forEach(function (subData) {
                                var _a;
                                (_a = geoJson.features).push.apply(_a, subData.data);
                            });
                            fileIndex.push({
                                topLeft: {
                                    x: rect.topLeft.x / factor,
                                    y: rect.topLeft.y / factor
                                },
                                bottomRight: {
                                    x: rect.bottomRight.x / factor,
                                    y: rect.bottomRight.y / factor
                                },
                                file: fileName
                            });
                            promises.push(fs.writeFile(path.join(outDir, fileName), JSON.stringify(geoJson), { encoding: 'utf8' }));
                            return [2];
                        });
                    }); });
                    return [4, Promise.all(promises)];
                case 2:
                    _c.sent();
                    return [4, fs.writeFile(path.join(outDir, 'chunk_index.js'), "const fileIndex = ".concat(JSON.stringify(fileIndex), ";"), { encoding: 'utf8' })];
                case 3:
                    _c.sent();
                    return [2];
            }
        });
    });
}
function nextSquare(x) {
    return Math.pow(2, Math.ceil(Math.log(Math.abs(x)) / Math.log(2))) * (x / Math.abs(x));
}
function prevSquare(x) {
    return Math.pow(2, Math.floor(Math.log(Math.abs(x)) / Math.log(2))) * (x / Math.abs(x));
}
chunk_file('../input/realdata.geojson', '../output', 0.02);
//# sourceMappingURL=Main.js.map