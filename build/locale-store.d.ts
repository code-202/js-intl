import { Denormalizable, Normalizable } from '@code-202/serializer';
import { Catalog, CatalogMessages, CatalogStatus } from './catalog';
import { MultipleCatalog, MultipleCatalogNormalized } from './multiple-catalog';
export declare class LocaleStore implements Normalizable<LocaleStoreNormalized>, Denormalizable<LocaleStoreNormalized> {
    private _status;
    private _locale;
    private _messages;
    catalogs: MultipleCatalog[];
    constructor(locales: string[]);
    get locale(): string;
    get status(): CatalogStatus;
    get messages(): CatalogMessages;
    addCatalog(catalog: Catalog): Promise<void>;
    changeLocale(locale: string): Promise<void>;
    getCatalog(locale: string): MultipleCatalog | null;
    getCatalogsByDomain(domain: string): Catalog[];
    get domains(): string[];
    hasDomain(domain: string): boolean;
    get activeDomains(): string[];
    hasActiveDomain(domain: string): boolean;
    normalize(): LocaleStoreNormalized;
    denormalize(data: LocaleStoreNormalized): void;
}
export interface LocaleStoreNormalized {
    status: CatalogStatus;
    locale: string;
    messages: CatalogMessages;
    catalogs: Record<string, MultipleCatalogNormalized>;
}
