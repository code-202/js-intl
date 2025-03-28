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
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const kernel_1 = require("@code-202/kernel");
const mobx_react_1 = require("mobx-react");
class FormattedMessage extends React.PureComponent {
    locale;
    constructor(props) {
        super(props);
        this.locale = (0, kernel_1.getKernel)().container.get('intl.locale');
    }
    render() {
        const { values, html, ...descriptor } = this.props;
        const text = this.locale.intl.formatMessage(descriptor, values);
        if (html && typeof text == 'string') {
            return React.createElement("div", { dangerouslySetInnerHTML: { __html: text } });
        }
        return text;
    }
}
exports.default = (0, mobx_react_1.observer)(FormattedMessage);
