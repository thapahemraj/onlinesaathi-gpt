'use strict';

var require$$0 = require('buffer');
var http = require('http');
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
require('https');
require('@langchain/core/tools');

function httpRequest(options) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            method: "GET",
            ...options,
            hostname: options.hostname?.replace(/^\[(.+)\]$/, "$1"),
        });
        req.on("error", (err) => {
            reject(Object.assign(new index.ProviderError("Unable to connect to instance metadata service"), err));
            req.destroy();
        });
        req.on("timeout", () => {
            reject(new index.ProviderError("TimeoutError from instance metadata service"));
            req.destroy();
        });
        req.on("response", (res) => {
            const { statusCode = 400 } = res;
            if (statusCode < 200 || 300 <= statusCode) {
                reject(Object.assign(new index.ProviderError("Error response received from instance metadata service"), { statusCode }));
                req.destroy();
            }
            const chunks = [];
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });
            res.on("end", () => {
                resolve(require$$0.Buffer.concat(chunks));
                req.destroy();
            });
        });
        req.end();
    });
}

exports.Endpoint = void 0;
(function (Endpoint) {
    Endpoint["IPv4"] = "http://169.254.169.254";
    Endpoint["IPv6"] = "http://[fd00:ec2::254]";
})(exports.Endpoint || (exports.Endpoint = {}));

const ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
const CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
const ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[ENV_ENDPOINT_NAME],
    configFileSelector: (profile) => profile[CONFIG_ENDPOINT_NAME],
    default: undefined,
};

var EndpointMode;
(function (EndpointMode) {
    EndpointMode["IPv4"] = "IPv4";
    EndpointMode["IPv6"] = "IPv6";
})(EndpointMode || (EndpointMode = {}));

const ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
const CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
const ENDPOINT_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[ENV_ENDPOINT_MODE_NAME],
    configFileSelector: (profile) => profile[CONFIG_ENDPOINT_MODE_NAME],
    default: EndpointMode.IPv4,
};

const getInstanceMetadataEndpoint = async () => index.parseUrl((await getFromEndpointConfig()) || (await getFromEndpointModeConfig()));
const getFromEndpointConfig = async () => index.loadConfig(ENDPOINT_CONFIG_OPTIONS)();
const getFromEndpointModeConfig = async () => {
    const endpointMode = await index.loadConfig(ENDPOINT_MODE_CONFIG_OPTIONS)();
    switch (endpointMode) {
        case EndpointMode.IPv4:
            return exports.Endpoint.IPv4;
        case EndpointMode.IPv6:
            return exports.Endpoint.IPv6;
        default:
            throw new Error(`Unsupported endpoint mode: ${endpointMode}.` + ` Select from ${Object.values(EndpointMode)}`);
    }
};

exports.getInstanceMetadataEndpoint = getInstanceMetadataEndpoint;
exports.httpRequest = httpRequest;
//# sourceMappingURL=index-BoEdUw3B.js.map
