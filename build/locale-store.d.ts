import { Catalog, CatalogMessages, CatalogStatus } from './catalog';
import { MultipleCatalog } from './multiple-catalog';
export declare class LocaleStore {
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
}
