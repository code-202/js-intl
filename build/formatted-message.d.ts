import * as React from "react";
import { MessageDescriptor } from '@formatjs/intl';
import { FormatXMLElementFn } from 'intl-messageformat';
import { PrimitiveType } from 'intl-messageformat';
export interface Props extends MessageDescriptor {
    values?: Record<string, PrimitiveType | FormatXMLElementFn<React.ReactNode> | React.ReactNode>;
}
declare class FormattedMessage extends React.PureComponent<Props> {
    private locale;
    constructor(props: Props);
    render(): string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined)[] | null | undefined;
}
declare const _default: typeof FormattedMessage;
export default _default;
