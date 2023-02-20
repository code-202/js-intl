export interface CatalogMessages {
    [id: string]: string;
}
export type CatalogStatus = 'waiting' | 'updating' | 'ready';
export interface Catalog {
    locale: string;
    domains: string[];
    hasDomain(domain: string): boolean;
    messages: CatalogMessages;
    status: CatalogStatus;
    prepare(): void;
    serialize(): Record<string, any>;
    deserialize(data: Record<string, any>): void;
}
