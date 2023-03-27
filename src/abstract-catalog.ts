import { Catalog, CatalogMessages, CatalogNormalized, CatalogStatus } from './catalog'

export abstract class AbstractCatalog implements Catalog {
    private _id: string
    private _locale: string
    private _domains: string[]

    constructor (locale: string, domains: string[] = ['default'], id: string = '') {
        this._id = id || locale+'.'+domains.join('.')
        this._locale = locale
        this._domains = domains
    }

    get id (): string {
        return this._id
    }

    get locale () {
        return this._locale
    }

    get domains (): string[] {
        return this._domains
    }

    hasDomain (domain: string): boolean {
        return this.domains.indexOf(domain) >= 0
    }

    abstract get messages (): CatalogMessages

    abstract get status (): CatalogStatus

    abstract prepare (): Promise<void>

    normalize(): CatalogNormalized {
        return {
            id: this.id,
        }
    }

    denormalize(data: CatalogNormalized) {
        // Do nothing
    }
}
