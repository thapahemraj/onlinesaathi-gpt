'use strict';

var index = require('./index-C3lhZBZO.js');
require('@librechat/data-schemas');
require('librechat-data-provider');
require('axios');
require('path');
require('node:crypto');
require('fs');
require('fs/promises');
require('node-fetch');
require('@librechat/agents');
require('tiktoken');
require('js-yaml');
require('zod');
require('@azure/identity');
require('firebase/app');
require('firebase/storage');
require('@aws-sdk/client-s3');
require('keyv');
require('ioredis');
require('@keyv/redis');
require('keyv-file');
require('mongoose');
require('events');
require('mongodb');
require('memorystore');
require('rate-limit-redis');
require('express-session');
require('connect-redis');
require('crypto');
require('@modelcontextprotocol/sdk/shared/auth.js');
require('@modelcontextprotocol/sdk/client/auth.js');
require('undici');
require('@modelcontextprotocol/sdk/client/stdio.js');
require('@modelcontextprotocol/sdk/client/index.js');
require('@modelcontextprotocol/sdk/client/sse.js');
require('@modelcontextprotocol/sdk/client/websocket.js');
require('@modelcontextprotocol/sdk/types.js');
require('@modelcontextprotocol/sdk/client/streamableHttp.js');
require('jsonwebtoken');
require('@langchain/core/prompts');
require('@langchain/core/messages');
require('buffer');
require('stream');
require('util');
require('form-data');
require('net');
require('tls');
require('url');
require('assert');
require('tty');
require('os');
require('http2');
require('process');
require('node:fs');
require('async_hooks');
require('http');
require('https');
require('@langchain/core/tools');

const deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
    const { response } = await next(args);
    try {
        const parsed = await deserializer(response, options);
        return {
            response,
            output: parsed,
        };
    }
    catch (error) {
        Object.defineProperty(error, "$response", {
            value: response,
        });
        if (!("$metadata" in error)) {
            const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
            try {
                error.message += "\n  " + hint;
            }
            catch (e) {
                if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") {
                    console.warn(hint);
                }
                else {
                    context.logger?.warn?.(hint);
                }
            }
            if (typeof error.$responseBodyText !== "undefined") {
                if (error.$response) {
                    error.$response.body = error.$responseBodyText;
                }
            }
            try {
                if (index.HttpResponse.isInstance(response)) {
                    const { headers = {} } = response;
                    const headerEntries = Object.entries(headers);
                    error.$metadata = {
                        httpStatusCode: response.statusCode,
                        requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
                        extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
                        cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries),
                    };
                }
            }
            catch (e) {
            }
        }
        throw error;
    }
};
const findHeader = (pattern, headers) => {
    return (headers.find(([k]) => {
        return k.match(pattern);
    }) || [void 0, void 0])[1];
};

const serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
    const endpointConfig = options;
    const endpoint = context.endpointV2?.url && endpointConfig.urlParser
        ? async () => endpointConfig.urlParser(context.endpointV2.url)
        : endpointConfig.endpoint;
    if (!endpoint) {
        throw new Error("No valid endpoint provider available.");
    }
    const request = await serializer(args.input, { ...options, endpoint });
    return next({
        ...args,
        request,
    });
};

const deserializerMiddlewareOption = {
    name: "deserializerMiddleware",
    step: "deserialize",
    tags: ["DESERIALIZER"],
    override: true,
};
const serializerMiddlewareOption = {
    name: "serializerMiddleware",
    step: "serialize",
    tags: ["SERIALIZER"],
    override: true,
};
function getSerdePlugin(config, serializer, deserializer) {
    return {
        applyToStack: (commandStack) => {
            commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
            commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
        },
    };
}

class Uint8ArrayBlobAdapter extends Uint8Array {
    static fromString(source, encoding = "utf-8") {
        if (typeof source === "string") {
            if (encoding === "base64") {
                return Uint8ArrayBlobAdapter.mutate(index.fromBase64(source));
            }
            return Uint8ArrayBlobAdapter.mutate(index.fromUtf8(source));
        }
        throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
    }
    static mutate(source) {
        Object.setPrototypeOf(source, Uint8ArrayBlobAdapter.prototype);
        return source;
    }
    transformToString(encoding = "utf-8") {
        if (encoding === "base64") {
            return index.toBase64(this);
        }
        return index.toUtf8(this);
    }
}

const collectBody = async (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Uint8ArrayBlobAdapter.mutate(streamBody);
    }
    if (!streamBody) {
        return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
    }
    const fromContext = context.streamCollector(streamBody);
    return Uint8ArrayBlobAdapter.mutate(await fromContext);
};

function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}

const deref = (schemaRef) => {
    if (typeof schemaRef === "function") {
        return schemaRef();
    }
    return schemaRef;
};

function translateTraits(indicator) {
    if (typeof indicator === "object") {
        return indicator;
    }
    indicator = indicator | 0;
    const traits = {};
    let i = 0;
    for (const trait of [
        "httpLabel",
        "idempotent",
        "idempotencyToken",
        "sensitive",
        "httpPayload",
        "httpResponseCode",
        "httpQueryParams",
    ]) {
        if (((indicator >> i++) & 1) === 1) {
            traits[trait] = 1;
        }
    }
    return traits;
}

class NormalizedSchema {
    ref;
    memberName;
    static symbol = Symbol.for("@smithy/nor");
    symbol = NormalizedSchema.symbol;
    name;
    schema;
    _isMemberSchema;
    traits;
    memberTraits;
    normalizedTraits;
    constructor(ref, memberName) {
        this.ref = ref;
        this.memberName = memberName;
        const traitStack = [];
        let _ref = ref;
        let schema = ref;
        this._isMemberSchema = false;
        while (isMemberSchema(_ref)) {
            traitStack.push(_ref[1]);
            _ref = _ref[0];
            schema = deref(_ref);
            this._isMemberSchema = true;
        }
        if (traitStack.length > 0) {
            this.memberTraits = {};
            for (let i = traitStack.length - 1; i >= 0; --i) {
                const traitSet = traitStack[i];
                Object.assign(this.memberTraits, translateTraits(traitSet));
            }
        }
        else {
            this.memberTraits = 0;
        }
        if (schema instanceof NormalizedSchema) {
            const computedMemberTraits = this.memberTraits;
            Object.assign(this, schema);
            this.memberTraits = Object.assign({}, computedMemberTraits, schema.getMemberTraits(), this.getMemberTraits());
            this.normalizedTraits = void 0;
            this.memberName = memberName ?? schema.memberName;
            return;
        }
        this.schema = deref(schema);
        if (isStaticSchema(this.schema)) {
            this.name = `${this.schema[1]}#${this.schema[2]}`;
            this.traits = this.schema[3];
        }
        else {
            this.name = this.memberName ?? String(schema);
            this.traits = 0;
        }
        if (this._isMemberSchema && !memberName) {
            throw new Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(true)} missing member name.`);
        }
    }
    static [Symbol.hasInstance](lhs) {
        const isPrototype = this.prototype.isPrototypeOf(lhs);
        if (!isPrototype && typeof lhs === "object" && lhs !== null) {
            const ns = lhs;
            return ns.symbol === this.symbol;
        }
        return isPrototype;
    }
    static of(ref) {
        const sc = deref(ref);
        if (sc instanceof NormalizedSchema) {
            return sc;
        }
        if (isMemberSchema(sc)) {
            const [ns, traits] = sc;
            if (ns instanceof NormalizedSchema) {
                Object.assign(ns.getMergedTraits(), translateTraits(traits));
                return ns;
            }
            throw new Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(ref, null, 2)}.`);
        }
        return new NormalizedSchema(sc);
    }
    getSchema() {
        const sc = this.schema;
        if (sc[0] === 0) {
            return sc[4];
        }
        return sc;
    }
    getName(withNamespace = false) {
        const { name } = this;
        const short = !withNamespace && name && name.includes("#");
        return short ? name.split("#")[1] : name || undefined;
    }
    getMemberName() {
        return this.memberName;
    }
    isMemberSchema() {
        return this._isMemberSchema;
    }
    isListSchema() {
        const sc = this.getSchema();
        return typeof sc === "number"
            ? sc >= 64 && sc < 128
            : sc[0] === 1;
    }
    isMapSchema() {
        const sc = this.getSchema();
        return typeof sc === "number"
            ? sc >= 128 && sc <= 0b1111_1111
            : sc[0] === 2;
    }
    isStructSchema() {
        const sc = this.getSchema();
        return (sc[0] === 3 ||
            sc[0] === -3);
    }
    isBlobSchema() {
        const sc = this.getSchema();
        return sc === 21 || sc === 42;
    }
    isTimestampSchema() {
        const sc = this.getSchema();
        return (typeof sc === "number" &&
            sc >= 4 &&
            sc <= 7);
    }
    isUnitSchema() {
        return this.getSchema() === "unit";
    }
    isDocumentSchema() {
        return this.getSchema() === 15;
    }
    isStringSchema() {
        return this.getSchema() === 0;
    }
    isBooleanSchema() {
        return this.getSchema() === 2;
    }
    isNumericSchema() {
        return this.getSchema() === 1;
    }
    isBigIntegerSchema() {
        return this.getSchema() === 17;
    }
    isBigDecimalSchema() {
        return this.getSchema() === 19;
    }
    isStreaming() {
        const { streaming } = this.getMergedTraits();
        return !!streaming || this.getSchema() === 42;
    }
    isIdempotencyToken() {
        const match = (traits) => (traits & 0b0100) === 0b0100 ||
            !!traits?.idempotencyToken;
        const { normalizedTraits, traits, memberTraits } = this;
        return match(normalizedTraits) || match(traits) || match(memberTraits);
    }
    getMergedTraits() {
        return (this.normalizedTraits ??
            (this.normalizedTraits = {
                ...this.getOwnTraits(),
                ...this.getMemberTraits(),
            }));
    }
    getMemberTraits() {
        return translateTraits(this.memberTraits);
    }
    getOwnTraits() {
        return translateTraits(this.traits);
    }
    getKeySchema() {
        const [isDoc, isMap] = [this.isDocumentSchema(), this.isMapSchema()];
        if (!isDoc && !isMap) {
            throw new Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(true)}`);
        }
        const schema = this.getSchema();
        const memberSchema = isDoc
            ? 15
            : schema[4] ?? 0;
        return member([memberSchema, 0], "key");
    }
    getValueSchema() {
        const sc = this.getSchema();
        const [isDoc, isMap, isList] = [this.isDocumentSchema(), this.isMapSchema(), this.isListSchema()];
        const memberSchema = typeof sc === "number"
            ? 0b0011_1111 & sc
            : sc && typeof sc === "object" && (isMap || isList)
                ? sc[3 + sc[0]]
                : isDoc
                    ? 15
                    : void 0;
        if (memberSchema != null) {
            return member([memberSchema, 0], isMap ? "value" : "member");
        }
        throw new Error(`@smithy/core/schema - ${this.getName(true)} has no value member.`);
    }
    getMemberSchema(memberName) {
        const struct = this.getSchema();
        if (this.isStructSchema() && struct[4].includes(memberName)) {
            const i = struct[4].indexOf(memberName);
            const memberSchema = struct[5][i];
            return member(isMemberSchema(memberSchema) ? memberSchema : [memberSchema, 0], memberName);
        }
        if (this.isDocumentSchema()) {
            return member([15, 0], memberName);
        }
        throw new Error(`@smithy/core/schema - ${this.getName(true)} has no no member=${memberName}.`);
    }
    getMemberSchemas() {
        const buffer = {};
        try {
            for (const [k, v] of this.structIterator()) {
                buffer[k] = v;
            }
        }
        catch (ignored) { }
        return buffer;
    }
    getEventStreamMember() {
        if (this.isStructSchema()) {
            for (const [memberName, memberSchema] of this.structIterator()) {
                if (memberSchema.isStreaming() && memberSchema.isStructSchema()) {
                    return memberName;
                }
            }
        }
        return "";
    }
    *structIterator() {
        if (this.isUnitSchema()) {
            return;
        }
        if (!this.isStructSchema()) {
            throw new Error("@smithy/core/schema - cannot iterate non-struct schema.");
        }
        const struct = this.getSchema();
        for (let i = 0; i < struct[4].length; ++i) {
            yield [struct[4][i], member([struct[5][i], 0], struct[4][i])];
        }
    }
}
function member(memberSchema, memberName) {
    if (memberSchema instanceof NormalizedSchema) {
        return Object.assign(memberSchema, {
            memberName,
            _isMemberSchema: true,
        });
    }
    const internalCtorAccess = NormalizedSchema;
    return new internalCtorAccess(memberSchema, memberName);
}
const isMemberSchema = (sc) => Array.isArray(sc) && sc.length === 2;
const isStaticSchema = (sc) => Array.isArray(sc) && sc.length >= 5;

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
        {
            throw new TypeError(`Expected a non-null value for ${location}`);
        }
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

const resolvedPath = (resolvedPath, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
    if (input != null && input[memberName] !== undefined) {
        const labelValue = labelValueProvider();
        if (labelValue.length <= 0) {
            throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
        }
        resolvedPath = resolvedPath.replace(uriLabel, isGreedyLabel
            ? labelValue
                .split("/")
                .map((segment) => extendedEncodeURIComponent(segment))
                .join("/")
            : extendedEncodeURIComponent(labelValue));
    }
    else {
        throw new Error("No value provided for input HTTP label: " + memberName + ".");
    }
    return resolvedPath;
};

function requestBuilder(input, context) {
    return new RequestBuilder(input, context);
}
class RequestBuilder {
    input;
    context;
    query = {};
    method = "";
    headers = {};
    path = "";
    body = null;
    hostname = "";
    resolvePathStack = [];
    constructor(input, context) {
        this.input = input;
        this.context = context;
    }
    async build() {
        const { hostname, protocol = "https", port, path: basePath } = await this.context.endpoint();
        this.path = basePath;
        for (const resolvePath of this.resolvePathStack) {
            resolvePath(this.path);
        }
        return new index.HttpRequest({
            protocol,
            hostname: this.hostname || hostname,
            port,
            method: this.method,
            path: this.path,
            query: this.query,
            body: this.body,
            headers: this.headers,
        });
    }
    hn(hostname) {
        this.hostname = hostname;
        return this;
    }
    bp(uriLabel) {
        this.resolvePathStack.push((basePath) => {
            this.path = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + uriLabel;
        });
        return this;
    }
    p(memberName, labelValueProvider, uriLabel, isGreedyLabel) {
        this.resolvePathStack.push((path) => {
            this.path = resolvedPath(path, this.input, memberName, labelValueProvider, uriLabel, isGreedyLabel);
        });
        return this;
    }
    h(headers) {
        this.headers = headers;
        return this;
    }
    q(query) {
        this.query = query;
        return this;
    }
    b(body) {
        this.body = body;
        return this;
    }
    m(method) {
        this.method = method;
        return this;
    }
}

function setFeature(context, feature, value) {
    if (!context.__smithy_context) {
        context.__smithy_context = {
            features: {},
        };
    }
    else if (!context.__smithy_context.features) {
        context.__smithy_context.features = {};
    }
    context.__smithy_context.features[feature] = value;
}

class NoAuthSigner {
    async sign(httpRequest, identity, signingProperties) {
        return httpRequest;
    }
}

const SENSITIVE_STRING$1 = "***SensitiveInformation***";
function schemaLogFilter(schema, data) {
    if (data == null) {
        return data;
    }
    const ns = NormalizedSchema.of(schema);
    if (ns.getMergedTraits().sensitive) {
        return SENSITIVE_STRING$1;
    }
    if (ns.isListSchema()) {
        const isSensitive = !!ns.getValueSchema().getMergedTraits().sensitive;
        if (isSensitive) {
            return SENSITIVE_STRING$1;
        }
    }
    else if (ns.isMapSchema()) {
        const isSensitive = !!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive;
        if (isSensitive) {
            return SENSITIVE_STRING$1;
        }
    }
    else if (ns.isStructSchema() && typeof data === "object") {
        const object = data;
        const newObject = {};
        for (const [member, memberNs] of ns.structIterator()) {
            if (object[member] != null) {
                newObject[member] = schemaLogFilter(memberNs, object[member]);
            }
        }
        return newObject;
    }
    return data;
}

class Command {
    middlewareStack = index.constructStack();
    schema;
    static classBuilder() {
        return new ClassBuilder();
    }
    resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor, }) {
        for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) {
            this.middlewareStack.use(mw);
        }
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog,
            outputFilterSensitiveLog,
            [index.SMITHY_CONTEXT_KEY]: {
                commandInstance: this,
                ...smithyContext,
            },
            ...additionalContext,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
}
class ClassBuilder {
    _init = () => { };
    _ep = {};
    _middlewareFn = () => [];
    _commandName = "";
    _clientName = "";
    _additionalContext = {};
    _smithyContext = {};
    _inputFilterSensitiveLog = undefined;
    _outputFilterSensitiveLog = undefined;
    _serializer = null;
    _deserializer = null;
    _operationSchema;
    init(cb) {
        this._init = cb;
    }
    ep(endpointParameterInstructions) {
        this._ep = endpointParameterInstructions;
        return this;
    }
    m(middlewareSupplier) {
        this._middlewareFn = middlewareSupplier;
        return this;
    }
    s(service, operation, smithyContext = {}) {
        this._smithyContext = {
            service,
            operation,
            ...smithyContext,
        };
        return this;
    }
    c(additionalContext = {}) {
        this._additionalContext = additionalContext;
        return this;
    }
    n(clientName, commandName) {
        this._clientName = clientName;
        this._commandName = commandName;
        return this;
    }
    f(inputFilter = (_) => _, outputFilter = (_) => _) {
        this._inputFilterSensitiveLog = inputFilter;
        this._outputFilterSensitiveLog = outputFilter;
        return this;
    }
    ser(serializer) {
        this._serializer = serializer;
        return this;
    }
    de(deserializer) {
        this._deserializer = deserializer;
        return this;
    }
    sc(operation) {
        this._operationSchema = operation;
        this._smithyContext.operationSchema = operation;
        return this;
    }
    build() {
        const closure = this;
        let CommandRef;
        return (CommandRef = class extends Command {
            input;
            static getEndpointParameterInstructions() {
                return closure._ep;
            }
            constructor(...[input]) {
                super();
                this.input = input ?? {};
                closure._init(this);
                this.schema = closure._operationSchema;
            }
            resolveMiddleware(stack, configuration, options) {
                const op = closure._operationSchema;
                const input = op?.[4] ?? op?.input;
                const output = op?.[5] ?? op?.output;
                return this.resolveMiddlewareWithContext(stack, configuration, options, {
                    CommandCtor: CommandRef,
                    middlewareFn: closure._middlewareFn,
                    clientName: closure._clientName,
                    commandName: closure._commandName,
                    inputFilterSensitiveLog: closure._inputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, input) : (_) => _),
                    outputFilterSensitiveLog: closure._outputFilterSensitiveLog ?? (op ? schemaLogFilter.bind(null, output) : (_) => _),
                    smithyContext: closure._smithyContext,
                    additionalContext: closure._additionalContext,
                });
            }
            serialize = closure._serializer;
            deserialize = closure._deserializer;
        });
    }
}

const SENSITIVE_STRING = "***SensitiveInformation***";

class ServiceException extends Error {
    $fault;
    $response;
    $retryable;
    $metadata;
    constructor(options) {
        super(options.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype);
        this.name = options.name;
        this.$fault = options.$fault;
        this.$metadata = options.$metadata;
    }
    static isInstance(value) {
        if (!value)
            return false;
        const candidate = value;
        return (ServiceException.prototype.isPrototypeOf(candidate) ||
            (Boolean(candidate.$fault) &&
                Boolean(candidate.$metadata) &&
                (candidate.$fault === "client" || candidate.$fault === "server")));
    }
    static [Symbol.hasInstance](instance) {
        if (!instance)
            return false;
        const candidate = instance;
        if (this === ServiceException) {
            return ServiceException.isInstance(instance);
        }
        if (ServiceException.isInstance(instance)) {
            if (candidate.name && this.name) {
                return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
            }
            return this.prototype.isPrototypeOf(instance);
        }
        return false;
    }
}
const decorateServiceException = (exception, additions = {}) => {
    Object.entries(additions)
        .filter(([, v]) => v !== undefined)
        .forEach(([k, v]) => {
        if (exception[k] == undefined || exception[k] === "") {
            exception[k] = v;
        }
    });
    const message = exception.message || exception.Message || "UnknownError";
    exception.message = message;
    delete exception.Message;
    return exception;
};

const throwDefaultError$1 = ({ output, parsedBody, exceptionCtor, errorCode }) => {
    const $metadata = deserializeMetadata$1(output);
    const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : undefined;
    const response = new exceptionCtor({
        name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
        $fault: "client",
        $metadata,
    });
    throw decorateServiceException(response, parsedBody);
};
const withBaseException = (ExceptionCtor) => {
    return ({ output, parsedBody, errorCode }) => {
        throwDefaultError$1({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
    };
};
const deserializeMetadata$1 = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});

function map(arg0, arg1, arg2) {
    let target;
    let instructions;
    {
        target = {};
        instructions = arg0;
    }
    for (const key of Object.keys(instructions)) {
        if (!Array.isArray(instructions[key])) {
            target[key] = instructions[key];
            continue;
        }
        applyInstruction(target, null, instructions, key);
    }
    return target;
}
const take = (source, instructions) => {
    const out = {};
    for (const key in instructions) {
        applyInstruction(out, source, instructions, key);
    }
    return out;
};
const applyInstruction = (target, source, instructions, targetKey) => {
    if (source !== null) {
        let instruction = instructions[targetKey];
        if (typeof instruction === "function") {
            instruction = [, instruction];
        }
        const [filter = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
        if ((typeof filter === "function" && filter(source[sourceKey])) || (typeof filter !== "function" && !!filter)) {
            target[targetKey] = valueFn(source[sourceKey]);
        }
        return;
    }
    let [filter, value] = instructions[targetKey];
    if (typeof value === "function") {
        let _value;
        const defaultFilterPassed = filter === undefined && (_value = value()) != null;
        const customFilterPassed = (typeof filter === "function" && !!filter(void 0)) || (typeof filter !== "function" && !!filter);
        if (defaultFilterPassed) {
            target[targetKey] = _value;
        }
        else if (customFilterPassed) {
            target[targetKey] = value();
        }
    }
    else {
        const defaultFilterPassed = filter === undefined && value != null;
        const customFilterPassed = (typeof filter === "function" && !!filter(value)) || (typeof filter !== "function" && !!filter);
        if (defaultFilterPassed || customFilterPassed) {
            target[targetKey] = value;
        }
    }
};
const nonNullish = (_) => _ != null;
const pass = (_) => _;

const _json = (obj) => {
    if (obj == null) {
        return {};
    }
    if (Array.isArray(obj)) {
        return obj.filter((_) => _ != null).map(_json);
    }
    if (typeof obj === "object") {
        const target = {};
        for (const key of Object.keys(obj)) {
            if (obj[key] == null) {
                continue;
            }
            target[key] = _json(obj[key]);
        }
        return target;
    }
    return obj;
};

const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => (context?.utf8Encoder ?? index.toUtf8)(body));

const parseJsonBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        try {
            return JSON.parse(encoded);
        }
        catch (e) {
            if (e?.name === "SyntaxError") {
                Object.defineProperty(e, "$responseBodyText", {
                    value: encoded,
                });
            }
            throw e;
        }
    }
    return {};
});
const parseJsonErrorBody = async (errorBody, context) => {
    const value = await parseJsonBody(errorBody, context);
    value.message = value.message ?? value.Message;
    return value;
};
const loadRestJsonErrorCode = (output, data) => {
    const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
    const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (typeof cleanValue === "number") {
            cleanValue = cleanValue.toString();
        }
        if (cleanValue.indexOf(",") >= 0) {
            cleanValue = cleanValue.split(",")[0];
        }
        if (cleanValue.indexOf(":") >= 0) {
            cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
            cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
    };
    const headerKey = findKey(output.headers, "x-amzn-errortype");
    if (headerKey !== undefined) {
        return sanitizeErrorCode(output.headers[headerKey]);
    }
    if (data && typeof data === "object") {
        const codeKey = findKey(data, "code");
        if (codeKey && data[codeKey] !== undefined) {
            return sanitizeErrorCode(data[codeKey]);
        }
        if (data["__type"] !== undefined) {
            return sanitizeErrorCode(data["__type"]);
        }
    }
};

const resolveParamsForS3 = async (endpointParams) => {
    const bucket = endpointParams?.Bucket || "";
    if (typeof endpointParams.Bucket === "string") {
        endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
    }
    if (isArnBucketName(bucket)) {
        if (endpointParams.ForcePathStyle === true) {
            throw new Error("Path-style addressing cannot be used with ARN buckets");
        }
    }
    else if (!isDnsCompatibleBucketName(bucket) ||
        (bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:")) ||
        bucket.toLowerCase() !== bucket ||
        bucket.length < 3) {
        endpointParams.ForcePathStyle = true;
    }
    if (endpointParams.DisableMultiRegionAccessPoints) {
        endpointParams.disableMultiRegionAccessPoints = true;
        endpointParams.DisableMRAP = true;
    }
    return endpointParams;
};
const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
const DOTS_PATTERN = /\.\./;
const isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
const isArnBucketName = (bucketName) => {
    const [arn, partition, service, , , bucket] = bucketName.split(":");
    const isArn = arn === "arn" && bucketName.split(":").length >= 6;
    const isValidArn = Boolean(isArn && partition && service && bucket);
    if (isArn && !isValidArn) {
        throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
    }
    return isValidArn;
};

const createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
    const configProvider = async () => {
        const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
        if (typeof configValue === "function") {
            return configValue();
        }
        return configValue;
    };
    if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
        return async () => {
            const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
            const configValue = credentials?.credentialScope ?? credentials?.CredentialScope;
            return configValue;
        };
    }
    if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
        return async () => {
            const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
            const configValue = credentials?.accountId ?? credentials?.AccountId;
            return configValue;
        };
    }
    if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
        return async () => {
            if (config.isCustomEndpoint === false) {
                return undefined;
            }
            const endpoint = await configProvider();
            if (endpoint && typeof endpoint === "object") {
                if ("url" in endpoint) {
                    return endpoint.url.href;
                }
                if ("hostname" in endpoint) {
                    const { protocol, hostname, port, path } = endpoint;
                    return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
                }
            }
            return endpoint;
        };
    }
    return configProvider;
};

const getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
    if (!clientConfig.isCustomEndpoint) {
        let endpointFromConfig;
        if (clientConfig.serviceConfiguredEndpoint) {
            endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
        }
        else {
            endpointFromConfig = await index.getEndpointFromConfig(clientConfig.serviceId);
        }
        if (endpointFromConfig) {
            clientConfig.endpoint = () => Promise.resolve(index.toEndpointV1(endpointFromConfig));
            clientConfig.isCustomEndpoint = true;
        }
    }
    const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
    if (typeof clientConfig.endpointProvider !== "function") {
        throw new Error("config.endpointProvider is not set.");
    }
    const endpoint = clientConfig.endpointProvider(endpointParams, context);
    return endpoint;
};
const resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
    const endpointParams = {};
    const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
    for (const [name, instruction] of Object.entries(instructions)) {
        switch (instruction.type) {
            case "staticContextParams":
                endpointParams[name] = instruction.value;
                break;
            case "contextParams":
                endpointParams[name] = commandInput[instruction.name];
                break;
            case "clientContextParams":
            case "builtInParams":
                endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig)();
                break;
            case "operationContextParams":
                endpointParams[name] = instruction.get(commandInput);
                break;
            default:
                throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
        }
    }
    if (Object.keys(instructions).length === 0) {
        Object.assign(endpointParams, clientConfig);
    }
    if (String(clientConfig.serviceId).toLowerCase() === "s3") {
        await resolveParamsForS3(endpointParams);
    }
    return endpointParams;
};

const endpointMiddleware = ({ config, instructions, }) => {
    return (next, context) => async (args) => {
        if (config.isCustomEndpoint) {
            setFeature(context, "ENDPOINT_OVERRIDE", "N");
        }
        const endpoint = await getEndpointFromInstructions(args.input, {
            getEndpointParameterInstructions() {
                return instructions;
            },
        }, { ...config }, context);
        context.endpointV2 = endpoint;
        context.authSchemes = endpoint.properties?.authSchemes;
        const authScheme = context.authSchemes?.[0];
        if (authScheme) {
            context["signing_region"] = authScheme.signingRegion;
            context["signing_service"] = authScheme.signingName;
            const smithyContext = index.getSmithyContext(context);
            const httpAuthOption = smithyContext?.selectedHttpAuthScheme?.httpAuthOption;
            if (httpAuthOption) {
                httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
                    signing_region: authScheme.signingRegion,
                    signingRegion: authScheme.signingRegion,
                    signing_service: authScheme.signingName,
                    signingName: authScheme.signingName,
                    signingRegionSet: authScheme.signingRegionSet,
                }, authScheme.properties);
            }
        }
        return next({
            ...args,
        });
    };
};

const endpointMiddlewareOptions = {
    step: "serialize",
    tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
    name: "endpointV2Middleware",
    override: true,
    relation: "before",
    toMiddleware: serializerMiddlewareOption.name,
};
const getEndpointPlugin = (config, instructions) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo(endpointMiddleware({
            config,
            instructions,
        }), endpointMiddlewareOptions);
    },
});

const defaultSSOOIDCHttpAuthSchemeParametersProvider = async (config, context, input) => {
    return {
        operation: index.getSmithyContext(context).operation,
        region: (await index.normalizeProvider(config.region)()) ||
            (() => {
                throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
            })(),
    };
};
function createAwsAuthSigv4HttpAuthOption(authParameters) {
    return {
        schemeId: "aws.auth#sigv4",
        signingProperties: {
            name: "sso-oauth",
            region: authParameters.region,
        },
        propertiesExtractor: (config, context) => ({
            signingProperties: {
                config,
                context,
            },
        }),
    };
}
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
    return {
        schemeId: "smithy.api#noAuth",
    };
}
const defaultSSOOIDCHttpAuthSchemeProvider = (authParameters) => {
    const options = [];
    switch (authParameters.operation) {
        case "CreateToken": {
            options.push(createSmithyApiNoAuthHttpAuthOption());
            break;
        }
        default: {
            options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
    }
    return options;
};
const resolveHttpAuthSchemeConfig = (config) => {
    const config_0 = index.resolveAwsSdkSigV4Config(config);
    return Object.assign(config_0, {
        authSchemePreference: index.normalizeProvider(config.authSchemePreference ?? []),
    });
};

const resolveClientEndpointParameters = (options) => {
    return Object.assign(options, {
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "sso-oauth",
    });
};
const commonParams = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};

var version = "3.927.0";
var packageInfo = {
	version: version};

const u = "required", v = "fn", w = "argv", x = "ref";
const a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = "getAttr", i = { [u]: false, "type": "string" }, j = { [u]: true, "default": false, "type": "boolean" }, k = { [x]: "Endpoint" }, l = { [v]: c, [w]: [{ [x]: "UseFIPS" }, true] }, m = { [v]: c, [w]: [{ [x]: "UseDualStack" }, true] }, n = {}, o = { [v]: h, [w]: [{ [x]: g }, "supportsFIPS"] }, p = { [x]: g }, q = { [v]: c, [w]: [true, { [v]: h, [w]: [p, "supportsDualStack"] }] }, r = [l], s = [m], t = [{ [x]: "Region" }];
const _data = { parameters: { Region: i, UseDualStack: j, UseFIPS: j, Endpoint: i }, rules: [{ conditions: [{ [v]: b, [w]: [k] }], rules: [{ conditions: r, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: s, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: k, properties: n, headers: n }, type: e }], type: f }, { conditions: [{ [v]: b, [w]: t }], rules: [{ conditions: [{ [v]: "aws.partition", [w]: t, assign: g }], rules: [{ conditions: [l, m], rules: [{ conditions: [{ [v]: c, [w]: [a, o] }, q], rules: [{ endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: r, rules: [{ conditions: [{ [v]: c, [w]: [o, a] }], rules: [{ conditions: [{ [v]: "stringEquals", [w]: [{ [v]: h, [w]: [p, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://oidc.{Region}.amazonaws.com", properties: n, headers: n }, type: e }, { endpoint: { url: "https://oidc-fips.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: s, rules: [{ conditions: [q], rules: [{ endpoint: { url: "https://oidc.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://oidc.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
const ruleSet = _data;

const cache = new index.EndpointCache({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"],
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return cache.get(endpointParams, () => index.resolveEndpoint(ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    }));
};
index.customEndpointFunctions.aws = index.awsEndpointFunctions;

const getRuntimeConfig$1 = (config) => {
    return {
        apiVersion: "2019-06-10",
        base64Decoder: config?.base64Decoder ?? index.fromBase64,
        base64Encoder: config?.base64Encoder ?? index.toBase64,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSSOOIDCHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
                signer: new index.AwsSdkSigV4Signer(),
            },
            {
                schemeId: "smithy.api#noAuth",
                identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                signer: new NoAuthSigner(),
            },
        ],
        logger: config?.logger ?? new index.NoOpLogger(),
        serviceId: config?.serviceId ?? "SSO OIDC",
        urlParser: config?.urlParser ?? index.parseUrl,
        utf8Decoder: config?.utf8Decoder ?? index.fromUtf8,
        utf8Encoder: config?.utf8Encoder ?? index.toUtf8,
    };
};

const getRuntimeConfig = (config) => {
    index.emitWarningIfUnsupportedVersion(process.version);
    const defaultsMode = index.resolveDefaultsModeConfig(config);
    const defaultConfigProvider = () => defaultsMode().then(index.loadConfigsForDefaultMode);
    const clientSharedValues = getRuntimeConfig$1(config);
    index.emitWarningIfUnsupportedVersion$1(process.version);
    const loaderConfig = {
        profile: config?.profile,
        logger: clientSharedValues.logger,
    };
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        authSchemePreference: config?.authSchemePreference ?? index.loadConfig(index.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
        bodyLengthChecker: config?.bodyLengthChecker ?? index.calculateBodyLength,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            index.createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: packageInfo.version }),
        maxAttempts: config?.maxAttempts ?? index.loadConfig(index.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
        region: config?.region ??
            index.loadConfig(index.NODE_REGION_CONFIG_OPTIONS, { ...index.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
        requestHandler: index.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ??
            index.loadConfig({
                ...index.NODE_RETRY_MODE_CONFIG_OPTIONS,
                default: async () => (await defaultConfigProvider()).retryMode || index.DEFAULT_RETRY_MODE,
            }, config),
        sha256: config?.sha256 ?? index.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? index.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? index.loadConfig(index.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        useFipsEndpoint: config?.useFipsEndpoint ?? index.loadConfig(index.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        userAgentAppId: config?.userAgentAppId ?? index.loadConfig(index.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig),
    };
};

const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
    const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
    let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
    let _credentials = runtimeConfig.credentials;
    return {
        setHttpAuthScheme(httpAuthScheme) {
            const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
            if (index === -1) {
                _httpAuthSchemes.push(httpAuthScheme);
            }
            else {
                _httpAuthSchemes.splice(index, 1, httpAuthScheme);
            }
        },
        httpAuthSchemes() {
            return _httpAuthSchemes;
        },
        setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
            _httpAuthSchemeProvider = httpAuthSchemeProvider;
        },
        httpAuthSchemeProvider() {
            return _httpAuthSchemeProvider;
        },
        setCredentials(credentials) {
            _credentials = credentials;
        },
        credentials() {
            return _credentials;
        },
    };
};
const resolveHttpAuthRuntimeConfig = (config) => {
    return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials(),
    };
};

const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
    const extensionConfiguration = Object.assign(index.getAwsRegionExtensionConfiguration(runtimeConfig), index.getDefaultExtensionConfiguration(runtimeConfig), index.getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return Object.assign(runtimeConfig, index.resolveAwsRegionExtensionConfiguration(extensionConfiguration), index.resolveDefaultRuntimeConfig(extensionConfiguration), index.resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

class SSOOIDCClient extends index.Client {
    config;
    constructor(...[configuration]) {
        const _config_0 = getRuntimeConfig(configuration || {});
        super(_config_0);
        this.initConfig = _config_0;
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = index.resolveUserAgentConfig(_config_1);
        const _config_3 = index.resolveRetryConfig(_config_2);
        const _config_4 = index.resolveRegionConfig(_config_3);
        const _config_5 = index.resolveHostHeaderConfig(_config_4);
        const _config_6 = index.resolveEndpointConfig(_config_5);
        const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        this.config = _config_8;
        this.middlewareStack.use(index.getUserAgentPlugin(this.config));
        this.middlewareStack.use(index.getRetryPlugin(this.config));
        this.middlewareStack.use(index.getContentLengthPlugin(this.config));
        this.middlewareStack.use(index.getHostHeaderPlugin(this.config));
        this.middlewareStack.use(index.getLoggerPlugin(this.config));
        this.middlewareStack.use(index.getRecursionDetectionPlugin(this.config));
        this.middlewareStack.use(index.getHttpAuthSchemeEndpointRuleSetPlugin(this.config, {
            httpAuthSchemeParametersProvider: defaultSSOOIDCHttpAuthSchemeParametersProvider,
            identityProviderConfigProvider: async (config) => new index.DefaultIdentityProviderConfig({
                "aws.auth#sigv4": config.credentials,
            }),
        }));
        this.middlewareStack.use(index.getHttpSigningPlugin(this.config));
    }
    destroy() {
        super.destroy();
    }
}

class SSOOIDCServiceException extends ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SSOOIDCServiceException.prototype);
    }
}

class AccessDeniedException extends SSOOIDCServiceException {
    name = "AccessDeniedException";
    $fault = "client";
    error;
    reason;
    error_description;
    constructor(opts) {
        super({
            name: "AccessDeniedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, AccessDeniedException.prototype);
        this.error = opts.error;
        this.reason = opts.reason;
        this.error_description = opts.error_description;
    }
}
class AuthorizationPendingException extends SSOOIDCServiceException {
    name = "AuthorizationPendingException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "AuthorizationPendingException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, AuthorizationPendingException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
const CreateTokenRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.clientSecret && { clientSecret: SENSITIVE_STRING }),
    ...(obj.refreshToken && { refreshToken: SENSITIVE_STRING }),
    ...(obj.codeVerifier && { codeVerifier: SENSITIVE_STRING }),
});
const CreateTokenResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: SENSITIVE_STRING }),
    ...(obj.refreshToken && { refreshToken: SENSITIVE_STRING }),
    ...(obj.idToken && { idToken: SENSITIVE_STRING }),
});
class ExpiredTokenException extends SSOOIDCServiceException {
    name = "ExpiredTokenException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "ExpiredTokenException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ExpiredTokenException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
class InternalServerException extends SSOOIDCServiceException {
    name = "InternalServerException";
    $fault = "server";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "InternalServerException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, InternalServerException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
class InvalidClientException extends SSOOIDCServiceException {
    name = "InvalidClientException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "InvalidClientException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidClientException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
class InvalidGrantException extends SSOOIDCServiceException {
    name = "InvalidGrantException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "InvalidGrantException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidGrantException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
class InvalidRequestException extends SSOOIDCServiceException {
    name = "InvalidRequestException";
    $fault = "client";
    error;
    reason;
    error_description;
    constructor(opts) {
        super({
            name: "InvalidRequestException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
        this.error = opts.error;
        this.reason = opts.reason;
        this.error_description = opts.error_description;
    }
}
class InvalidScopeException extends SSOOIDCServiceException {
    name = "InvalidScopeException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "InvalidScopeException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidScopeException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
class SlowDownException extends SSOOIDCServiceException {
    name = "SlowDownException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "SlowDownException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, SlowDownException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
class UnauthorizedClientException extends SSOOIDCServiceException {
    name = "UnauthorizedClientException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "UnauthorizedClientException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, UnauthorizedClientException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}
class UnsupportedGrantTypeException extends SSOOIDCServiceException {
    name = "UnsupportedGrantTypeException";
    $fault = "client";
    error;
    error_description;
    constructor(opts) {
        super({
            name: "UnsupportedGrantTypeException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, UnsupportedGrantTypeException.prototype);
        this.error = opts.error;
        this.error_description = opts.error_description;
    }
}

const se_CreateTokenCommand = async (input, context) => {
    const b = requestBuilder(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/token");
    let body;
    body = JSON.stringify(take(input, {
        clientId: [],
        clientSecret: [],
        code: [],
        codeVerifier: [],
        deviceCode: [],
        grantType: [],
        redirectUri: [],
        refreshToken: [],
        scope: (_) => _json(_),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const de_CreateTokenCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = expectNonNull(expectObject(await parseJsonBody(output.body, context)), "body");
    const doc = take(data, {
        accessToken: expectString,
        expiresIn: expectInt32,
        idToken: expectString,
        refreshToken: expectString,
        tokenType: expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseJsonErrorBody(output.body, context),
    };
    const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "AccessDeniedException":
        case "com.amazonaws.ssooidc#AccessDeniedException":
            throw await de_AccessDeniedExceptionRes(parsedOutput);
        case "AuthorizationPendingException":
        case "com.amazonaws.ssooidc#AuthorizationPendingException":
            throw await de_AuthorizationPendingExceptionRes(parsedOutput);
        case "ExpiredTokenException":
        case "com.amazonaws.ssooidc#ExpiredTokenException":
            throw await de_ExpiredTokenExceptionRes(parsedOutput);
        case "InternalServerException":
        case "com.amazonaws.ssooidc#InternalServerException":
            throw await de_InternalServerExceptionRes(parsedOutput);
        case "InvalidClientException":
        case "com.amazonaws.ssooidc#InvalidClientException":
            throw await de_InvalidClientExceptionRes(parsedOutput);
        case "InvalidGrantException":
        case "com.amazonaws.ssooidc#InvalidGrantException":
            throw await de_InvalidGrantExceptionRes(parsedOutput);
        case "InvalidRequestException":
        case "com.amazonaws.ssooidc#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput);
        case "InvalidScopeException":
        case "com.amazonaws.ssooidc#InvalidScopeException":
            throw await de_InvalidScopeExceptionRes(parsedOutput);
        case "SlowDownException":
        case "com.amazonaws.ssooidc#SlowDownException":
            throw await de_SlowDownExceptionRes(parsedOutput);
        case "UnauthorizedClientException":
        case "com.amazonaws.ssooidc#UnauthorizedClientException":
            throw await de_UnauthorizedClientExceptionRes(parsedOutput);
        case "UnsupportedGrantTypeException":
        case "com.amazonaws.ssooidc#UnsupportedGrantTypeException":
            throw await de_UnsupportedGrantTypeExceptionRes(parsedOutput);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody,
                errorCode,
            });
    }
};
const throwDefaultError = withBaseException(SSOOIDCServiceException);
const de_AccessDeniedExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
        reason: expectString,
    });
    Object.assign(contents, doc);
    const exception = new AccessDeniedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_AuthorizationPendingExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new AuthorizationPendingException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new ExpiredTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_InternalServerExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new InternalServerException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidClientExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidClientException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidGrantExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidGrantException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
        reason: expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidScopeExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidScopeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_SlowDownExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new SlowDownException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_UnauthorizedClientExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new UnauthorizedClientException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const de_UnsupportedGrantTypeExceptionRes = async (parsedOutput, context) => {
    const contents = map({});
    const data = parsedOutput.body;
    const doc = take(data, {
        error: expectString,
        error_description: expectString,
    });
    Object.assign(contents, doc);
    const exception = new UnsupportedGrantTypeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return decorateServiceException(exception, parsedOutput.body);
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});

class CreateTokenCommand extends Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        getSerdePlugin(config, this.serialize, this.deserialize),
        getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("AWSSSOOIDCService", "CreateToken", {})
    .n("SSOOIDCClient", "CreateTokenCommand")
    .f(CreateTokenRequestFilterSensitiveLog, CreateTokenResponseFilterSensitiveLog)
    .ser(se_CreateTokenCommand)
    .de(de_CreateTokenCommand)
    .build() {
}

exports.__Client = index.Client;
exports.$Command = Command;
exports.AccessDeniedException = AccessDeniedException;
exports.AuthorizationPendingException = AuthorizationPendingException;
exports.CreateTokenCommand = CreateTokenCommand;
exports.CreateTokenRequestFilterSensitiveLog = CreateTokenRequestFilterSensitiveLog;
exports.CreateTokenResponseFilterSensitiveLog = CreateTokenResponseFilterSensitiveLog;
exports.ExpiredTokenException = ExpiredTokenException;
exports.InternalServerException = InternalServerException;
exports.InvalidClientException = InvalidClientException;
exports.InvalidGrantException = InvalidGrantException;
exports.InvalidRequestException = InvalidRequestException;
exports.InvalidScopeException = InvalidScopeException;
exports.SSOOIDCClient = SSOOIDCClient;
exports.SSOOIDCServiceException = SSOOIDCServiceException;
exports.SlowDownException = SlowDownException;
exports.UnauthorizedClientException = UnauthorizedClientException;
exports.UnsupportedGrantTypeException = UnsupportedGrantTypeException;
//# sourceMappingURL=index-C9uLulc1.js.map
