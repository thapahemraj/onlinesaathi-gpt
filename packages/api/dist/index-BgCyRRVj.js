'use strict';

var index = require('./index-CoEzlyBk.js');
var index$1 = require('./index-C3lhZBZO.js');
var _package = require('./package-BjyNmByi.js');
var index$2 = require('./index-VCdUpsVy.js');
var parseUtils = require('./parse-utils-0uSYSO5c.js');
var parseJsonBody = require('./parseJsonBody-CRekdvPo.js');
require('./loadSharedConfigFiles-C6WdD3O1.js');
require('path');
require('./slurpFile-CD8w198F.js');
require('os');
require('fs');
require('stream');
require('process');
require('buffer');
require('crypto');
require('node:fs');
require('@librechat/data-schemas');
require('librechat-data-provider');
require('axios');
require('node:crypto');
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
require('util');
require('form-data');
require('net');
require('tls');
require('url');
require('assert');
require('tty');
require('http2');
require('async_hooks');
require('http');
require('https');
require('@langchain/core/tools');

const defaultSSOOIDCHttpAuthSchemeParametersProvider = async (config, context, input) => {
    return {
        operation: index$1.getSmithyContext(context).operation,
        region: (await index$1.normalizeProvider(config.region)()) ||
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
        authSchemePreference: index$1.normalizeProvider(config.authSchemePreference ?? []),
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
        base64Decoder: config?.base64Decoder ?? parseUtils.fromBase64,
        base64Encoder: config?.base64Encoder ?? parseUtils.toBase64,
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
                signer: new index.NoAuthSigner(),
            },
        ],
        logger: config?.logger ?? new index.NoOpLogger(),
        serviceId: config?.serviceId ?? "SSO OIDC",
        urlParser: config?.urlParser ?? index$2.parseUrl,
        utf8Decoder: config?.utf8Decoder ?? parseUtils.fromUtf8,
        utf8Encoder: config?.utf8Encoder ?? parseUtils.toUtf8,
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
        authSchemePreference: config?.authSchemePreference ?? index$2.loadConfig(index.NODE_AUTH_SCHEME_PREFERENCE_OPTIONS, loaderConfig),
        bodyLengthChecker: config?.bodyLengthChecker ?? index.calculateBodyLength,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            index.createDefaultUserAgentProvider({ serviceId: clientSharedValues.serviceId, clientVersion: _package.packageInfo.version }),
        maxAttempts: config?.maxAttempts ?? index$2.loadConfig(index.NODE_MAX_ATTEMPT_CONFIG_OPTIONS, config),
        region: config?.region ??
            index$2.loadConfig(index.NODE_REGION_CONFIG_OPTIONS, { ...index.NODE_REGION_CONFIG_FILE_OPTIONS, ...loaderConfig }),
        requestHandler: index$1.NodeHttpHandler.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ??
            index$2.loadConfig({
                ...index.NODE_RETRY_MODE_CONFIG_OPTIONS,
                default: async () => (await defaultConfigProvider()).retryMode || index.DEFAULT_RETRY_MODE,
            }, config),
        sha256: config?.sha256 ?? index.Hash.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? index$1.streamCollector,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? index$2.loadConfig(index.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        useFipsEndpoint: config?.useFipsEndpoint ?? index$2.loadConfig(index.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS, loaderConfig),
        userAgentAppId: config?.userAgentAppId ?? index$2.loadConfig(index.NODE_APP_ID_CONFIG_OPTIONS, loaderConfig),
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
    const extensionConfiguration = Object.assign(index.getAwsRegionExtensionConfiguration(runtimeConfig), index.getDefaultExtensionConfiguration(runtimeConfig), index$1.getHttpHandlerExtensionConfiguration(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return Object.assign(runtimeConfig, index.resolveAwsRegionExtensionConfiguration(extensionConfiguration), index.resolveDefaultRuntimeConfig(extensionConfiguration), index$1.resolveHttpHandlerRuntimeConfig(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
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

class SSOOIDCServiceException extends index.ServiceException {
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
    ...(obj.clientSecret && { clientSecret: index.SENSITIVE_STRING }),
    ...(obj.refreshToken && { refreshToken: index.SENSITIVE_STRING }),
    ...(obj.codeVerifier && { codeVerifier: index.SENSITIVE_STRING }),
});
const CreateTokenResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: index.SENSITIVE_STRING }),
    ...(obj.refreshToken && { refreshToken: index.SENSITIVE_STRING }),
    ...(obj.idToken && { idToken: index.SENSITIVE_STRING }),
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
    const b = parseJsonBody.requestBuilder(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/token");
    let body;
    body = JSON.stringify(parseJsonBody.take(input, {
        clientId: [],
        clientSecret: [],
        code: [],
        codeVerifier: [],
        deviceCode: [],
        grantType: [],
        redirectUri: [],
        refreshToken: [],
        scope: (_) => parseJsonBody._json(_),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const de_CreateTokenCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = parseJsonBody.map({
        $metadata: deserializeMetadata(output),
    });
    const data = parseUtils.expectNonNull(parseUtils.expectObject(await parseJsonBody.parseJsonBody(output.body, context)), "body");
    const doc = parseJsonBody.take(data, {
        accessToken: parseUtils.expectString,
        expiresIn: parseUtils.expectInt32,
        idToken: parseUtils.expectString,
        refreshToken: parseUtils.expectString,
        tokenType: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseJsonBody.parseJsonErrorBody(output.body, context),
    };
    const errorCode = parseJsonBody.loadRestJsonErrorCode(output, parsedOutput.body);
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
const throwDefaultError = index.withBaseException(SSOOIDCServiceException);
const de_AccessDeniedExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
        reason: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new AccessDeniedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_AuthorizationPendingExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new AuthorizationPendingException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_ExpiredTokenExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new ExpiredTokenException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_InternalServerExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new InternalServerException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidClientExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidClientException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidGrantExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidGrantException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
        reason: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_InvalidScopeExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new InvalidScopeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_SlowDownExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new SlowDownException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_UnauthorizedClientExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new UnauthorizedClientException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const de_UnsupportedGrantTypeExceptionRes = async (parsedOutput, context) => {
    const contents = parseJsonBody.map({});
    const data = parsedOutput.body;
    const doc = parseJsonBody.take(data, {
        error: parseUtils.expectString,
        error_description: parseUtils.expectString,
    });
    Object.assign(contents, doc);
    const exception = new UnsupportedGrantTypeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return index.decorateServiceException(exception, parsedOutput.body);
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});

class CreateTokenCommand extends index.Command
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        index.getSerdePlugin(config, this.serialize, this.deserialize),
        index.getEndpointPlugin(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("AWSSSOOIDCService", "CreateToken", {})
    .n("SSOOIDCClient", "CreateTokenCommand")
    .f(CreateTokenRequestFilterSensitiveLog, CreateTokenResponseFilterSensitiveLog)
    .ser(se_CreateTokenCommand)
    .de(de_CreateTokenCommand)
    .build() {
}

exports.$Command = index.Command;
exports.__Client = index.Client;
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
//# sourceMappingURL=index-BgCyRRVj.js.map
