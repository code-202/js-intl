# react-mobx-intl
Adaptation of react-intl with dynamic translations resources

## Store injection
Launcher and Dialog components use the @code-202/kernel to get the store service with code 'intl-locale'
Add it in your container like this
```
    const localeStore: LocaleStore = new LocaleStore(['fr'])

    localeStore.addCatalog(new RemoteCatalog('fr', kernel.manifest.get('translations/app.fr.json', true), ['app']))

    kernel.container.onInit(() => {
        localeStore.changeLocale('fr').catch((err) => console.error(err))
    })

    kernel.container.add('intl.locale', localeStore)

```
