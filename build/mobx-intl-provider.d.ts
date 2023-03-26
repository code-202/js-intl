import * as React from 'react';
interface Props extends React.PropsWithChildren {
    domain?: string;
}
interface State {
}
export declare class MobxIntlProvider extends React.Component<Props, State> {
    private locale;
    constructor(props: Props);
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
}
declare const _default: typeof MobxIntlProvider;
export default _default;
