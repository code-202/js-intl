"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteCatalog = void 0;
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
                const loader = new loader_1.JsonLoader(this._url);
                (0, mobx_1.when)(() => loader.status === 'done' || loader.status === 'error').then((0, mobx_1.action)(() => {
                    if (loader.status === 'done') {
                        this.messages = loader.responseData;
                        (0, mobx_1.action)(() => {
                            this.status = 'ready';
                        })();
                        resolve();
                    }
                    else {
                        (0, mobx_1.action)(() => {
                            this.status = 'error';
                        })();
                        reject();
                    }
                }));
                (0, mobx_1.action)(() => {
                    this.status = 'updating';
                })();
            }
            else {
                reject();
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
