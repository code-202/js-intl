import { Catalog, CatalogMessages, CatalogNormalized, CatalogStatus } from './catalog';
export declare class MultipleCatalog implements Catalog {
    catalogs: Catalog[];
    status: CatalogStatus;
    private _id;
    private _locale;
    private _prepared;
    private _normalizedRemaining;
    constructor(locale: string, id?: string);
    get id(): string;
    add(catalog: Catalog, soft?: boolean): Promise<void>;
    hasCatalog(id: string): boolean;
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
