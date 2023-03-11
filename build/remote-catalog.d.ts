import { CatalogStatus, CatalogMessages, CatalogNormalized } from './catalog';
import { AbstractCatalog } from './abstract-catalog';
export declare class RemoteCatalog extends AbstractCatalog {
    status: CatalogStatus;
    messages: CatalogMessages;
    private _url;
    constructor(locale: string, url: string | (() => string), domains?: string[]);
    prepare(): Promise<void>;
    normalize(): RemoteCatalogNormalized;
    denormalize(data: RemoteCatalogNormalized): void;
}
export interface RemoteCatalogNormalized extends CatalogNormalized {
    messages?: CatalogMessages;
}
