import { Denormalizer, Normalizer } from '@code-202/serializer'
import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { MultipleCatalog, SimpleCatalog, RemoteCatalog, CatalogComponent } from '../src'

import app from './server'

let server: any
beforeAll(() => {
    server = app.listen(3007)
})
afterAll(() => {
    server.close()
})

test('simple', () => {
    expect.assertions(13)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    expect(catalog.locale).toBe('fr')
    expect(catalog.status).toBe('waiting')
    expect(catalog.domains).toStrictEqual([])

    const c1 = new SimpleCatalog('fr', {foo: 'bar'})
    const c2 = new RemoteCatalog('fr', ':3007/fr.app.json', ['app'])
    catalog.addCatalog(c1)
    expect(catalog.domains).toStrictEqual(['default'])
    catalog.addCatalog(c2)
    expect(catalog.domains).toStrictEqual(['default', 'app'])
    expect(catalog.status).toBe('waiting')

    expect(catalog.getCatalogsByDomain('default')).toStrictEqual([c1])
    expect(catalog.getCatalogsByDomain('app')).toStrictEqual([c2])

    expect(catalog.hasDomain('app')).toBe(true)
    expect(catalog.hasDomain('other')).toBe(false)

    const p = catalog.prepare().then(() => {
        expect(catalog.status).toBe('ready')
        expect(catalog.messages).toStrictEqual({foo: 'bar', welcome: 'Bienvenue', question: 'answer'})
    })
    expect(catalog.status).toBe('updating')

    catalog.addCatalog(new SimpleCatalog('fr', {question: 'answer'}, ['help']))

    return p
})

test('prepare before add', () => {
    expect.assertions(4)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    catalog.prepare()
    expect(catalog.status).toBe('ready')

    const p1 = catalog.addCatalog(new SimpleCatalog('fr', {ping: 'pong'}))
    expect(catalog.status).toBe('ready')

    const p2 = catalog.addCatalog(new RemoteCatalog('fr', ':3007/fr.app.json', ['app'])).then(() => {
        expect(catalog.status).toBe('ready')
    })
    expect(catalog.status).toBe('updating')

    return Promise.all([p1, p2])
})

test('bad locale catalog', () => {
    expect.assertions(4)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    const p1 = catalog.addCatalog(new SimpleCatalog('en', {ping: 'pong'}))
    const p2 = expect(p1).rejects.toThrow(CatalogComponent.BadLocaleCatalogError)
    const p3 = p1.catch(() => {
        expect(catalog.messages).toStrictEqual({})
        expect(catalog.status).toBe('ready')
    })
    expect(catalog.status).toBe('waiting')

    return Promise.allSettled([p1, p2, p3])
})

test('bad remote catalog', () => {
    expect.assertions(6)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    catalog.addCatalog(new RemoteCatalog('fr', ':3007/404'))
    expect(catalog.status).toBe('waiting')

    const p2 = catalog.prepare().catch(() => {
        expect(catalog.messages).toStrictEqual({})
        expect(catalog.status).toBe('ready')
    })

    const p3 = catalog.addCatalog(new RemoteCatalog('fr', ':3007/404')).catch(() => {
        expect(catalog.messages).toStrictEqual({})
        expect(catalog.status).toBe('ready')
    })
    expect(catalog.status).toBe('updating')

    return Promise.allSettled([p2, p3])
})

test('double prepare', () => {
    expect.assertions(2)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    catalog.addCatalog(new RemoteCatalog('fr', ':3007/fr.json', ['app']))

    const p = catalog.prepare().then(() => {
        expect(catalog.status).toBe('ready')
    })

    const p2 = catalog.prepare().catch(() => {
        expect(catalog.status).toBe('updating')
    })

    return Promise.allSettled([p, p2])
})

test('normalize', () => {
    expect.assertions(2)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')
    const normalizer = new Normalizer();

    catalog.addCatalog(new SimpleCatalog('fr', {foo: 'bar'}))
    catalog.addCatalog(new RemoteCatalog('fr', ':3007/fr.json', ['app']))

    expect(normalizer.normalize(catalog)).toStrictEqual({catalogs: [{}, {}], status: 'waiting'})

    const p = catalog.prepare().then(() => {
        expect(normalizer.normalize(catalog)).toStrictEqual({catalogs: [{}, { messages: {foo: 'bar'}}], status: 'ready'})
    })

    return p
})

test('denormalize', () => {
    expect.assertions(5)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')
    const denormalizer = new Denormalizer();

    catalog.addCatalog(new SimpleCatalog('fr', {foo: 'bar'}))
    catalog.addCatalog(new RemoteCatalog('fr', ':3007/fr.app.json', ['app']))

    expect(catalog.status).toBe('waiting')
    denormalizer.denormalize(catalog, {catalogs: [{}, {}], status: 'waiting'})
    expect(catalog.messages).toStrictEqual({foo: 'bar'})
    expect(catalog.status).toBe('waiting')

    denormalizer.denormalize(catalog, {catalogs: [{}, { messages: {welcome: 'Bienvenue'}}], status: 'ready'})
    expect(catalog.messages).toStrictEqual({foo: 'bar', welcome: 'Bienvenue'})
    expect(catalog.status).toBe('ready')
})
