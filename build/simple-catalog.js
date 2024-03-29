"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCatalog = void 0;
const abstract_catalog_1 = require("./abstract-catalog");
class SimpleCatalog extends abstract_catalog_1.AbstractCatalog {
    _messages;
    constructor(locale, messages, domains = ['default'], id = '') {
        super(locale, domains, id);
        this._messages = messages;
    }
    get messages() {
        return this._messages;
    }
    get status() {
        return 'ready';
    }
    prepare() {
        return Promise.resolve();
    }
}
exports.SimpleCatalog = SimpleCatalog;
