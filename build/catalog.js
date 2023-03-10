"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownLocaleError = exports.BadLocaleCatalogError = exports.DenormalizeError = exports.IntlError = void 0;
class IntlError extends Error {
}
exports.IntlError = IntlError;
class DenormalizeError extends IntlError {
}
exports.DenormalizeError = DenormalizeError;
class BadLocaleCatalogError extends IntlError {
}
exports.BadLocaleCatalogError = BadLocaleCatalogError;
class UnknownLocaleError extends IntlError {
}
exports.UnknownLocaleError = UnknownLocaleError;
