import * as React from 'react';
interface Props extends React.PropsWithChildren {
    domain: string | string[];
    fallback?: React.ComponentType<any>;
}
interface State {
}
export declare class CatalogAwaiter extends React.Component<Props, State> {
    private locale;
    constructor(props: Props);
    render(): JSX.Element | null;
    get fallback(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
}
declare const _default: typeof CatalogAwaiter;
export default _default;
