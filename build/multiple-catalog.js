"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleCatalog = void 0;
const mobx_1 = require("mobx");
class MultipleCatalog {
    catalogs;
    status;
    _locale;
    constructor(locale) {
        (0, mobx_1.makeObservable)(this, {
            catalogs: mobx_1.observable,
            status: mobx_1.observable,
            messages: mobx_1.computed,
            domains: mobx_1.computed,
            addCatalog: mobx_1.action,
        });
        this.catalogs = [];
        this.status = 'waiting';
        this._locale = locale;
    }
    addCatalog(catalog) {
        if (catalog.locale === this._locale) {
            this.catalogs.push(catalog);
            this.refreshStatus();
            (0, mobx_1.when)(() => catalog.status === 'ready', () => {
                this.refreshStatus();
            });
            if (this.status !== 'waiting') {
                catalog.prepare();
            }
        }
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
        return domains;
    }
    hasDomain(domain) {
        return this.domains.indexOf(domain) >= 0;
    }
    prepare() {
        this.status = 'updating';
        if (this.catalogs.length) {
            for (const catalog of this.catalogs) {
                catalog.prepare();
            }
        }
        else {
            this.status = 'ready';
        }
    }
    refreshStatus() {
        for (const catalog of this.catalogs) {
            if (catalog.status === 'waiting' || catalog.status === 'updating') {
                this.status = catalog.status;
                return;
            }
        }
        this.status = 'ready';
    }
}
exports.MultipleCatalog = MultipleCatalog;
