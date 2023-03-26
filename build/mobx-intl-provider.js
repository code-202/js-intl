"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobxIntlProvider = void 0;
const React = __importStar(require("react"));
const react_intl_1 = require("react-intl");
const mobx_react_1 = require("mobx-react");
const kernel_1 = require("@code-202/kernel");
const loader_1 = require("@code-202/loader");
const catalog_awaiter_1 = __importDefault(require("./catalog-awaiter"));
class MobxIntlProvider extends React.Component {
    locale;
    constructor(props) {
        super(props);
        this.locale = (0, kernel_1.getKernel)().container.get('intl.locale');
    }
    render() {
        let { domain } = this.props;
        if (!domain) {
            domain = 'default';
        }
        return (React.createElement(react_intl_1.IntlProvider, { locale: this.locale.locale ? this.locale.locale : 'en', messages: this.locale && this.locale.messages ? this.locale.messages : {}, onError: loader_1.Manager.Manager.contentStrategy === 'show' ? () => { } : undefined },
            React.createElement(catalog_awaiter_1.default, { domain: domain }, this.props.children)));
    }
}
exports.MobxIntlProvider = MobxIntlProvider;
exports.default = (0, mobx_react_1.observer)(MobxIntlProvider);
