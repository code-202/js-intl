import { Catalog, CatalogMessages, CatalogStatus } from './catalog'

export abstract class AbstractCatalog implements Catalog {
    private _locale: string
    private _domains: string[]

    constructor (locale: string, domains: string[] = ['default']) {
        this._locale = locale
        this._domains = domains
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

    abstract prepare (): void
}
