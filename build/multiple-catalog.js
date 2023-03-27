"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleCatalog = void 0;
const catalog_1 = require("./catalog");
const mobx_1 = require("mobx");
class MultipleCatalog {
    catalogs;
    status;
    _id;
    _locale;
    _prepared = false;
    _normalizedRemaining = [];
    constructor(locale, id = '') {
        (0, mobx_1.makeObservable)(this, {
            catalogs: mobx_1.observable,
            status: mobx_1.observable,
            messages: mobx_1.computed,
            domains: mobx_1.computed,
            add: mobx_1.action,
            refreshStatus: mobx_1.action,
        });
        this._id = id || 'multi.' + locale;
        this.catalogs = [];
        this.status = 'waiting';
        this._locale = locale;
    }
    get id() {
        return this._id;
    }
    add(catalog, soft = false) {
        return new Promise((resolve, reject) => {
            if (catalog.locale != this._locale) {
                throw new catalog_1.BadLocaleCatalogError('bad locale, ' + this._locale + ' expected and ' + catalog.locale + ' received');
            }
            if (this.hasCatalog(catalog.id)) {
                if (soft) {
                    resolve();
                    return;
                }
                throw new catalog_1.AlreadyUsedCatalogError('catalog is already used : ' + catalog.id);
            }
            this.catalogs.push(catalog);
            const n = this._normalizedRemaining.shift();
            if (n) {
                catalog.denormalize(n);
            }
            if (this._prepared) {
                catalog.prepare().then(() => {
                    this.refreshStatus();
                    resolve();
                }).catch((err) => {
                    this.refreshStatus();
                    reject(err);
                });
            }
            else {
                resolve();
            }
            this.refreshStatus();
            if (this.status == 'ready') {
                resolve();
            }
        });
    }
    hasCatalog(id) {
        for (const catalog of this.catalogs) {
            if (catalog.id == id) {
                return true;
            }
        }
        return false;
    }
    getCatalogsByDomain(domain) {
        const catalogs = [];
        for (const catalog of this.catalogs) {
            if (catalog.hasDomain(domain)) {
                catalogs.push(catalog);
            }
        }
        return catalogs;
    }
    get locale() {
        return this._locale;
    }
    get messages() {
        let messages = {};
        for (const catalog of this.catalogs) {
            messages = { ...messages, ...catalog.messages };
        }
        return messages;
    }
    get domains() {
        let domains = [];
        for (const catalog of this.catalogs) {
            domains = domains.concat(catalog.domains);
        }
        return domains.filter((item, index) => domains.indexOf(item) === index);
    }
    hasDomain(domain) {
        return this.domains.indexOf(domain) >= 0;
    }
    prepare() {
        return new Promise((resolve, reject) => {
            this._prepared = true;
            if (this.catalogs.length) {
                const promises = [];
                (0, mobx_1.action)(() => {
                    this.status = 'updating';
                })();
                for (const catalog of this.catalogs) {
                    if (catalog.status != 'ready') {
                        promises.push(catalog.prepare());
                    }
                }
                Promise.all(promises).then(() => {
                    this.refreshStatus();
                    resolve();
                }).catch((err) => {
                    this.refreshStatus();
                    reject(err);
                });
            }
            else {
                (0, mobx_1.action)(() => {
                    this.status = 'ready';
                })();
                resolve();
            }
        });
    }
    refreshStatus() {
        if (!this._prepared) {
            return 'waiting';
        }
        for (const catalog of this.catalogs) {
            if (catalog.status !== 'ready') {
                this.status = catalog.status;
                return;
            }
        }
        this.status = 'ready';
    }
    normalize() {
        const data = {
            id: this.id,
            status: this.status,
            catalogs: [],
        };
        for (const c of this.catalogs) {
            data.catalogs.push(c.normalize());
        }
        return data;
    }
    denormalize(data) {
        (0, mobx_1.action)(() => {
            this.status = data.status;
        })();
        for (let k = 0; k < data.catalogs.length; k++) {
            if (this.catalogs[k]) {
                this.catalogs[k].denormalize(data.catalogs[k]);
            }
            else {
                this._normalizedRemaining.push(data.catalogs[k]);
            }
        }
        this.refreshStatus();
    }
}
exports.MultipleCatalog = MultipleCatalog;
