"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleStore = void 0;
const mobx_1 = require("mobx");
const catalog_1 = require("./catalog");
const multiple_catalog_1 = require("./multiple-catalog");
const intl_1 = require("@formatjs/intl");
class LocaleStore {
    _status = 'waiting';
    _locale = '';
    _messages = {};
    _disposer = null;
    _intl;
    _intlCache;
    catalogs = [];
    constructor(locales) {
        (0, mobx_1.makeObservable)(this, {
            _status: mobx_1.observable,
            _locale: mobx_1.observable,
            _messages: mobx_1.observable,
            domains: mobx_1.computed,
            activeDomains: mobx_1.computed,
            locale: mobx_1.computed,
            status: mobx_1.computed,
            messages: mobx_1.computed,
            add: mobx_1.action,
        });
        for (const locale of locales) {
            if (this.getCatalog(locale) === null) {
                this.catalogs.push(new multiple_catalog_1.MultipleCatalog(locale));
            }
        }
        this._intlCache = (0, intl_1.createIntlCache)();
        this._intl = this.buildIntl();
        (0, mobx_1.autorun)(() => {
            this._intl = this.buildIntl();
        });
    }
    get locale() {
        return this._locale;
    }
    get status() {
        return this._status;
    }
    get messages() {
        return this._messages;
    }
    get intl() {
        return this._intl;
    }
    add(catalog, soft = false) {
        return new Promise((resolve, reject) => {
            const mc = this.getCatalog(catalog.locale);
            if (mc) {
                mc.add(catalog, soft).then(() => {
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
            }
            else {
                throw new catalog_1.BadLocaleCatalogError('bad locale, ' + catalog.locale + ' is not managed by this store');
            }
        });
    }
    changeLocale(locale) {
        return new Promise((resolve, reject) => {
            if (this._disposer) {
                this._disposer();
            }
            const catalog = this.getCatalog(locale);
            if (!catalog) {
                throw new catalog_1.UnknownLocaleError('bad locale, ' + locale + ' is not managed by this store');
            }
            (0, mobx_1.action)(() => this._status = 'updating')();
            catalog.prepare().then(() => {
                (0, mobx_1.action)(() => {
                    this._locale = catalog.locale;
                    this._messages = catalog.messages;
                    this._status = 'ready';
                })();
                resolve();
            }).catch((err) => {
                (0, mobx_1.action)(() => this._status = 'error')();
                reject(err);
            });
            this._disposer = (0, mobx_1.reaction)(() => catalog.messages, (messages) => {
                (0, mobx_1.action)(() => this._messages = messages)();
            });
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
    buildIntl() {
        return (0, intl_1.createIntl)({
            locale: this._locale || 'en',
            messages: this._messages,
        }, this._intlCache);
    }
    normalize() {
        const data = {
            status: this.status,
            locale: this.locale,
            messages: this.messages,
            catalogs: {},
        };
        for (const c of this.catalogs) {
            data.catalogs[c.locale] = c.normalize();
        }
        return data;
    }
    denormalize(data) {
        (0, mobx_1.action)(() => {
            this._status = data.status;
            this._locale = data.locale;
            this._messages = data.messages;
        })();
        for (const locale in data.catalogs) {
            for (const c of this.catalogs) {
                if (locale == c.locale) {
                    c.denormalize(data.catalogs[locale]);
                }
            }
        }
    }
}
exports.LocaleStore = LocaleStore;
