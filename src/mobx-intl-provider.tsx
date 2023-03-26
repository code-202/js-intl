import * as React from 'react'
import { IntlProvider } from 'react-intl'
import { observer } from 'mobx-react'
import { getKernel } from '@code-202/kernel'
import { Manager } from '@code-202/loader'
import CatalogAwaiter from './catalog-awaiter'
import { LocaleStore } from './locale-store'

interface Props extends React.PropsWithChildren {
    domain?: string
}

interface State {}

export class MobxIntlProvider extends React.Component<Props, State> {

    private locale: LocaleStore

    constructor(props: Props) {
        super(props)

        this.locale = getKernel().container.get('intl.locale') as LocaleStore
    }

    render () {

        let { domain } = this.props

        if (!domain) {
            domain = 'default'
        }

        return (
            <IntlProvider
                locale={this.locale.locale ? this.locale.locale : 'en'}
                messages={this.locale && this.locale.messages ? this.locale.messages : {}}
                onError={ Manager.Manager.contentStrategy === 'show' ? () => {/* Do nothing */} : undefined}
            >
                <CatalogAwaiter domain={domain} >
                    { this.props.children }
                </CatalogAwaiter>
            </IntlProvider>
        )
    }
}

export default observer(MobxIntlProvider)
