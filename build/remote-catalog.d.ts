import { CatalogStatus, CatalogMessages } from './catalog';
import { AbstractCatalog } from './abstract-catalog';
export declare class RemoteCatalog extends AbstractCatalog {
    status: CatalogStatus;
    messages: CatalogMessages;
    private _url;
    constructor(locale: string, url: string, domains?: string[]);
    prepare(): void;
    serialize(): Record<string, any>;
    deserialize(data: Record<string, any>): void;
}
