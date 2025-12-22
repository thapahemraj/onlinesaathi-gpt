'use strict';

var require$$0 = require('buffer');

const isArrayBuffer = (arg) => (typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer) ||
    Object.prototype.toString.call(arg) === "[object ArrayBuffer]";

const fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
    if (!isArrayBuffer(input)) {
        throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
    }
    return require$$0.Buffer.from(input, offset, length);
};
const fromString = (input, encoding) => {
    if (typeof input !== "string") {
        throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
    }
    return encoding ? require$$0.Buffer.from(input, encoding) : require$$0.Buffer.from(input);
};

const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
const fromBase64 = (input) => {
    if ((input.length * 3) % 4 !== 0) {
        throw new TypeError(`Incorrect padding on base64 string.`);
    }
    if (!BASE64_REGEX.exec(input)) {
        throw new TypeError(`Invalid base64 string.`);
    }
    const buffer = fromString(input, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};

const fromUtf8 = (input) => {
    const buf = fromString(input, "utf8");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};

const toUtf8 = (input) => {
    if (typeof input === "string") {
        return input;
    }
    if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
        throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
    }
    return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};

const toBase64 = (_input) => {
    let input;
    if (typeof _input === "string") {
        input = fromUtf8(_input);
    }
    else {
        input = _input;
    }
    if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
        throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
    }
    return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};

const expectNumber = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        const parsed = parseFloat(value);
        if (!Number.isNaN(parsed)) {
            if (String(parsed) !== String(value)) {
                logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
            }
            return parsed;
        }
    }
    if (typeof value === "number") {
        return value;
    }
    throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
const MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
const expectFloat32 = (value) => {
    const expected = expectNumber(value);
    if (expected !== undefined && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
        if (Math.abs(expected) > MAX_FLOAT) {
            throw new TypeError(`Expected 32-bit float, got ${value}`);
        }
    }
    return expected;
};
const expectLong = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (Number.isInteger(value) && !Number.isNaN(value)) {
        return value;
    }
    throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
const expectInt32 = (value) => expectSizedInt(value, 32);
const expectShort = (value) => expectSizedInt(value, 16);
const expectByte = (value) => expectSizedInt(value, 8);
const expectSizedInt = (value, size) => {
    const expected = expectLong(value);
    if (expected !== undefined && castInt(expected, size) !== expected) {
        throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
    }
    return expected;
};
const castInt = (value, size) => {
    switch (size) {
        case 32:
            return Int32Array.of(value)[0];
        case 16:
            return Int16Array.of(value)[0];
        case 8:
            return Int8Array.of(value)[0];
    }
};
const expectNonNull = (value, location) => {
    if (value === null || value === undefined) {
        if (location) {
            throw new TypeError(`Expected a non-null value for ${location}`);
        }
        throw new TypeError("Expected a non-null value");
    }
    return value;
};
const expectObject = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    const receivedType = Array.isArray(value) ? "array" : typeof value;
    throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
};
const expectString = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        return value;
    }
    if (["boolean", "number", "bigint"].includes(typeof value)) {
        logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
        return String(value);
    }
    throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};
const strictParseFloat32 = (value) => {
    if (typeof value == "string") {
        return expectFloat32(parseNumber(value));
    }
    return expectFloat32(value);
};
const NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
const parseNumber = (value) => {
    const matches = value.match(NUMBER_REGEX);
    if (matches === null || matches[0].length !== value.length) {
        throw new TypeError(`Expected real number, got implicit NaN`);
    }
    return parseFloat(value);
};
const strictParseInt32 = (value) => {
    if (typeof value === "string") {
        return expectInt32(parseNumber(value));
    }
    return expectInt32(value);
};
const strictParseShort = (value) => {
    if (typeof value === "string") {
        return expectShort(parseNumber(value));
    }
    return expectShort(value);
};
const strictParseByte = (value) => {
    if (typeof value === "string") {
        return expectByte(parseNumber(value));
    }
    return expectByte(value);
};
const stackTraceWarning = (message) => {
    return String(new TypeError(message).stack || message)
        .split("\n")
        .slice(0, 5)
        .filter((s) => !s.includes("stackTraceWarning"))
        .join("\n");
};
const logger = {
    warn: console.warn,
};

exports.expectInt32 = expectInt32;
exports.expectNonNull = expectNonNull;
exports.expectObject = expectObject;
exports.expectString = expectString;
exports.fromArrayBuffer = fromArrayBuffer;
exports.fromBase64 = fromBase64;
exports.fromString = fromString;
exports.fromUtf8 = fromUtf8;
exports.strictParseByte = strictParseByte;
exports.strictParseFloat32 = strictParseFloat32;
exports.strictParseInt32 = strictParseInt32;
exports.strictParseShort = strictParseShort;
exports.toBase64 = toBase64;
exports.toUtf8 = toUtf8;
//# sourceMappingURL=parse-utils-0uSYSO5c.js.map
