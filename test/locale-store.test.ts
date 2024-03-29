import { Denormalizer, Normalizer } from '@code-202/serializer'
import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { MultipleCatalog, SimpleCatalog, RemoteCatalog, LocaleStore, CatalogComponent } from '../src'

import app from './server'

let server: any
let localeStore: LocaleStore
beforeAll(() => {
    server = app.listen(3008)
    localeStore = new LocaleStore(['en', 'fr', 'de'])
})
afterAll(() => {
    server.close()
})

test('simple add', () => {
    expect.assertions(6)

    expect(localeStore.status).toBe('waiting')
    expect(localeStore.domains).toStrictEqual([])
    expect(localeStore.messages).toStrictEqual({})

    const p = localeStore.add(new SimpleCatalog('fr', {welcome: 'Bienvenue'})).then(() => {
        expect(localeStore.status).toBe('waiting')
        expect(localeStore.domains).toStrictEqual([])
        expect(localeStore.messages).toStrictEqual({})
    })

    return p
})

test('set locale fr', () => {
    expect.assertions(5)

    const p = localeStore.changeLocale('fr').then(() => {
        expect(localeStore.locale).toBe('fr')
        expect(localeStore.status).toBe('ready')
        expect(localeStore.domains).toStrictEqual(['default'])
        expect(localeStore.messages).toStrictEqual({welcome: 'Bienvenue'})
        expect(localeStore.intl.formatMessage({id: 'welcome'})).toBe('Bienvenue')
    })

    return p
})

test('set locale en', () => {
    expect.assertions(5)

    const p = localeStore.changeLocale('en').then(() => {
        expect(localeStore.locale).toBe('en')
        expect(localeStore.status).toBe('ready')
        expect(localeStore.domains).toStrictEqual([])
        expect(localeStore.messages).toStrictEqual({})
        expect(localeStore.intl.formatMessage({id: 'welcome'})).toBe('welcome')
    })

    return p
})

test('add bad catalogs', () => {
    expect.assertions(2)

    const p = expect(localeStore.add(new SimpleCatalog('it', {}))).rejects.toThrow(CatalogComponent.BadLocaleCatalogError)

    const p2 = expect(localeStore.add(new RemoteCatalog('fr', ':3008/404'))).rejects.toThrow(CatalogComponent.BadLocaleCatalogError)

    return Promise.allSettled([p, p2])
})

test('change to bad locale', () => {
    expect.assertions(1)

    return expect(localeStore.changeLocale('it')).rejects.toThrow(CatalogComponent.UnknownLocaleError)
})

test('change locale with bad catalog', async () => {
    expect.assertions(1)

    await localeStore.add(new RemoteCatalog('de', ':3008/404'))

    const p = localeStore.changeLocale('de').catch(() => {
        expect(localeStore.status).toBe('error')
    })

    return p
})

test('domains', async () => {
    expect.assertions(21)

    const store = new LocaleStore(['fr', 'en'])

    const cfd = new SimpleCatalog('fr', {})
    const cfa = new SimpleCatalog('fr', { 'app.title': 'title' }, ['app'])
    const cfh = new SimpleCatalog('fr', { 'help.title': 'help' }, ['help'])
    const cfa2 = new SimpleCatalog('fr', { 'app.sub': 'sub' }, ['app'], 'fr.app.2')
    const ced = new SimpleCatalog('en', {})
    const cea = new RemoteCatalog('en', ':3008/en.app.json', ['app'])
    const ceh = new SimpleCatalog('en', {}, ['help'])
    const cet = new SimpleCatalog('en', {}, ['tools'])

    await store.add(cfd)
    await store.add(cfa)
    await store.add(cfh)
    await store.add(cfa2)
    await store.add(ced)
    await store.add(cea)
    await store.add(ceh)
    await store.add(cet)

    expect(store.getCatalogsByDomain('default')).toStrictEqual([])
    await store.changeLocale('fr')
    expect(store.getCatalogsByDomain('default')).toStrictEqual([cfd])
    expect(store.getCatalogsByDomain('app')).toStrictEqual([cfa, cfa2])
    expect(store.getCatalogsByDomain('help')).toStrictEqual([cfh])
    expect(store.messages).toStrictEqual({'app.title': 'title', 'app.sub': 'sub', 'help.title': 'help'})

    await store.add(new SimpleCatalog('fr', { 'security.title': 'warning' }, ['security']))
    expect(store.messages).toStrictEqual({'app.title': 'title', 'app.sub': 'sub', 'help.title': 'help', 'security.title': 'warning'})

    expect(store.hasDomain('default')).toBe(true)
    expect(store.hasDomain('app')).toBe(true)
    expect(store.hasDomain('help')).toBe(true)
    expect(store.hasDomain('tools')).toBe(false)
    expect(store.hasDomain('security')).toBe(true)

    expect(store.activeDomains).toStrictEqual(['default', 'app', 'help', 'security'])

    await store.changeLocale('en')
    expect(store.getCatalogsByDomain('default')).toStrictEqual([ced])
    expect(store.getCatalogsByDomain('app')).toStrictEqual([cea])
    expect(store.getCatalogsByDomain('help')).toStrictEqual([ceh])

    expect(store.hasDomain('tools')).toBe(true)

    const p = store.add(new RemoteCatalog('en', ':3008/en.app.json', ['foo'])).then(() => {
        expect(store.activeDomains).toStrictEqual(['default', 'app', 'help', 'tools', 'foo'])
        expect(store.hasActiveDomain('foo')).toBe(true)
        expect(store.messages).toStrictEqual({'welcome': 'Welcome'})
    })

    expect(store.activeDomains).toStrictEqual(['default', 'app', 'help', 'tools'])
    expect(store.hasActiveDomain('foo')).toBe(false)

    return p
})

test('normalize', async () => {
    expect.assertions(3)

    const normalizer = new Normalizer();

    const store = new LocaleStore(['fr', 'en'])

    const cfd = new SimpleCatalog('fr', {cfd: 'dfc'})
    const cfa = new SimpleCatalog('fr', {cfa: 'afc'}, ['app'])
    const cfh = new RemoteCatalog('fr', ':3008/404', ['app'], 'fr.app.2')
    const ced = new SimpleCatalog('en', {ced: 'dec'})
    const cea = new RemoteCatalog('en', ':3008/en.app.json', ['app'])
    const ceh = new SimpleCatalog('en', {ceh: 'hec'}, ['help'])
    const cet = new SimpleCatalog('en', {cet: 'tec'}, ['tools'])

    await store.add(cfd)
    await store.add(cfa)
    await store.add(cfh)
    await store.add(ced)
    await store.add(cea)
    await store.add(ceh)
    await store.add(cet)

    expect(normalizer.normalize(store)).toStrictEqual({
        status: 'waiting',
        locale: '',
        messages: {},
        catalogs: {
            fr: {
                id: 'multi.fr',
                catalogs: [{id: 'fr.default'}, {id: 'fr.app'}, {id: 'fr.app.2'}],
                status: 'waiting',
            },
            en: {
                id: 'multi.en',
                catalogs: [{id: 'en.default'}, {id: 'en.app'}, {id: 'en.help'}, {id: 'en.tools'}],
                status: 'waiting',
            },
        },
    })

    await store.changeLocale('en')

    expect(normalizer.normalize(store)).toStrictEqual({
        status: 'ready',
        locale: 'en',
        messages: {
            ced: 'dec',
            ceh: 'hec',
            cet: 'tec',
            welcome: 'Welcome',
        },
        catalogs: {
            fr: {
                id: 'multi.fr',
                catalogs: [{id: 'fr.default'}, {id: 'fr.app'}, {id: 'fr.app.2'}],
                status: 'waiting',
            },
            en: {
                id: 'multi.en',
                catalogs: [{id: 'en.default'}, {id: 'en.app', domains: ['app'], messages: {
                    welcome: 'Welcome',
                }}, {id: 'en.help'}, {id: 'en.tools'}],
                status: 'ready',
            },
        },
    })

    await store.changeLocale('fr').catch(() => {})

    expect(normalizer.normalize(store)).toStrictEqual({
        status: 'error',
        locale: 'en',
        messages: {
            ced: 'dec',
            ceh: 'hec',
            cet: 'tec',
            welcome: 'Welcome',
        },
        catalogs: {
            fr: {
                id: 'multi.fr',
                catalogs: [{id: 'fr.default'}, {id: 'fr.app'}, {id: 'fr.app.2'}],
                status: 'error',
            },
            en: {
                id: 'multi.en',
                catalogs: [{id: 'en.default'}, {id: 'en.app', domains: ['app'], messages: {
                    welcome: 'Welcome',
                }}, {id: 'en.help'}, {id: 'en.tools'}],
                status: 'ready',
            },
        },
    })
})

test('denormalize', async () => {
    expect.assertions(6)

    const denormalizer = new Denormalizer();

    const store = new LocaleStore(['fr', 'en'])

    const cfd = new SimpleCatalog('fr', {cfd: 'dfc'})
    const cfa = new SimpleCatalog('fr', {cfa: 'afc'}, ['app'])
    const cfh = new RemoteCatalog('fr', ':3008/404', ['app'], 'fr.app.2')
    const ced = new SimpleCatalog('en', {ced: 'dec'})
    const cea = new RemoteCatalog('en', ':3008/en.app.json', ['app'])
    const ceh = new SimpleCatalog('en', {ceh: 'hec'}, ['help'])
    const cet = new SimpleCatalog('en', {cet: 'tec'}, ['tools'])

    await store.add(cfd)
    await store.add(cfa)
    await store.add(cfh)
    await store.add(ced)
    await store.add(cea)
    await store.add(ceh)
    await store.add(cet)

    expect(store.locale).toBe('')
    expect(store.status).toBe('waiting')
    expect(store.messages).toStrictEqual({})
    denormalizer.denormalize(store, {
        status: 'error',
        locale: 'en',
        messages: {
            ced: 'dec',
            ceh: 'hec',
            cet: 'tec',
            welcome: 'Welcome',
        },
        catalogs: {
            fr: {
                id: 'multi.fr',
                catalogs: [{id: 'fr.default'}, {id: 'fr.app'}, {id: 'fr.app.2'}],
                status: 'error',
            },
            en: {
                id: 'multi.en',
                catalogs: [{id: 'en.default'}, {id: 'en.app', domains: ['app'], messages: {
                    welcome: 'Welcome',
                }}, {id: 'en.help'}, {id: 'en.tools'}],
                status: 'ready',
            },
        },
    })
    expect(store.locale).toBe('en')
    expect(store.status).toBe('error')
    expect(store.messages).toStrictEqual({
        ced: 'dec',
        ceh: 'hec',
        cet: 'tec',
        welcome: 'Welcome',
    })
})

test('ssr', async () => {
    expect.assertions(6)

    const normalizer = new Normalizer();
    const denormalizer = new Denormalizer();

    const storeServer = new LocaleStore(['fr'])

    await storeServer.add(new SimpleCatalog('fr', {cf1: '1fc'}))
    await storeServer.add(new RemoteCatalog('fr', ':3008/fr.json', undefined, 'fr.default.remote'))
    await storeServer.add(new RemoteCatalog('fr', ':3008/fr.app.json', ['app']))
    await storeServer.changeLocale('fr')
    await storeServer.add(new RemoteCatalog('fr', ':3008/fr.account.json', ['account']))

    const normalized = await normalizer.normalize(storeServer)

    const storeClient = new LocaleStore(['fr'])

    await storeClient.add(new SimpleCatalog('fr', {cf1: '1fc'}))
    await storeClient.add(new RemoteCatalog('fr', ':3008/fr.json', undefined, 'fr.default.remote'))
    await storeClient.add(new RemoteCatalog('fr', ':3008/fr.app.json', ['app']))
    await storeClient.changeLocale('fr')

    await denormalizer.denormalize(storeClient, normalized)

    expect(storeClient.hasDomain('default')).toBe(true)
    expect(storeClient.hasDomain('app')).toBe(true)
    expect(storeClient.hasDomain('help')).toBe(false)
    expect(storeClient.hasDomain('account')).toBe(true)

    const p = storeClient.add(new RemoteCatalog('fr', ':3008/fr.account.json', ['account']), true).then(() => {
        expect(storeClient.hasActiveDomain('account')).toBe(true)
        expect(storeClient.messages).toStrictEqual({
            cf1: '1fc',
            foo: 'bar',
            welcome: 'Bienvenue',
            account: 'Mon compte',
        })
    })

    return p
})
