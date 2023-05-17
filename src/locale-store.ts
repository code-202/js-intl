import * as React from 'react'
import { Denormalizable, Normalizable } from '@code-202/serializer'
import { makeObservable, observable, action, computed, reaction, IReactionDisposer, autorun } from 'mobx'
import { BadLocaleCatalogError, Catalog, CatalogMessages, CatalogStatus, UnknownLocaleError } from './catalog'
import { MultipleCatalog, MultipleCatalogNormalized } from './multiple-catalog'
import {createIntl, createIntlCache, IntlShape, IntlCache} from '@formatjs/intl'

export class LocaleStore implements Normalizable<LocaleStoreNormalized>, Denormalizable<LocaleStoreNormalized> {
    private _status: CatalogStatus = 'waiting'
    private _locale: string = ''
    private _messages: CatalogMessages = {}
    private _disposer: IReactionDisposer | null = null
    private _intl: IntlShape<React.ReactNode>
    private _intlCache: IntlCache

    catalogs: MultipleCatalog[] = []

    constructor (locales: string[]) {
        makeObservable <LocaleStore, '_status' | '_locale' | '_messages'>(this, {
            _status: observable,
            _locale: observable,
            _messages: observable,

            domains: computed,
            activeDomains: computed,
            locale: computed,
            status: computed,
            messages: computed,

            add: action,
        })

        for (const locale of locales) {
            if (this.getCatalog(locale) === null) {
                this.catalogs.push(new MultipleCatalog(locale))
            }
        }

        this._intlCache = createIntlCache()
        this._intl = this.buildIntl()

        autorun(() => {
            this._intl = this.buildIntl()
        })
    }

    get locale (): string {
        return this._locale
    }

    get status (): CatalogStatus {
        return this._status
    }

    get messages (): CatalogMessages {
        return this._messages
    }

    get intl (): IntlShape<React.ReactNode> {
        return this._intl
    }

    add (catalog: Catalog, soft: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const mc = this.getCatalog(catalog.locale)
            if (mc) {
                mc.add(catalog, soft).then(() => {
                    resolve()
                }).catch((err) => {
                    reject(err)
                })
            } else {
                throw new BadLocaleCatalogError('bad locale, ' + catalog.locale + ' is not managed by this store')
            }
        })
    }

    changeLocale (locale: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this._disposer) {
                this._disposer()
            }

            const catalog = this.getCatalog(locale)

            if (!catalog) {
                throw new UnknownLocaleError('bad locale, ' + locale + ' is not managed by this store')
            }

            action(() => this._status = 'updating')()

            catalog.prepare().then(() => {
                action(() => {
                    this._locale = catalog.locale
                    this._messages = catalog.messages
                    this._status = 'ready'
                })()

                resolve()
            }).catch((err) => {
                action(() => this._status = 'error')()
                reject(err)
            })

            this._disposer = reaction(() => catalog.messages, (messages) => {
                action(() => this._messages = messages)()
            })
        })
    }

    getCatalog (locale: string): MultipleCatalog | null {
        for (const catalog of this.catalogs) {
            if (catalog.locale === locale) {
                return catalog
            }
        }

        return null
    }

    getCatalogsByDomain (domain: string): Catalog[] {
        const mc = this.getCatalog(this.locale)
        if (mc) {
            return mc.getCatalogsByDomain(domain)
        }

        return []
    }

    get domains (): string[] {
        const mc = this.getCatalog(this.locale)
        if (mc) {
            return mc.domains
        }

        return []
    }

    hasDomain (domain: string): boolean {
        return this.domains.indexOf(domain) >= 0
    }

    get activeDomains (): string[] {
        const activeDomains = []

        for (const domain of this.domains) {
            const catalogs = this.getCatalogsByDomain(domain)

            let ready = true

            for (const c of catalogs) {
                if (c.status !== 'ready') {
                    ready = false
                }
            }

            if (ready) {
                activeDomains.push(domain)
            }
        }

        return activeDomains
    }

    hasActiveDomain (domain: string): boolean {
        return this.activeDomains.indexOf(domain) >= 0
    }

    protected buildIntl(): IntlShape<React.ReactNode> {
        return createIntl<React.ReactNode>({
            locale: this._locale || 'en',
            messages: this._messages,
        }, this._intlCache)
    }

    normalize (): LocaleStoreNormalized {
        const data = {
            status: this.status,
            locale: this.locale,
            messages: this.messages,
            catalogs: {} as Record<string, MultipleCatalogNormalized>,
        };

        for (const c of this.catalogs) {
            data.catalogs[c.locale] = c.normalize()
        }

        return data
    }

    denormalize (data: LocaleStoreNormalized) {
        action(() => {
            this._status = data.status
            this._locale = data.locale
            this._messages = data.messages
        })()

        for (const locale in data.catalogs) {
            for (const c of this.catalogs) {
                if (locale == c.locale) {
                    c.denormalize(data.catalogs[locale])
                }
            }
        }
    }
}

export interface LocaleStoreNormalized {
    status: CatalogStatus
    locale: string
    messages: CatalogMessages
    catalogs: Record<string, MultipleCatalogNormalized>
}
