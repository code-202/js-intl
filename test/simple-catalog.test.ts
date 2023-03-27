import { Denormalizer, Normalizer } from '@code-202/serializer'
import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { SimpleCatalog  } from '../src'
import { BadDenormalizationError } from '../src/catalog'

let catalog: SimpleCatalog
let catalog2: SimpleCatalog

beforeAll(() => {
    catalog = new SimpleCatalog('fr', {
        foo: 'bar'
    })

    catalog2 = new SimpleCatalog('en', {
        bar: 'foo'
    }, ['app'])
})

test('simple', () => {
    expect.assertions(8)

    expect(catalog.locale).toBe('fr')
    expect(catalog.domains).toStrictEqual(['default'])
    expect(catalog.status).toBe('ready')
    expect(catalog.messages).toStrictEqual({foo: 'bar'})
    expect(catalog.hasDomain('default')).toBe(true)
    expect(catalog.hasDomain('other')).toBe(false)

    expect(catalog2.hasDomain('default')).toBe(false)
    expect(catalog2.hasDomain('app')).toBe(true)

    return catalog.prepare()
})

test('normalize', () => {
    expect.assertions(1)

    const normalizer = new Normalizer();

    expect(normalizer.normalize(catalog)).toStrictEqual({id: 'fr.default'})
})

test('denormalize', () => {
    expect.assertions(1)

    const denormalizer = new Denormalizer();

    expect(() => denormalizer.denormalize(catalog, {id: 'fr.default.2'})).toThrow(BadDenormalizationError)
})
