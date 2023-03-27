import { CatalogMessages, CatalogStatus } from './catalog';
import { AbstractCatalog } from './abstract-catalog';
export declare class SimpleCatalog extends AbstractCatalog {
    private _messages;
    constructor(locale: string, messages: CatalogMessages, domains?: string[], id?: string);
    get messages(): CatalogMessages;
    get status(): CatalogStatus;
    prepare(): Promise<void>;
}
