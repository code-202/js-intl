import { Catalog, CatalogMessages, CatalogNormalized, CatalogStatus } from './catalog';
export declare class MultipleCatalog implements Catalog {
    catalogs: Catalog[];
    status: CatalogStatus;
    private _locale;
    private _prepared;
    constructor(locale: string);
    addCatalog(catalog: Catalog): Promise<void>;
    getCatalogsByDomain(domain: string): Catalog[];
    get locale(): string;
    get messages(): CatalogMessages;
    get domains(): string[];
    hasDomain(domain: string): boolean;
    prepare(): Promise<void>;
    private refreshStatus;
    normalize(): MultipleCatalogNormalized;
    denormalize(data: MultipleCatalogNormalized): void;
}
export interface MultipleCatalogNormalized extends CatalogNormalized {
    status: CatalogStatus;
    catalogs: CatalogNormalized[];
}
