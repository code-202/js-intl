"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCatalog = void 0;
class AbstractCatalog {
    _locale;
    _domains;
    constructor(locale, domains = ['default']) {
        this._locale = locale;
        this._domains = domains;
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
    serialize() {
        return {};
    }
    deserialize(data) {
        // Do nothing
    }
}
exports.AbstractCatalog = AbstractCatalog;
