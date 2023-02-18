import { Catalog, CatalogMessages, CatalogStatus } from './catalog';
export declare abstract class AbstractCatalog implements Catalog {
    private _locale;
    private _domains;
    constructor(locale: string, domains?: string[]);
    get locale(): string;
    get domains(): string[];
    hasDomain(domain: string): boolean;
    abstract get messages(): CatalogMessages;
    abstract get status(): CatalogStatus;
    abstract prepare(): void;
}
