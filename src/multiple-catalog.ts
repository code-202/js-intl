import { Catalog, CatalogMessages, CatalogNormalized, CatalogStatus } from './catalog'
import { makeObservable, observable, when, computed, action } from 'mobx'

export class MultipleCatalog implements Catalog {
    public catalogs: Catalog[]
    public status: CatalogStatus
    private _locale: string

    constructor (locale: string) {
        makeObservable(this, {
            catalogs: observable,
            status: observable,

            messages: computed,
            domains: computed,

            addCatalog: action,
        })

        this.catalogs = []
        this.status = 'waiting'

        this._locale = locale
    }

    addCatalog (catalog: Catalog) {
        if (catalog.locale === this._locale) {
            this.catalogs.push(catalog)

            this.refreshStatus()
            when(() => catalog.status === 'ready', () => {
                this.refreshStatus()
            })

            if (this.status !== 'waiting') {
                catalog.prepare()
            }
        }
    }

    getCatalogsByDomain (domain: string): Catalog[] {
        const catalogs: Catalog[] = []

        for (const catalog of this.catalogs) {
            if (catalog.hasDomain(domain)) {
                catalogs.push(catalog)
            }
        }

        return catalogs
    }

    get locale () {
        return this._locale
    }

    get messages () {
        let messages: CatalogMessages = {}

        for (const catalog of this.catalogs) {
            messages = { ...messages, ...catalog.messages }
        }

        return messages
    }

    get domains (): string[] {
        let domains: string[] = []

        for (const catalog of this.catalogs) {
            domains = domains.concat(catalog.domains)
        }

        return domains
    }

    hasDomain (domain: string): boolean {
        return this.domains.indexOf(domain) >= 0
    }

    prepare () {
        this.status = 'updating'

        if (this.catalogs.length) {
            for (const catalog of this.catalogs) {
                catalog.prepare()
            }
        } else {
            this.status = 'ready'
        }

    }

    private refreshStatus () {
        for (const catalog of this.catalogs) {
            if (catalog.status === 'waiting' || catalog.status === 'updating') {
                this.status = catalog.status
                return
            }
        }

        this.status = 'ready'
    }

    normalize(): MultipleCatalogNormalized {
        const data = {
            status: this.status,
            catalogs: [] as CatalogNormalized[],
        };

        for (const c of this.catalogs) {
            data.catalogs.push(c.normalize());
        }

        return data;
    }

    denormalize(data: MultipleCatalogNormalized) {
        try {
            action(() => {
                this.status = data.status
            })()

            for (let k = 0; k < data.catalogs.length; k++) {
                this.catalogs[k].denormalize(data.catalogs[k])
            }
        } catch (e) {
            console.error('Impossible to deserialize : bad data')
        }
    }
}

export interface MultipleCatalogNormalized extends CatalogNormalized {
    status: CatalogStatus
    catalogs: CatalogNormalized[]
}
