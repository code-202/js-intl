import * as React from 'react';
import { LocaleStore } from './locale-store';
interface Props extends React.PropsWithChildren {
    locale?: LocaleStore;
    domain: string | string[];
    fallback?: React.ComponentType<any>;
}
interface State {
}
export declare class CatalogAwaiter extends React.Component<Props, State> {
    render(): JSX.Element | null;
    get fallback(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
}
declare const _default: typeof CatalogAwaiter & import("mobx-react").IWrappedComponent<Props>;
export default _default;
