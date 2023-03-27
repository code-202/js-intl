import { CatalogStatus, CatalogMessages, CatalogNormalized, UnreachableRemoteError } from './catalog'
import { JsonLoader } from '@code-202/loader'
import { makeObservable, action, observable } from 'mobx'
import { AbstractCatalog } from './abstract-catalog'

export class RemoteCatalog extends AbstractCatalog {
    public status: CatalogStatus = 'waiting'
    public messages: CatalogMessages = {}
    private _url: string | (() => string)

    constructor (locale: string, url: string | (() => string), domains: string[] = ['default'], id: string = '') {
        super(locale, domains, id)

        makeObservable(this, {
            status: observable,
            messages: observable,

        })

        this._url = url
    }

    prepare (): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.status === 'waiting') {
                const url = typeof this._url === 'function' ? this._url() : this._url
                const loader = new JsonLoader(url, false)

                loader.load().then(() => {
                    action(() => {
                        this.messages = loader.responseData
                        this.status = 'ready'
                    })()
                    resolve()
                }).catch((err) => {
                    action(() => {
                        this.status = 'error'
                    })()
                    console.error(`${url} is unreachable`)
                    reject(new UnreachableRemoteError(`${url} is unreachable`))
                })

                action(() => {
                    this.status = 'updating'
                })()
            } else {
                reject('catalog is already ' + this.status)
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
