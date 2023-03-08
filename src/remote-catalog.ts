import { Catalog, CatalogStatus, CatalogMessages, CatalogNormalized } from './catalog'
import { JsonLoader } from '@code-202/loader'
import { makeObservable, when, action, observable } from 'mobx'
import { AbstractCatalog } from './abstract-catalog'

export class RemoteCatalog extends AbstractCatalog {
    public status: CatalogStatus
    public messages: CatalogMessages
    private _url: string

    constructor (locale: string, url: string, domains: string[] = ['default']) {
        super(locale, domains)

        makeObservable(this, {
            status: observable,
            messages: observable,

        })

        this.status = 'waiting'
        this.messages = {}

        this._url = url
    }

    prepare () {
        if (this.status === 'waiting') {
            const loader = new JsonLoader(this._url)

            when(() => loader.status === 'done').then(action(() => {
                this.messages = loader.responseData
                this.status = 'ready'
            }))

            this.status = 'updating'
        }
    }

    normalize(): RemoteCatalogNormalized {
        if (this.status === 'ready') {
            return {
                messages: this.messages
            }
        }

        return {}
    }

    denormalize(data: RemoteCatalogNormalized) {
        try {
            action(() => {
                if (data.messages) {
                    this.messages = data.messages
                    this.status = 'ready'
                }
            })()
        } catch (e) {
            console.error('Impossible to deserialize : bad data')
        }
    }
}

export interface RemoteCatalogNormalized extends CatalogNormalized {
    messages?: CatalogMessages
}
