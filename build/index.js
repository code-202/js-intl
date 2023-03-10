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
exports.SimpleCatalog = exports.RemoteCatalog = exports.MultipleCatalog = exports.MobxIntlProvider = exports.LocaleStore = exports.CatalogComponent = exports.CatalogAwaiter = void 0;
const CatalogComponent = __importStar(require("./catalog"));
exports.CatalogComponent = CatalogComponent;
const catalog_awaiter_1 = __importDefault(require("./catalog-awaiter"));
exports.CatalogAwaiter = catalog_awaiter_1.default;
const locale_store_1 = require("./locale-store");
Object.defineProperty(exports, "LocaleStore", { enumerable: true, get: function () { return locale_store_1.LocaleStore; } });
const mobx_intl_provider_1 = __importDefault(require("./mobx-intl-provider"));
exports.MobxIntlProvider = mobx_intl_provider_1.default;
const multiple_catalog_1 = require("./multiple-catalog");
Object.defineProperty(exports, "MultipleCatalog", { enumerable: true, get: function () { return multiple_catalog_1.MultipleCatalog; } });
const remote_catalog_1 = require("./remote-catalog");
Object.defineProperty(exports, "RemoteCatalog", { enumerable: true, get: function () { return remote_catalog_1.RemoteCatalog; } });
const simple_catalog_1 = require("./simple-catalog");
Object.defineProperty(exports, "SimpleCatalog", { enumerable: true, get: function () { return simple_catalog_1.SimpleCatalog; } });
