import { AlreadyUsedCatalogError, BadLocaleCatalogError, Catalog, CatalogMessages, CatalogNormalized, CatalogStatus } from './catalog'
import { makeObservable, observable, computed, action } from 'mobx'
import { SimpleCatalog } from './simple-catalog'
import { RemoteCatalogNormalized } from './remote-catalog'

export class MultipleCatalog implements Catalog {
    public catalogs: Catalog[]
    public status: CatalogStatus
    private _id: string
    private _locale: string
    private _prepared: boolean = false
    private _normalizedRemaining: CatalogNormalized[] = []

    constructor (locale: string, id: string = '') {
        makeObservable <MultipleCatalog, 'refreshStatus'>(this, {
            catalogs: observable,
            status: observable,

            messages: computed,
            domains: computed,

            add: action,
            refreshStatus: action,
        })

        this._id = id || 'multi.'+locale
        this.catalogs = []
        this.status = 'waiting'

        this._locale = locale
    }

    get id (): string {
        return this._id
    }

    add (catalog: Catalog, soft: boolean = false): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (catalog.locale != this._locale) {
                throw new BadLocaleCatalogError('bad locale, ' + this._locale + ' expected and ' + catalog.locale + ' received')
            }

            if (this.hasCatalog(catalog.id)) {
                if (soft) {
                    resolve()
                    return
                }
                throw new AlreadyUsedCatalogError('catalog is already used : ' + catalog.id)
            }

            this.catalogs.push(catalog)

            for (const i in this._normalizedRemaining) {

                if (this._normalizedRemaining[i].id == catalog.id) {
                    catalog.denormalize(this._normalizedRemaining[i])

                    this._normalizedRemaining.splice(parseInt(i), 1)
                    continue
                }
            }

            if (this._prepared) {
                catalog.prepare().then(() => {
                    this.refreshStatus()
                    resolve()
                }).catch((err) => {
                    this.refreshStatus()
                    reject(err)
                })
            } else {
                resolve()
            }

            this.refreshStatus()

            if (this.status == 'ready') {
                resolve()
            }
        })
    }

    hasCatalog (id: string): boolean {
        for (const catalog of this.catalogs) {
            if (catalog.id == id) {
                return true
            }
        }

        return false
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

        return domains.filter((item, index) => domains.indexOf(item) === index)
    }

    hasDomain (domain: string): boolean {
        return this.domains.indexOf(domain) >= 0
    }

    prepare (): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._prepared = true
            if (this.catalogs.length) {
                const promises : Promise<void>[] = []
                action(() => {
                    this.status = 'updating'
                })()
                for (const catalog of this.catalogs) {
                    if (catalog.status != 'ready') {
                        promises.push(catalog.prepare())
                    }
                }

                Promise.all(promises).then(() => {
                    this.refreshStatus()
                    resolve()
                }).catch((err) => {
                    this.refreshStatus()
                    reject(err)
                })
            } else {
                action(() => {
                    this.status = 'ready'
                })()
                resolve()
            }
        })
    }

    private refreshStatus () {
        if (!this._prepared) {
            return 'waiting'
        }

        for (const catalog of this.catalogs) {
            if (catalog.status !== 'ready') {
                this.status = catalog.status
                return
            }
        }

        this.status = 'ready'
    }

    normalize(): MultipleCatalogNormalized {
        const data = {
            id: this.id,
            status: this.status,
            catalogs: [] as CatalogNormalized[],
        };

        for (const c of this.catalogs) {
            data.catalogs.push(c.normalize());
        }

        return data;
    }

    denormalize(data: MultipleCatalogNormalized) {
        action(() => {
            this.status = data.status
        })()

        const normalizedCatalogs = data.catalogs.slice(0)
        for (const catalog of this.catalogs) {
            for (const i in normalizedCatalogs) {
                if (normalizedCatalogs[i].id == catalog.id) {
                    catalog.denormalize(normalizedCatalogs[i])

                    normalizedCatalogs.splice(parseInt(i), 1)
                    continue
                }
            }
        }

        for (const i in normalizedCatalogs) {
            const rcData = normalizedCatalogs[i] as RemoteCatalogNormalized
            if (rcData.messages != undefined && rcData.domains != undefined) {

                const c = new SimpleCatalog(this.locale, rcData.messages, rcData.domains, rcData.id)
                c.denormalize(rcData)
                this.add(c)

                normalizedCatalogs.splice(parseInt(i), 1)
                continue
            }
        }

        this._normalizedRemaining = normalizedCatalogs

        this.refreshStatus()
    }
}

export interface MultipleCatalogNormalized extends CatalogNormalized {
    status: CatalogStatus
    catalogs: CatalogNormalized[]
}
