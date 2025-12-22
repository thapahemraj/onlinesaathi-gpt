'use strict';

var child_process = require('child_process');
var require$$2 = require('util');
var index = require('./index-C3lhZBZO.js');
var externalDataInterceptor = require('./externalDataInterceptor-CfQunm20.js');
var parseKnownFiles = require('./parseKnownFiles-CNhvk4HL.js');
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
require('./getSSOTokenFromFile-BkmVg-em.js');
require('./slurpFile-CD8w198F.js');
require('./loadSharedConfigFiles-C6WdD3O1.js');

const getValidatedProcessCredentials = (profileName, data, profiles) => {
    if (data.Version !== 1) {
        throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
    }
    if (data.AccessKeyId === undefined || data.SecretAccessKey === undefined) {
        throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
    }
    if (data.Expiration) {
        const currentTime = new Date();
        const expireTime = new Date(data.Expiration);
        if (expireTime < currentTime) {
            throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
        }
    }
    let accountId = data.AccountId;
    if (!accountId && profiles?.[profileName]?.aws_account_id) {
        accountId = profiles[profileName].aws_account_id;
    }
    const credentials = {
        accessKeyId: data.AccessKeyId,
        secretAccessKey: data.SecretAccessKey,
        ...(data.SessionToken && { sessionToken: data.SessionToken }),
        ...(data.Expiration && { expiration: new Date(data.Expiration) }),
        ...(data.CredentialScope && { credentialScope: data.CredentialScope }),
        ...(accountId && { accountId }),
    };
    index.setCredentialFeature(credentials, "CREDENTIALS_PROCESS", "w");
    return credentials;
};

const resolveProcessCredentials = async (profileName, profiles, logger) => {
    const profile = profiles[profileName];
    if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== undefined) {
            const execPromise = require$$2.promisify(externalDataInterceptor.externalDataInterceptor?.getTokenRecord?.().exec ?? child_process.exec);
            try {
                const { stdout } = await execPromise(credentialProcess);
                let data;
                try {
                    data = JSON.parse(stdout.trim());
                }
                catch {
                    throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
                }
                return getValidatedProcessCredentials(profileName, data, profiles);
            }
            catch (error) {
                throw new index.CredentialsProviderError(error.message, { logger });
            }
        }
        else {
            throw new index.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`, { logger });
        }
    }
    else {
        throw new index.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`, {
            logger,
        });
    }
};

const fromProcess = (init = {}) => async ({ callerClientConfig } = {}) => {
    init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
    const profiles = await parseKnownFiles.parseKnownFiles(init);
    return resolveProcessCredentials(index.getProfileName({
        profile: init.profile ?? callerClientConfig?.profile,
    }), profiles, init.logger);
};

exports.fromProcess = fromProcess;
//# sourceMappingURL=index-CfFIbSAz.js.map
