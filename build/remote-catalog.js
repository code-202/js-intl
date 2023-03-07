"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteCatalog = void 0;
const loader_1 = require("@code-202/loader");
const mobx_1 = require("mobx");
const abstract_catalog_1 = require("./abstract-catalog");
class RemoteCatalog extends abstract_catalog_1.AbstractCatalog {
    status;
    messages;
    _url;
    constructor(locale, url, domains = ['default']) {
        super(locale, domains);
        (0, mobx_1.makeObservable)(this, {
            status: mobx_1.observable,
            messages: mobx_1.observable,
        });
        this.status = 'waiting';
        this.messages = {};
        this._url = url;
    }
    prepare() {
        if (this.status === 'waiting') {
            const loader = new loader_1.JsonLoader(this._url);
            (0, mobx_1.when)(() => loader.status === 'done').then((0, mobx_1.action)(() => {
                this.messages = loader.responseData;
                this.status = 'ready';
            }));
            this.status = 'updating';
        }
    }
    serialize() {
        if (this.status === 'ready') {
            return {
                messages: this.messages
            };
        }
        return {};
    }
    deserialize(data) {
        try {
            if (data.messages) {
                (0, mobx_1.action)(() => {
                    this.messages = data.messages;
                    this.status = 'ready';
                })();
            }
        }
        catch (e) {
            console.error('Impossible to deserialize : bad data');
        }
    }
}
exports.RemoteCatalog = RemoteCatalog;
