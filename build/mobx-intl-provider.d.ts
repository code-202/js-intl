import * as React from 'react';
import { LocaleStore } from './locale-store';
interface Props extends React.PropsWithChildren {
    locale?: LocaleStore;
    domain?: string;
}
interface State {
}
export declare class MobxIntlProvider extends React.Component<Props, State> {
    render(): JSX.Element;
}
declare const _default: typeof MobxIntlProvider & import("mobx-react").IWrappedComponent<Props>;
export default _default;
