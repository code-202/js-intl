import { CatalogStatus } from './catalog';
import { AbstractCatalog } from './abstract-catalog';
export declare class RemoteCatalog extends AbstractCatalog {
    private _messages;
    private _loader;
    constructor(locale: string, url: string, domains?: string[]);
    get status(): CatalogStatus;
    get messages(): {
        [key: string]: string;
    };
    prepare(): void;
}
