"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteCatalog = void 0;
const react_mobx_loader_1 = require("react-mobx-loader");
const mobx_1 = require("mobx");
const abstract_catalog_1 = require("./abstract-catalog");
class RemoteCatalog extends abstract_catalog_1.AbstractCatalog {
    _messages = {};
    _loader;
    constructor(locale, url, domains = ['default']) {
        super(locale, domains);
        this._loader = new react_mobx_loader_1.JsonLoader(url, false);
        (0, mobx_1.when)(() => this._loader.status === 'done', () => {
            this._messages = this._loader.responseData;
        });
    }
    get status() {
        switch (this._loader.status) {
            case 'waiting':
                return 'waiting';
            case 'pending':
                return 'updating';
            default:
                return 'ready';
        }
    }
    get messages() {
        if (this._messages) {
            return this._messages;
        }
        return {};
    }
    prepare() {
        if (this._loader.status === 'waiting') {
            this._loader.load();
        }
    }
}
exports.RemoteCatalog = RemoteCatalog;
