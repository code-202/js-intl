"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleStore = void 0;
const mobx_1 = require("mobx");
const multiple_catalog_1 = require("./multiple-catalog");
class LocaleStore {
    status;
    locale;
    messages;
    catalogs = [];
    constructor(locales) {
        (0, mobx_1.makeObservable)(this, {
            status: mobx_1.observable,
            locale: mobx_1.observable,
            messages: mobx_1.observable,
            domains: mobx_1.computed,
            activeDomains: mobx_1.computed,
            addCatalog: mobx_1.action,
            changeLocale: mobx_1.action,
            changeCurrentCatalog: mobx_1.action,
        });
        this.status = 'waiting';
        this.locale = '';
        this.messages = {};
        for (const locale of locales) {
            if (this.getCatalog(locale) === null) {
                this.catalogs.push(new multiple_catalog_1.MultipleCatalog(locale));
            }
        }
    }
    addCatalog(catalog) {
        const mc = this.getCatalog(catalog.locale);
        if (mc) {
            mc.addCatalog(catalog);
        }
    }
    changeLocale(locale) {
        const catalog = this.getCatalog(locale);
        if (!catalog) {
            return;
        }
        this.status = 'updating';
        if (catalog.status !== 'ready') {
            (0, mobx_1.when)(() => catalog.status === 'ready', () => {
                this.changeCurrentCatalog(catalog);
            });
            catalog.prepare();
            return;
        }
        this.changeCurrentCatalog(catalog);
    }
    changeCurrentCatalog(catalog) {
        this.locale = catalog.locale;
        this.messages = catalog.messages;
        this.status = 'ready';
        (0, mobx_1.when)(() => catalog.status !== 'ready', () => {
            this.changeLocale(catalog.locale);
        });
    }
    getCatalog(locale) {
        for (const catalog of this.catalogs) {
            if (catalog.locale === locale) {
                return catalog;
            }
        }
        return null;
    }
    getCatalogsByDomain(domain) {
        const mc = this.getCatalog(this.locale);
        if (mc) {
            return mc.getCatalogsByDomain(domain);
        }
        return [];
    }
    get domains() {
        const mc = this.getCatalog(this.locale);
        if (mc) {
            return mc.domains;
        }
        return [];
    }
    hasDomain(domain) {
        return this.domains.indexOf(domain) >= 0;
    }
    get activeDomains() {
        const activeDomains = [];
        for (const domain of this.domains) {
            const catalogs = this.getCatalogsByDomain(domain);
            let ready = true;
            if (catalogs.length === 0) {
                ready = false;
            }
            for (const c of catalogs) {
                if (c.status !== 'ready') {
                    ready = false;
                }
            }
            if (ready) {
                activeDomains.push(domain);
            }
        }
        return activeDomains;
    }
    hasActiveDomain(domain) {
        return this.activeDomains.indexOf(domain) >= 0;
    }
}
exports.LocaleStore = LocaleStore;
