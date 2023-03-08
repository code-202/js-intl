import { Denormalizable, Normalizable } from '@code-202/serializer';
import { Catalog, CatalogMessages, CatalogStatus } from './catalog';
import { MultipleCatalog, MultipleCatalogNormalized } from './multiple-catalog';
export declare class LocaleStore implements Normalizable<LocaleStoreNormalized>, Denormalizable<LocaleStoreNormalized> {
    status: CatalogStatus;
    locale: string;
    messages: CatalogMessages;
    catalogs: MultipleCatalog[];
    constructor(locales: string[]);
    addCatalog(catalog: Catalog): void;
    changeLocale(locale: string): void;
    private changeCurrentCatalog;
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
