import { Denormalizable, Normalizable } from "@code-202/serializer";
export interface CatalogMessages extends Record<string, string> {
}
export type CatalogStatus = 'waiting' | 'updating' | 'ready' | 'error';
export interface Catalog extends Normalizable<CatalogNormalized>, Denormalizable<CatalogNormalized> {
    locale: string;
    domains: string[];
    hasDomain(domain: string): boolean;
    messages: CatalogMessages;
    status: CatalogStatus;
    prepare(): Promise<void>;
}
export interface CatalogNormalized {
}
export declare class IntlError extends Error {
}
export declare class DenormalizeError extends IntlError {
}
export declare class BadLocaleCatalogError extends IntlError {
}
export declare class UnknownLocaleError extends IntlError {
}
