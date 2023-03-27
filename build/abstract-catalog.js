"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = void 0;
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
        // Do nothing
    }
}
exports.AbstractCatalog = AbstractCatalog;
