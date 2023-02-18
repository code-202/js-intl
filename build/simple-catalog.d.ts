import { CatalogMessages, CatalogStatus } from './catalog';
import { AbstractCatalog } from './abstract-catalog';
export declare class SimpleCatalog extends AbstractCatalog {
    private _messages;
    private _status;
    constructor(locale: string, messages: CatalogMessages, domains?: string[]);
    get messages(): CatalogMessages;
    get status(): CatalogStatus;
    prepare(): void;
}
