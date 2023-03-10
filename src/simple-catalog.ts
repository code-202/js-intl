import { Catalog, CatalogMessages, CatalogStatus } from './catalog'
import { AbstractCatalog } from './abstract-catalog'

export class SimpleCatalog extends AbstractCatalog {
    private _messages: CatalogMessages

    constructor (locale: string, messages: CatalogMessages, domains: string[] = ['default']) {
        super(locale, domains)
        this._messages = messages
    }

    get messages () {
        return this._messages
    }

    get status (): CatalogStatus {
        return 'ready'
    }

    prepare (): Promise<void> {
        return Promise.resolve()
    }
}
