import * as React from "react";
import { MessageDescriptor } from '@formatjs/intl';
import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat';
export interface Props extends MessageDescriptor {
    values?: Record<string, PrimitiveType | FormatXMLElementFn<React.ReactNode> | React.ReactNode>;
    html?: boolean;
}
declare class FormattedMessage extends React.PureComponent<Props> {
    private locale;
    constructor(props: Props);
    render(): string | number | boolean | React.ReactFragment | JSX.Element | null | undefined;
}
declare const _default: typeof FormattedMessage;
export default _default;
