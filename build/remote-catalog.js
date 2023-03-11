"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteCatalog = void 0;
const catalog_1 = require("./catalog");
const loader_1 = require("@code-202/loader");
const mobx_1 = require("mobx");
const abstract_catalog_1 = require("./abstract-catalog");
class RemoteCatalog extends abstract_catalog_1.AbstractCatalog {
    status = 'waiting';
    messages = {};
    _url;
    constructor(locale, url, domains = ['default']) {
        super(locale, domains);
        (0, mobx_1.makeObservable)(this, {
            status: mobx_1.observable,
            messages: mobx_1.observable,
        });
        this._url = url;
    }
    prepare() {
        return new Promise((resolve, reject) => {
            if (this.status === 'waiting') {
                const url = typeof this._url === 'function' ? this._url() : this._url;
                const loader = new loader_1.JsonLoader(url, false);
                loader.load().then(() => {
                    (0, mobx_1.action)(() => {
                        this.messages = loader.responseData;
                        this.status = 'ready';
                    })();
                    resolve();
                }).catch((err) => {
                    (0, mobx_1.action)(() => {
                        this.status = 'error';
                    })();
                    console.error(`${url} is unreachable`);
                    reject(new catalog_1.UnreachableRemoteError(`${url} is unreachable`));
                });
                (0, mobx_1.action)(() => {
                    this.status = 'updating';
                })();
            }
            else {
                reject('catalog is already ' + this.status);
            }
        });
    }
    normalize() {
        if (this.status === 'ready') {
            return {
                messages: this.messages
            };
        }
        return {};
    }
    denormalize(data) {
        (0, mobx_1.action)(() => {
            if (data.messages) {
                this.messages = data.messages;
                this.status = 'ready';
            }
        })();
    }
}
exports.RemoteCatalog = RemoteCatalog;
