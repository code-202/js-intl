"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnreachableRemoteError = exports.UnknownLocaleError = exports.DenormalizeError = exports.BadLocaleCatalogError = exports.BadDenormalizationError = exports.AlreadyUsedCatalogError = exports.IntlError = void 0;
class IntlError extends Error {
}
exports.IntlError = IntlError;
class AlreadyUsedCatalogError extends IntlError {
}
exports.AlreadyUsedCatalogError = AlreadyUsedCatalogError;
class BadDenormalizationError extends IntlError {
}
exports.BadDenormalizationError = BadDenormalizationError;
class BadLocaleCatalogError extends IntlError {
}
exports.BadLocaleCatalogError = BadLocaleCatalogError;
class DenormalizeError extends IntlError {
}
exports.DenormalizeError = DenormalizeError;
class UnknownLocaleError extends IntlError {
}
exports.UnknownLocaleError = UnknownLocaleError;
class UnreachableRemoteError extends IntlError {
}
exports.UnreachableRemoteError = UnreachableRemoteError;
