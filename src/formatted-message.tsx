import * as React from "react"
import { MessageDescriptor } from '@formatjs/intl'
import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat'
import { getKernel } from "@code-202/kernel"
import { observer } from "mobx-react"
import { LocaleStore } from "./locale-store"

export interface Props extends MessageDescriptor {
    values?: Record<string, PrimitiveType | FormatXMLElementFn<React.ReactNode> | React.ReactNode>
    html?: boolean
}

class FormattedMessage extends React.PureComponent<Props> {
    private locale: LocaleStore

    constructor(props: Props) {
        super(props)

        this.locale = getKernel().container.get('intl.locale') as LocaleStore
    }

    render() {
        const { values, html, ...descriptor } = this.props

        const text = this.locale.intl.formatMessage(descriptor, values)

        if (html && typeof text == 'string') {
            return <div dangerouslySetInnerHTML={{ __html: text }} />
        }

        return text
    }
}

export default observer(FormattedMessage)
