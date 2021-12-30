(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('qrcode')) :
    typeof define === 'function' && define.amd ? define('angularx-qrcode', ['exports', '@angular/core', 'qrcode'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["angularx-qrcode"] = {}, global.ng.core, global.qrcode));
})(this, (function (exports, i0, QRCode) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var QRCode__namespace = /*#__PURE__*/_interopNamespace(QRCode);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var QRCodeComponent = /** @class */ (function () {
        function QRCodeComponent(renderer) {
            this.renderer = renderer;
            this.allowEmptyString = false;
            this.colorDark = '#000000ff';
            this.colorLight = '#ffffffff';
            this.cssClass = 'qrcode';
            this.elementType = 'canvas';
            this.errorCorrectionLevel = 'M';
            this.margin = 4;
            this.qrdata = '';
            this.scale = 4;
            this.width = 10;
        }
        QRCodeComponent.prototype.ngOnChanges = function () {
            this.createQRCode();
        };
        QRCodeComponent.prototype.isValidQrCodeText = function (data) {
            if (this.allowEmptyString === false) {
                return !(typeof data === 'undefined' ||
                    data === '' ||
                    data === 'null' ||
                    data === null);
            }
            return !(typeof data === 'undefined');
        };
        QRCodeComponent.prototype.toDataURL = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                QRCode__namespace.toDataURL(_this.qrdata, {
                    color: {
                        dark: _this.colorDark,
                        light: _this.colorLight,
                    },
                    errorCorrectionLevel: _this.errorCorrectionLevel,
                    margin: _this.margin,
                    scale: _this.scale,
                    version: _this.version,
                    width: _this.width,
                }, function (err, url) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(url);
                    }
                });
            });
        };
        QRCodeComponent.prototype.toCanvas = function (canvas) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                QRCode__namespace.toCanvas(canvas, _this.qrdata, {
                    color: {
                        dark: _this.colorDark,
                        light: _this.colorLight,
                    },
                    errorCorrectionLevel: _this.errorCorrectionLevel,
                    margin: _this.margin,
                    scale: _this.scale,
                    version: _this.version,
                    width: _this.width,
                }, function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve('success');
                    }
                });
            });
        };
        QRCodeComponent.prototype.toSVG = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                QRCode__namespace.toString(_this.qrdata, {
                    color: {
                        dark: _this.colorDark,
                        light: _this.colorLight,
                    },
                    errorCorrectionLevel: _this.errorCorrectionLevel,
                    margin: _this.margin,
                    scale: _this.scale,
                    type: 'svg',
                    version: _this.version,
                    width: _this.width,
                }, function (err, url) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(url);
                    }
                });
            });
        };
        QRCodeComponent.prototype.renderElement = function (element) {
            var e_1, _a;
            try {
                for (var _b = __values(this.qrcElement.nativeElement.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    this.renderer.removeChild(this.qrcElement.nativeElement, node);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.renderer.appendChild(this.qrcElement.nativeElement, element);
        };
        QRCodeComponent.prototype.createQRCode = function () {
            var _this = this;
            // Set sensitive defaults
            if (this.version && this.version > 40) {
                console.warn('[angularx-qrcode] max value for `version` is 40');
                this.version = 40;
            }
            else if (this.version && this.version < 1) {
                console.warn('[angularx-qrcode]`min value for `version` is 1');
                this.version = 1;
            }
            else if (this.version !== undefined && isNaN(this.version)) {
                console.warn('[angularx-qrcode] version should be a number, defaulting to auto.');
                this.version = undefined;
            }
            try {
                if (!this.isValidQrCodeText(this.qrdata)) {
                    throw new Error('[angularx-qrcode] Field `qrdata` is empty, set `allowEmptyString="true"` to overwrite this behaviour.');
                }
                // This is a fix to allow an empty string as qrdata
                if (this.isValidQrCodeText(this.qrdata) && this.qrdata === '') {
                    this.qrdata = ' ';
                }
                var element_1;
                switch (this.elementType) {
                    case 'canvas':
                        element_1 = this.renderer.createElement('canvas');
                        this.toCanvas(element_1)
                            .then(function () {
                            _this.renderElement(element_1);
                        })
                            .catch(function (e) {
                            console.error('[angularx-qrcode] canvas error:', e);
                        });
                        break;
                    case 'svg':
                        element_1 = this.renderer.createElement('div');
                        this.toSVG()
                            .then(function (svgString) {
                            _this.renderer.setProperty(element_1, 'innerHTML', svgString);
                            var innerElement = element_1.firstChild;
                            _this.renderer.setAttribute(innerElement, 'height', "" + _this.width);
                            _this.renderer.setAttribute(innerElement, 'width', "" + _this.width);
                            _this.renderElement(innerElement);
                        })
                            .catch(function (e) {
                            console.error('[angularx-qrcode] svg error:', e);
                        });
                        break;
                    case 'url':
                    case 'img':
                    default:
                        element_1 = this.renderer.createElement('img');
                        this.toDataURL()
                            .then(function (dataUrl) {
                            element_1.setAttribute('src', dataUrl);
                            _this.renderElement(element_1);
                        })
                            .catch(function (e) {
                            console.error('[angularx-qrcode] img/url error:', e);
                        });
                }
            }
            catch (e) {
                console.error('[angularx-qrcode] Error generating QR Code:', e.message);
            }
        };
        return QRCodeComponent;
    }());
    QRCodeComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: QRCodeComponent, deps: [{ token: i0__namespace.Renderer2 }], target: i0__namespace.ɵɵFactoryTarget.Component });
    QRCodeComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: QRCodeComponent, selector: "qrcode", inputs: { allowEmptyString: "allowEmptyString", colorDark: "colorDark", colorLight: "colorLight", cssClass: "cssClass", elementType: "elementType", errorCorrectionLevel: "errorCorrectionLevel", margin: "margin", qrdata: "qrdata", scale: "scale", version: "version", width: "width" }, viewQueries: [{ propertyName: "qrcElement", first: true, predicate: ["qrcElement"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0__namespace, template: "<div #qrcElement [class]=\"cssClass\"></div>", isInline: true, changeDetection: i0__namespace.ChangeDetectionStrategy.OnPush });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: QRCodeComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'qrcode',
                        changeDetection: i0.ChangeDetectionStrategy.OnPush,
                        template: "<div #qrcElement [class]=\"cssClass\"></div>",
                    }]
            }], ctorParameters: function () { return [{ type: i0__namespace.Renderer2 }]; }, propDecorators: { allowEmptyString: [{
                    type: i0.Input
                }], colorDark: [{
                    type: i0.Input
                }], colorLight: [{
                    type: i0.Input
                }], cssClass: [{
                    type: i0.Input
                }], elementType: [{
                    type: i0.Input
                }], errorCorrectionLevel: [{
                    type: i0.Input
                }], margin: [{
                    type: i0.Input
                }], qrdata: [{
                    type: i0.Input
                }], scale: [{
                    type: i0.Input
                }], version: [{
                    type: i0.Input
                }], width: [{
                    type: i0.Input
                }], qrcElement: [{
                    type: i0.ViewChild,
                    args: ['qrcElement', { static: true }]
                }] } });

    var QRCodeModule = /** @class */ (function () {
        function QRCodeModule() {
        }
        return QRCodeModule;
    }());
    QRCodeModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: QRCodeModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    QRCodeModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: QRCodeModule, declarations: [QRCodeComponent], exports: [QRCodeComponent] });
    QRCodeModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: QRCodeModule, providers: [] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: QRCodeModule, decorators: [{
                type: i0.NgModule,
                args: [{
                        providers: [],
                        declarations: [QRCodeComponent],
                        exports: [QRCodeComponent],
                    }]
            }] });

    exports.QRCodeErrorCorrectionLevel = void 0;
    (function (QRCodeErrorCorrectionLevel) {
        QRCodeErrorCorrectionLevel["low"] = "low";
        QRCodeErrorCorrectionLevel["medium"] = "medium";
        QRCodeErrorCorrectionLevel["quartile"] = "quartile";
        QRCodeErrorCorrectionLevel["high"] = "high";
        QRCodeErrorCorrectionLevel["L"] = "L";
        QRCodeErrorCorrectionLevel["M"] = "M";
        QRCodeErrorCorrectionLevel["Q"] = "Q";
        QRCodeErrorCorrectionLevel["H"] = "H";
    })(exports.QRCodeErrorCorrectionLevel || (exports.QRCodeErrorCorrectionLevel = {}));
    exports.QRCodeElementType = void 0;
    (function (QRCodeElementType) {
        QRCodeElementType["url"] = "url";
        QRCodeElementType["img"] = "img";
        QRCodeElementType["canvas"] = "canvas";
        QRCodeElementType["svg"] = "svg";
    })(exports.QRCodeElementType || (exports.QRCodeElementType = {}));

    /*
     * Public API Surface of angularx-qrcode
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.QRCodeComponent = QRCodeComponent;
    exports.QRCodeModule = QRCodeModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=angularx-qrcode.umd.js.map
