import { Denormalizer, Normalizer } from '@code-202/serializer'
import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { CatalogComponent, RemoteCatalog  } from '../src'
import { DenormalizeError } from '../src/catalog'

import app from './server'

let server: any
let catalog: RemoteCatalog
let catalog2: RemoteCatalog

beforeAll(() => {
    server = app.listen(3006)
    catalog = new RemoteCatalog('fr', ':3006/fr.json')
    catalog2 = new RemoteCatalog('fr', ':3006/fr.json')
})
afterAll(() => {
    server.close()
})

test('simple', () => {
    expect.assertions(6)

    expect(catalog.locale).toBe('fr')
    expect(catalog.status).toBe('waiting')
    expect(catalog.messages).toStrictEqual({})
    const p = catalog.prepare().then(() => {
        expect(catalog.status).toBe('ready')
        expect(catalog.messages).toStrictEqual({foo: 'bar'})
    })
    expect(catalog.status).toBe('updating')

    return p
})

test('normalize', () => {
    expect.assertions(2)

    const normalizer = new Normalizer();

    expect(normalizer.normalize(catalog)).toStrictEqual({messages: {foo: 'bar'}})
    expect(normalizer.normalize(catalog2)).toStrictEqual({})
})

test('denormalize', () => {
    expect.assertions(3)

    const denormalizer = new Denormalizer();

    expect(catalog2.status).toBe('waiting')
    denormalizer.denormalize(catalog2, {messages: {foo: 'fighters', bar: 'ney'}})
    expect(catalog2.messages).toStrictEqual({foo: 'fighters', bar: 'ney'})
    expect(catalog2.status).toBe('ready')
})

test('error', () => {
    expect.assertions(6)

    const catalog = new RemoteCatalog('fr', ':3006/404')

    expect(catalog.locale).toBe('fr')
    expect(catalog.status).toBe('waiting')
    expect(catalog.messages).toStrictEqual({})

    const p1 = catalog.prepare()
    const p2 = expect(p1).rejects.toThrow(CatalogComponent.UnreachableRemoteError)
    const p3 = p1.catch(() => {
        expect(catalog.status).toBe('error')
    })
    expect(catalog.status).toBe('updating')

    return Promise.allSettled([p1, p2, p3])
})

test('double prepare', () => {
    expect.assertions(2)

    const catalog = new RemoteCatalog('fr', () => ':3006/fr.json')

    const p = catalog.prepare().then(() => {
        expect(catalog.status).toBe('ready')
    })

    const p2 = catalog.prepare().catch(() => {
        expect(catalog.status).toBe('updating')
    })

    return Promise.allSettled([p, p2])
})