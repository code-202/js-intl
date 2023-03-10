import { Catalog, CatalogStatus, CatalogMessages, CatalogNormalized } from './catalog'
import { JsonLoader } from '@code-202/loader'
import { makeObservable, when, action, observable } from 'mobx'
import { AbstractCatalog } from './abstract-catalog'

export class RemoteCatalog extends AbstractCatalog {
    public status: CatalogStatus = 'waiting'
    public messages: CatalogMessages = {}
    private _url: string

    constructor (locale: string, url: string, domains: string[] = ['default']) {
        super(locale, domains)

        makeObservable(this, {
            status: observable,
            messages: observable,

        })

        this._url = url
    }

    prepare (): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.status === 'waiting') {
                const loader = new JsonLoader(this._url)

                when(() => loader.status === 'done' || loader.status === 'error').then(action(() => {
                    if (loader.status === 'done') {
                        this.messages = loader.responseData

                        action(() => {
                            this.status = 'ready'
                        })()
                        resolve()
                    } else {
                        action(() => {
                            this.status = 'error'
                        })()
                        reject()
                    }
                }))

                action(() => {
                    this.status = 'updating'
                })()
            } else {
                reject()
            }
        })
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
        action(() => {
            if (data.messages) {
                this.messages = data.messages
                this.status = 'ready'
            }
        })()
    }
}

export interface RemoteCatalogNormalized extends CatalogNormalized {
    messages?: CatalogMessages
}
