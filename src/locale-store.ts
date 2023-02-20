import { makeObservable, observable, action, computed, when } from 'mobx'
import { Catalog, CatalogMessages, CatalogStatus } from './catalog'
import { MultipleCatalog } from './multiple-catalog'

export class LocaleStore {
    public status: CatalogStatus
    public locale: string
    public messages: CatalogMessages

    catalogs: MultipleCatalog[] = []

    constructor (locales: string[]) {
        makeObservable <LocaleStore, 'changeCurrentCatalog'>(this, {
            status: observable,
            locale: observable,
            messages: observable,

            domains: computed,
            activeDomains: computed,

            addCatalog: action,
            changeLocale: action,
            changeCurrentCatalog: action,
        })

        this.status = 'waiting'
        this.locale = ''
        this.messages = {}

        for (const locale of locales) {
            if (this.getCatalog(locale) === null) {
                this.catalogs.push(new MultipleCatalog(locale))
            }
        }
    }

    addCatalog (catalog: Catalog) {
        const mc = this.getCatalog(catalog.locale)
        if (mc) {
            mc.addCatalog(catalog)
        }
    }

    changeLocale (locale: string) {
        const catalog = this.getCatalog(locale)

        if (!catalog) {
            return
        }

        this.status = 'updating'

        if (catalog.status !== 'ready') {
            when(() => catalog.status === 'ready', () => {
                this.changeCurrentCatalog(catalog)
            })

            catalog.prepare()

            return
        }

        this.changeCurrentCatalog(catalog)
    }

    private changeCurrentCatalog (catalog: Catalog) {
        this.locale = catalog.locale
        this.messages = catalog.messages
        this.status = 'ready'

        when(() => catalog.status !== 'ready', () => {
            this.changeLocale(catalog.locale)
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
        const activeDomains: string[] = []

        for (const domain of this.domains) {
            const catalogs = this.getCatalogsByDomain(domain)

            let ready = true

            if (catalogs.length === 0) {
                ready = false
            }

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

    serialize(): Record<string, any> {
        const data = {
            status: this.status,
            locale: this.locale,
            messages: this.messages,
            catalogs: {} as Record<string, any>,
        };

        for (const c of this.catalogs) {
            data.catalogs[c.locale] = c.serialize();
        }

        return data;
    }

    deserialize(data: Record<string, any>): void {
        try {
            action(() => {
                this.status = data.status
                this.locale = data.locale
                this.messages = data.messages
            })()

            for (const locale in data.catalogs) {
                for (const c of this.catalogs) {
                    if (locale == c.locale) {
                        c.deserialize(data.catalogs[locale])
                    }
                }
            }
        } catch (e) {
            console.error('Impossible to deserialize : bad data')
        }
    }
}
