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
exports.CatalogAwaiter = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const react_mobx_loader_1 = require("react-mobx-loader");
class CatalogAwaiter extends React.Component {
    render() {
        if (react_mobx_loader_1.Manager.Manager.contentStrategy === 'wait') {
            if (!this.props.locale) {
                return this.fallback;
            }
            const domains = typeof this.props.domain === 'string' ? [this.props.domain] : this.props.domain;
            for (const domain of domains) {
                if (!this.props.locale.hasActiveDomain(domain)) {
                    return this.fallback;
                }
            }
        }
        return (React.createElement(React.Fragment, null, this.props.children));
    }
    get fallback() {
        if (this.props.fallback) {
            return React.createElement(this.props.fallback);
        }
        return null;
    }
}
exports.CatalogAwaiter = CatalogAwaiter;
exports.default = (0, mobx_react_1.inject)('locale')((0, mobx_react_1.observer)(CatalogAwaiter));
