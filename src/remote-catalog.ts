import { Catalog, CatalogStatus } from './catalog'
import { JsonLoader } from 'react-mobx-loader'
import { when } from 'mobx'
import { AbstractCatalog } from './abstract-catalog'

export class RemoteCatalog extends AbstractCatalog {
    private _messages: {[key: string]: string} = {}
    private _loader: JsonLoader

    constructor (locale: string, url: string, domains: string[] = ['default']) {
        super(locale, domains)
        this._loader = new JsonLoader(url, false)

        when(() => this._loader.status === 'done', () => {
            this._messages = this._loader.responseData
        })
    }

    get status (): CatalogStatus {
        switch (this._loader.status) {
        case 'waiting':
            return 'waiting'
        case 'pending':
            return 'updating'
        default:
            return 'ready'
        }
    }

    get messages () {

        if (this._messages) {
            return this._messages
        }

        return {}
    }

    prepare () {
        if (this._loader.status === 'waiting') {
            this._loader.load()
        }
    }
}
