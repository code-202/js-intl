import * as React from 'react'
import { IntlProvider } from 'react-intl'
import { inject, observer } from 'mobx-react'
import CatalogAwaiter from './catalog-awaiter'
import { LocaleStore } from './locale-store'
import { Manager } from 'react-mobx-loader'

interface Props extends React.PropsWithChildren {
    locale?: LocaleStore
    domain?: string
}

interface State {}

export class MobxIntlProvider extends React.Component<Props, State> {

    render () {

        let { domain } = this.props

        if (!domain) {
            domain = 'default'
        }

        return (
            <IntlProvider
                locale={this.props.locale && this.props.locale.locale ? this.props.locale.locale : 'en'}
                messages={this.props.locale && this.props.locale.messages ? this.props.locale.messages : {}}
                onError={ Manager.Manager.contentStrategy === 'show' ? () => {/* DO nothing */} : undefined}
            >
                <CatalogAwaiter domain={domain} >
                    { this.props.children }
                </CatalogAwaiter>
            </IntlProvider>
        )
    }
}

export default inject('locale')(observer(MobxIntlProvider))
