import * as React from "react"
import { MessageDescriptor } from '@formatjs/intl'
import { FormatXMLElementFn} from 'intl-messageformat'
import { PrimitiveType } from 'intl-messageformat'
import { getKernel } from "@code-202/kernel"
import { observer } from "mobx-react"
import { LocaleStore } from "./locale-store"

export interface Props extends MessageDescriptor {
    values?: Record<string, PrimitiveType|FormatXMLElementFn<React.ReactNode>|React.ReactNode>
}

class FormattedMessage extends React.PureComponent<Props> {
    private locale: LocaleStore

    constructor(props: Props) {
        super(props)

        this.locale = getKernel().container.get('intl.locale') as LocaleStore
    }

    render () {
        const { values, ...descriptor } = this.props

        return this.locale.intl.formatMessage(descriptor, values)
    }
}

export default observer(FormattedMessage)
