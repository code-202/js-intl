"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = void 0;
const catalog_1 = require("./catalog");
class AbstractCatalog {
    _id;
    _locale;
    _domains;
    constructor(locale, domains = ['default'], id = '') {
        this._id = id || locale + '.' + domains.join('.');
        this._locale = locale;
        this._domains = domains;
    }
    get id() {
        return this._id;
    }
    get locale() {
        return this._locale;
    }
    get domains() {
        return this._domains;
    }
    hasDomain(domain) {
        return this.domains.indexOf(domain) >= 0;
    }
    normalize() {
        return {
            id: this.id,
        };
    }
    denormalize(data) {
        if (data.id != this.id) {
            throw new catalog_1.BadDenormalizationError('try to denormalize catalog id ' + data.id + ' in catalog ' + this.id);
        }
    }
}
exports.AbstractCatalog = AbstractCatalog;
