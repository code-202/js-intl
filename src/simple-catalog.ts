import { Catalog, CatalogMessages, CatalogStatus } from './catalog'
import { AbstractCatalog } from './abstract-catalog'

export class SimpleCatalog extends AbstractCatalog {
    private _messages: CatalogMessages
    private _status: CatalogStatus = 'waiting'

    constructor (locale: string, messages: CatalogMessages, domains: string[] = ['default']) {
        super(locale, domains)
        this._messages = messages

        this._status = 'ready'
    }

    get messages () {
        return this._messages
    }

    get status (): CatalogStatus {
        return this._status
    }

    prepare () {
        // Nothing to do
    }
}
