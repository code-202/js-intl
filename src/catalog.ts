import { Denormalizable, Normalizable } from "@code-202/serializer"

export interface CatalogMessages extends Record<string, string> {}

export type CatalogStatus = 'waiting' | 'updating' | 'ready' | 'error'

export interface Catalog extends Normalizable<CatalogNormalized>, Denormalizable<CatalogNormalized> {
    id: string
    locale: string
    domains: string[]
    hasDomain (domain: string): boolean
    messages: CatalogMessages
    status: CatalogStatus
    prepare (): Promise<void>
}

export interface CatalogNormalized {
    id: string
    domains?: string[]
}

export class IntlError extends Error {}
export class AlreadyUsedCatalogError extends IntlError {}
export class BadDenormalizationError extends IntlError {}
export class BadLocaleCatalogError extends IntlError {}
export class DenormalizeError extends IntlError {}
export class UnknownLocaleError extends IntlError {}
export class UnreachableRemoteError extends IntlError {}
