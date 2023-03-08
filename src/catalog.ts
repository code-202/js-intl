import { Denormalizable, Normalizable } from "@code-202/serializer"

export interface CatalogMessages extends Record<string, string> {}

export type CatalogStatus = 'waiting' | 'updating' | 'ready'

export interface Catalog extends Normalizable<CatalogNormalized>, Denormalizable<CatalogNormalized> {
    locale: string
    domains: string[]
    hasDomain (domain: string): boolean
    messages: CatalogMessages
    status: CatalogStatus
    prepare (): void
}

export interface CatalogNormalized {

}
