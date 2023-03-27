import * as React from "react";
import { MessageDescriptor } from '@formatjs/intl';
import { PrimitiveType } from 'intl-messageformat';
export interface Props extends MessageDescriptor {
    values?: Record<string, PrimitiveType>;
}
declare class FormattedMessage extends React.PureComponent<Props> {
    private locale;
    constructor(props: Props);
    render(): string;
}
declare const _default: typeof FormattedMessage;
export default _default;
