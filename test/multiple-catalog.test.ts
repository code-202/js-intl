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
    catalog.add(c1)
    expect(catalog.domains).toStrictEqual(['default'])
    catalog.add(c2)
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

    catalog.add(new SimpleCatalog('fr', {question: 'answer'}, ['help']))

    return p
})

test('prepare before add', () => {
    expect.assertions(4)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    catalog.prepare()
    expect(catalog.status).toBe('ready')

    const p1 = catalog.add(new SimpleCatalog('fr', {ping: 'pong'}))
    expect(catalog.status).toBe('ready')

    const p2 = catalog.add(new RemoteCatalog('fr', ':3007/fr.app.json', ['app'])).then(() => {
        expect(catalog.status).toBe('ready')
    })
    expect(catalog.status).toBe('updating')

    return Promise.all([p1, p2])
})

test('bad locale catalog', () => {
    expect.assertions(4)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    const p1 = catalog.add(new SimpleCatalog('en', {ping: 'pong'}))
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

    catalog.add(new RemoteCatalog('fr', ':3007/404'))
    expect(catalog.status).toBe('waiting')

    const p2 = catalog.prepare().catch(() => {
        expect(catalog.messages).toStrictEqual({})
        expect(catalog.status).toBe('ready')
    })

    const p3 = catalog.add(new RemoteCatalog('fr', ':3007/404')).catch(() => {
        expect(catalog.messages).toStrictEqual({})
        expect(catalog.status).toBe('ready')
    })
    expect(catalog.status).toBe('updating')

    return Promise.allSettled([p2, p3])
})

test('double prepare', () => {
    expect.assertions(2)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    catalog.add(new RemoteCatalog('fr', ':3007/fr.json', ['app']))

    const p = catalog.prepare().then(() => {
        expect(catalog.status).toBe('ready')
    })

    const p2 = catalog.prepare().catch(() => {
        expect(catalog.status).toBe('updating')
    })

    return Promise.allSettled([p, p2])
})

test('already add catalog error', () => {
    expect.assertions(6)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')

    const p1 = catalog.add(new SimpleCatalog('fr', {foo: 'bar'}))
    const p2 = catalog.add(new SimpleCatalog('fr', {welcome: 'Bienvenue'}, ['app']))
    const p3 = catalog.add(new SimpleCatalog('fr', {bye: 'Au revoir'}, ['app']))
    expect(p3).rejects.toThrow(CatalogComponent.AlreadyUsedCatalogError)
    expect(catalog.messages).toStrictEqual({foo: 'bar', welcome: 'Bienvenue'})

    const p4 = catalog.add(new SimpleCatalog('fr', {bye: 'Au revoir'}, ['app']), true)
    expect(p4).resolves.toBe(undefined)
    expect(catalog.messages).toStrictEqual({foo: 'bar', welcome: 'Bienvenue'})

    const p5 = catalog.add(new SimpleCatalog('fr', {bye: 'Au revoir'}, ['app'], 'other'), true)
    expect(p5).resolves.toBe(undefined)
    expect(catalog.messages).toStrictEqual({foo: 'bar', welcome: 'Bienvenue', bye: 'Au revoir'})

    return Promise.allSettled([p1, p2, p3, p4, p5])
})

test('normalize', () => {
    expect.assertions(2)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')
    const normalizer = new Normalizer();

    catalog.add(new SimpleCatalog('fr', {foo: 'bar'}))
    catalog.add(new RemoteCatalog('fr', ':3007/fr.json', ['app']))

    expect(normalizer.normalize(catalog)).toStrictEqual({id: 'multi.fr', catalogs: [{id: 'fr.default'}, {id: 'fr.app'}], status: 'waiting'})

    const p = catalog.prepare().then(() => {
        expect(normalizer.normalize(catalog)).toStrictEqual({id: 'multi.fr', catalogs: [{id: 'fr.default'}, {id: 'fr.app', domains: ['app'], messages: {foo: 'bar'}}], status: 'ready'})
    })

    return p
})

test('denormalize', () => {
    expect.assertions(10)

    const catalog: MultipleCatalog = new MultipleCatalog('fr')
    const denormalizer = new Denormalizer();

    catalog.add(new SimpleCatalog('fr', {foo: 'bar'}))
    catalog.add(new RemoteCatalog('fr', ':3007/fr.app.json', ['app']))

    expect(catalog.status).toBe('waiting')
    denormalizer.denormalize(catalog, {catalogs: [{id: 'fr.default'}, {id: 'fr.app'}], status: 'waiting'})
    expect(catalog.messages).toStrictEqual({foo: 'bar'})
    expect(catalog.status).toBe('waiting')

    denormalizer.denormalize(catalog, {catalogs: [{id: 'fr.app', messages: {welcome: 'Bienvenue'}}, {id: 'fr.default'}], status: 'ready'})
    expect(catalog.messages).toStrictEqual({foo: 'bar', welcome: 'Bienvenue'})
    expect(catalog.status).toBe('ready')


    denormalizer.denormalize(catalog, {catalogs: [{id: 'fr.app.2', domains: ['app'], messages: {bye: 'Au revoir'}}, {id: 'fr.default.2'}, {id: 'multi.fr2', messages: {hello: 'Bonjour'}}], status: 'ready'})
    expect(catalog.messages).toStrictEqual({foo: 'bar', welcome: 'Bienvenue', bye: 'Au revoir'})
    expect(catalog.status).toBe('ready')
    expect(catalog.hasCatalog('fr.app.2')).toBe(true)
    expect(catalog.hasCatalog('fr.default.2')).toBe(false)
    expect(catalog.hasCatalog('multi.fr.2')).toBe(false)
})

test('ssr', async () => {
    expect.assertions(8)

    const normalizer = new Normalizer();
    const denormalizer = new Denormalizer();

    const catalogServer: MultipleCatalog = new MultipleCatalog('fr')
    await catalogServer.add(new SimpleCatalog('fr', {simple: 'catalog'}))
    await catalogServer.add(new RemoteCatalog('fr', ':3007/fr.json', undefined, 'fr.default.remote'))
    await catalogServer.add(new RemoteCatalog('fr', ':3007/fr.app.json', ['app']))
    await catalogServer.add(new RemoteCatalog('fr', ':3007/fr.account.json', ['account']))
    await catalogServer.prepare()

    const normalized = await normalizer.normalize(catalogServer)

    expect(catalogServer.messages).toStrictEqual({simple: 'catalog', foo: 'bar', welcome: 'Bienvenue', account: 'Mon compte'})

    const catalogClient: MultipleCatalog = new MultipleCatalog('fr')
    await catalogClient.add(new SimpleCatalog('fr', {simple: 'catalog'}))
    await catalogClient.add(new RemoteCatalog('fr', ':3007/fr.json', undefined, 'fr.default.remote'))
    await catalogClient.add(new RemoteCatalog('fr', ':3007/fr.app.json', ['app']))

    await denormalizer.denormalize(catalogClient, normalized)
    await catalogClient.prepare()

    expect(catalogClient.messages).toStrictEqual({simple: 'catalog', foo: 'bar', welcome: 'Bienvenue', account: 'Mon compte'})
    expect(catalogClient.domains).toStrictEqual(['default', 'app', 'account'])

    const p1 = catalogClient.add(new RemoteCatalog('fr', ':3007/fr.account.json', ['account']), true).then(() => {
        expect(catalogClient.messages).toStrictEqual({simple: 'catalog', foo: 'bar', welcome: 'Bienvenue', account: 'Mon compte'})
        expect(catalogClient.domains).toStrictEqual(['default', 'app', 'account'])
    })

    await denormalizer.denormalize(catalogClient , {catalogs: [{id: 'fr.app.remote', messages: {bye: 'Au revoir'}}], status: 'ready'})

    expect(catalogClient.messages).toStrictEqual({simple: 'catalog', foo: 'bar', welcome: 'Bienvenue', account: 'Mon compte'})

    const p2 = catalogClient.add(new RemoteCatalog('fr', ':3007/404', ['app'], 'fr.app.remote')).then(() => {
        expect(catalogClient.messages).toStrictEqual({simple: 'catalog', foo: 'bar', welcome: 'Bienvenue', account: 'Mon compte', bye: 'Au revoir'})
    })

    const p3 = catalogClient.add(new RemoteCatalog('fr', ':3007/404', ['app'], 'fr.app.remote.404'))
    expect(p3).rejects.toThrow(CatalogComponent.UnreachableRemoteError)

    return Promise.allSettled([p1, p2, p3])
})
