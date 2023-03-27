import { Denormalizable, Normalizable } from '@code-202/serializer';
import { Catalog, CatalogMessages, CatalogStatus } from './catalog';
import { MultipleCatalog, MultipleCatalogNormalized } from './multiple-catalog';
import { IntlShape } from '@formatjs/intl';
export declare class LocaleStore implements Normalizable<LocaleStoreNormalized>, Denormalizable<LocaleStoreNormalized> {
    private _status;
    private _locale;
    private _messages;
    private _disposer;
    private _intl;
    private _intlCache;
    catalogs: MultipleCatalog[];
    constructor(locales: string[]);
    get locale(): string;
    get status(): CatalogStatus;
    get messages(): CatalogMessages;
    get intl(): IntlShape;
    add(catalog: Catalog): Promise<void>;
    changeLocale(locale: string): Promise<void>;
    getCatalog(locale: string): MultipleCatalog | null;
    getCatalogsByDomain(domain: string): Catalog[];
    get domains(): string[];
    hasDomain(domain: string): boolean;
    get activeDomains(): string[];
    hasActiveDomain(domain: string): boolean;
    protected buildIntl(): IntlShape;
    normalize(): LocaleStoreNormalized;
    denormalize(data: LocaleStoreNormalized): void;
}
export interface LocaleStoreNormalized {
    status: CatalogStatus;
    locale: string;
    messages: CatalogMessages;
    catalogs: Record<string, MultipleCatalogNormalized>;
}
