import * as React from 'react'
import { observer } from 'mobx-react'
import { getKernel } from '@code-202/kernel'
import { Manager } from '@code-202/loader'
import { LocaleStore } from './locale-store'

interface Props extends React.PropsWithChildren {
    domain: string | string[]
    fallback?: React.ComponentType<any>
}

interface State {}

export class CatalogAwaiter extends React.Component<Props, State> {

    private locale: LocaleStore

    constructor(props: Props) {
        super(props)

        this.locale = getKernel().container.get('intl.locale') as LocaleStore
    }

    render () {
        if (Manager.Manager.contentStrategy === 'wait') {
            const domains = typeof this.props.domain === 'string' ? [this.props.domain] : this.props.domain

            for (const domain of domains) {
                if (!this.locale.hasActiveDomain(domain)) {
                    return this.fallback
                }
            }
        }

        return (
            <>
                { this.props.children }
            </>
        )
    }

    get fallback () {
        if (this.props.fallback) {
            return React.createElement(this.props.fallback)
        }

        return null
    }
}

export default observer(CatalogAwaiter)
