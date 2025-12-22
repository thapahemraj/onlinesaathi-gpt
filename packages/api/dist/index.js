'use strict';

var index = require('./index-C3lhZBZO.js');
var dataSchemas = require('@librechat/data-schemas');
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



exports.BasicToolEndHandler = index.BasicToolEndHandler;
exports.DEFAULT_RETENTION_HOURS = index.DEFAULT_RETENTION_HOURS;
exports.ErrorController = index.ErrorController;
exports.FlowStateManager = index.FlowStateManager;
exports.MAX_RETENTION_HOURS = index.MAX_RETENTION_HOURS;
exports.MCPConnection = index.MCPConnection;
exports.MCPDomainNotAllowedError = index.MCPDomainNotAllowedError;
exports.MCPErrorCodes = index.MCPErrorCodes;
exports.MCPInspectionFailedError = index.MCPInspectionFailedError;
exports.MCPManager = index.MCPManager;
exports.MCPOAuthHandler = index.MCPOAuthHandler;
exports.MCPServersRegistry = index.MCPServersRegistry;
exports.MCPTokenStorage = index.MCPTokenStorage;
exports.MIN_RETENTION_HOURS = index.MIN_RETENTION_HOURS;
exports.OAuthReconnectionManager = index.OAuthReconnectionManager;
exports.Tokenizer = index.TokenizerSingleton;
exports.agentAvatarSchema = index.agentAvatarSchema;
exports.agentBaseResourceSchema = index.agentBaseResourceSchema;
exports.agentBaseSchema = index.agentBaseSchema;
exports.agentCreateSchema = index.agentCreateSchema;
exports.agentFileResourceSchema = index.agentFileResourceSchema;
exports.agentSupportContactSchema = index.agentSupportContactSchema;
exports.agentToolResourcesSchema = index.agentToolResourcesSchema;
exports.agentUpdateSchema = index.agentUpdateSchema;
exports.applyDefaultParams = index.applyDefaultParams;
exports.batchDeleteKeys = index.batchDeleteKeys;
exports.buildPromptGroupFilter = index.buildPromptGroupFilter;
exports.cacheConfig = index.cacheConfig;
exports.checkAccess = index.checkAccess;
exports.checkAgentPermissionsMigration = index.checkAgentPermissionsMigration;
exports.checkConfig = index.checkConfig;
exports.checkEmailConfig = index.checkEmailConfig;
exports.checkHealth = index.checkHealth;
exports.checkInterfaceConfig = index.checkInterfaceConfig;
exports.checkPluginAuth = index.checkPluginAuth;
exports.checkPromptCacheSupport = index.checkPromptCacheSupport;
exports.checkPromptPermissionsMigration = index.checkPromptPermissionsMigration;
exports.checkUserKeyExpiry = index.checkUserKeyExpiry;
exports.checkVariables = index.checkVariables;
exports.checkWebSearchConfig = index.checkWebSearchConfig;
exports.configureReasoning = index.configureReasoning;
exports.conflictingAzureVariables = index.conflictingAzureVariables;
exports.constructAzureURL = index.constructAzureURL;
exports.convertJsonSchemaToZod = index.convertJsonSchemaToZod;
exports.convertOcrToContextInPlace = index.convertOcrToContextInPlace;
exports.convertWithResolvedRefs = index.convertWithResolvedRefs;
exports.countTokens = index.countTokens;
exports.createAxiosInstance = index.createAxiosInstance;
exports.createEmptyPromptGroupsResponse = index.createEmptyPromptGroupsResponse;
exports.createFetch = index.createFetch;
exports.createHandleLLMNewToken = index.createHandleLLMNewToken;
exports.createHandleOAuthToken = index.createHandleOAuthToken;
exports.createMemoryCallback = index.createMemoryCallback;
exports.createMemoryProcessor = index.createMemoryProcessor;
exports.createMemoryTool = index.createMemoryTool;
exports.createRun = index.createRun;
exports.createSafeUser = index.createSafeUser;
exports.createSequentialChainEdges = index.createSequentialChainEdges;
exports.createSetBalanceConfig = index.createSetBalanceConfig;
exports.createStreamEventHandlers = index.createStreamEventHandlers;
exports.createTempChatExpirationDate = index.createTempChatExpirationDate;
exports.deleteMistralFile = index.deleteMistralFile;
exports.deprecatedAzureVariables = index.deprecatedAzureVariables;
exports.deriveBaseURL = index.deriveBaseURL;
exports.detectOAuthRequirement = index.detectOAuthRequirement;
exports.encodeAndFormatAudios = index.encodeAndFormatAudios;
exports.encodeAndFormatDocuments = index.encodeAndFormatDocuments;
exports.encodeAndFormatVideos = index.encodeAndFormatVideos;
exports.ensureCollectionExists = index.ensureCollectionExists;
exports.ensureRequiredCollectionsExist = index.ensureRequiredCollectionsExist;
exports.escapeRegExp = index.escapeRegExp;
exports.escapeRegex = index.escapeRegex;
exports.extractBaseURL = index.extractBaseURL;
exports.extractDefaultParams = index.extractDefaultParams;
exports.extractFileContext = index.extractFileContext;
exports.extractLibreChatParams = index.extractLibreChatParams;
exports.extractMCPServerDomain = index.extractMCPServerDomain;
exports.extractWebSearchEnvVars = index.extractWebSearchEnvVars;
exports.fetchAnthropicModels = index.fetchAnthropicModels;
exports.fetchModels = index.fetchModels;
exports.fetchOpenAIModels = index.fetchOpenAIModels;
exports.filterAccessibleIdsBySharedLogic = index.filterAccessibleIdsBySharedLogic;
exports.filterFilesByEndpointConfig = index.filterFilesByEndpointConfig;
exports.filterMalformedContentParts = index.filterMalformedContentParts;
exports.filterUniquePlugins = index.filterUniquePlugins;
exports.findMatchingPattern = index.findMatchingPattern;
exports.findOpenIDUser = index.findOpenIDUser;
exports.formatPromptGroupsResponse = index.formatPromptGroupsResponse;
exports.genAzureChatCompletion = index.genAzureChatCompletion;
exports.genAzureEndpoint = index.genAzureEndpoint;
exports.generateArtifactsPrompt = index.generateArtifactsPrompt;
exports.generateCheckAccess = index.generateCheckAccess;
exports.generateServerNameFromTitle = index.generateServerNameFromTitle;
exports.generateShortLivedToken = index.generateShortLivedToken;
exports.getAccessToken = index.getAccessToken;
exports.getAnthropicModels = index.getAnthropicModels;
exports.getAzureContainerClient = index.getAzureContainerClient;
exports.getAzureCredentials = index.getAzureCredentials;
exports.getBalanceConfig = index.getBalanceConfig;
exports.getBasePath = index.getBasePath;
exports.getBedrockModels = index.getBedrockModels;
exports.getClaudeHeaders = index.getClaudeHeaders;
exports.getCustomEndpointConfig = index.getCustomEndpointConfig;
exports.getFileBasename = index.getFileBasename;
exports.getFirebaseStorage = index.getFirebaseStorage;
exports.getGoogleConfig = index.getGoogleConfig;
exports.getGoogleModels = index.getGoogleModels;
exports.getImageBasename = index.getImageBasename;
exports.getLLMConfig = index.getLLMConfig;
exports.getModelMaxOutputTokens = index.getModelMaxOutputTokens;
exports.getModelMaxTokens = index.getModelMaxTokens;
exports.getModelTokenValue = index.getModelTokenValue;
exports.getOpenAIConfig = index.getOpenAIConfig;
exports.getOpenAILLMConfig = index.getOpenAILLMConfig;
exports.getOpenAIModels = index.getOpenAIModels;
exports.getProviderConfig = index.getProviderConfig;
exports.getReasoningKey = index.getReasoningKey;
exports.getSafetySettings = index.getSafetySettings;
exports.getSignedUrl = index.getSignedUrl;
exports.getTempChatRetentionHours = index.getTempChatRetentionHours;
exports.getToolkitKey = index.getToolkitKey;
exports.getTransactionsConfig = index.getTransactionsConfig;
exports.getUserMCPAuthMap = index.getUserMCPAuthMap;
exports.graphEdgeSchema = index.graphEdgeSchema;
exports.handleError = index.handleError;
exports.handleJsonParseError = index.handleJsonParseError;
exports.hasCustomUserVars = index.hasCustomUserVars;
exports.initializeAgent = index.initializeAgent;
exports.initializeAnthropic = index.initializeAnthropic;
exports.initializeAzureBlobService = index.initializeAzureBlobService;
exports.initializeBedrock = index.initializeBedrock;
exports.initializeCustom = index.initializeCustom;
exports.initializeFileStorage = index.initializeFileStorage;
exports.initializeFirebase = index.initializeFirebase;
exports.initializeGoogle = index.initializeGoogle;
exports.initializeOpenAI = index.initializeOpenAI;
exports.initializeS3 = index.initializeS3;
exports.inputSchema = index.inputSchema;
Object.defineProperty(exports, "ioredisClient", {
	enumerable: true,
	get: function () { return index.ioredisClient; }
});
exports.isActionDomainAllowed = index.isActionDomainAllowed;
exports.isEmailDomainAllowed = index.isEmailDomainAllowed;
exports.isEnabled = index.isEnabled;
exports.isKnownCustomProvider = index.isKnownCustomProvider;
exports.isMCPDomainAllowed = index.isMCPDomainAllowed;
exports.isMCPDomainNotAllowedError = index.isMCPDomainNotAllowedError;
exports.isMCPInspectionFailedError = index.isMCPInspectionFailedError;
exports.isMemoryEnabled = index.isMemoryEnabled;
exports.isUserProvided = index.isUserProvided;
exports.keyvMongo = index.keyvMongo;
Object.defineProperty(exports, "keyvRedisClient", {
	enumerable: true,
	get: function () { return index.keyvRedisClient; }
});
Object.defineProperty(exports, "keyvRedisClientReady", {
	enumerable: true,
	get: function () { return index.keyvRedisClientReady; }
});
exports.knownAnthropicParams = index.knownAnthropicParams;
exports.knownGoogleParams = index.knownGoogleParams;
exports.knownOpenAIParams = index.knownOpenAIParams;
exports.limiterCache = index.limiterCache;
exports.loadCustomEndpointsConfig = index.loadCustomEndpointsConfig;
exports.loadOCRConfig = index.loadOCRConfig;
exports.loadServiceKey = index.loadServiceKey;
exports.loadWebSearchAuth = index.loadWebSearchAuth;
exports.loadYaml = index.loadYaml;
exports.logAgentMigrationWarning = index.logAgentMigrationWarning;
exports.logAxiosError = index.logAxiosError;
exports.logFile = index.logFile;
exports.logHeaders = index.logHeaders;
exports.logPromptMigrationWarning = index.logPromptMigrationWarning;
exports.markPublicPromptGroups = index.markPublicPromptGroups;
exports.matchModelName = index.matchModelName;
exports.math = index.math;
exports.maxOutputTokensMap = index.maxOutputTokensMap;
exports.maxTokensMap = index.maxTokensMap;
exports.mcpToolPattern = index.mcpToolPattern;
exports.memoryInstructions = index.memoryInstructions;
exports.mergeAgentOcrConversion = index.mergeAgentOcrConversion;
exports.modelMaxOutputs = index.modelMaxOutputs;
exports.modelSchema = index.modelSchema;
exports.normalizeHttpError = index.normalizeHttpError;
exports.normalizeServerName = index.normalizeServerName;
exports.oaiToolkit = index.oaiToolkit;
exports.optionalChainWithEmptyCheck = index.optionalChainWithEmptyCheck;
exports.parseText = index.parseText;
exports.parseTextNative = index.parseTextNative;
exports.performOCR = index.performOCR;
exports.performStartupChecks = index.performStartupChecks;
exports.primeResources = index.primeResources;
exports.processAudioFile = index.processAudioFile;
exports.processMCPEnv = index.processMCPEnv;
exports.processMemory = index.processMemory;
exports.processModelData = index.processModelData;
exports.processTextWithTokenLimit = index.processTextWithTokenLimit;
exports.providerConfigMap = index.providerConfigMap;
exports.readFileAsBuffer = index.readFileAsBuffer;
exports.readFileAsString = index.readFileAsString;
exports.readJsonFile = index.readJsonFile;
exports.refreshAccessToken = index.refreshAccessToken;
exports.resolveHeaders = index.resolveHeaders;
exports.resolveJsonSchemaRefs = index.resolveJsonSchemaRefs;
exports.resolveNestedObject = index.resolveNestedObject;
exports.safeStringify = index.safeStringify;
exports.safeValidatePromptGroupUpdate = index.safeValidatePromptGroupUpdate;
exports.sanitizeFileForTransmit = index.sanitizeFileForTransmit;
exports.sanitizeFilename = index.sanitizeFilename;
exports.sanitizeMessageForTransmit = index.sanitizeMessageForTransmit;
exports.sanitizeModelName = index.sanitizeModelName;
exports.sanitizeTitle = index.sanitizeTitle;
exports.sanitizeUrlForLogging = index.sanitizeUrlForLogging;
exports.scanKeys = index.scanKeys;
exports.sendEvent = index.sendEvent;
exports.sessionCache = index.sessionCache;
exports.skipAgentCheck = index.skipAgentCheck;
exports.splitAndTrim = index.splitAndTrim;
exports.standardCache = index.standardCache;
exports.tiktokenModels = index.tiktokenModels;
exports.unescapeLaTeX = index.unescapeLaTeX;
exports.updateInterfacePermissions = index.updateInterfacePermissions;
exports.updatePromptGroupSchema = index.updatePromptGroupSchema;
exports.uploadAzureMistralOCR = index.uploadAzureMistralOCR;
exports.uploadDocumentToMistral = index.uploadDocumentToMistral;
exports.uploadGoogleVertexMistralOCR = index.uploadGoogleVertexMistralOCR;
exports.uploadMistralOCR = index.uploadMistralOCR;
exports.validateAgentModel = index.validateAgentModel;
exports.validateAudio = index.validateAudio;
exports.validateImage = index.validateImage;
exports.validatePdf = index.validatePdf;
exports.validatePromptGroupUpdate = index.validatePromptGroupUpdate;
exports.validateVideo = index.validateVideo;
exports.violationCache = index.violationCache;
exports.violationFile = index.violationFile;
exports.withTimeout = index.withTimeout;
exports.ytToolkit = index.ytToolkit;
Object.defineProperty(exports, "decrypt", {
	enumerable: true,
	get: function () { return dataSchemas.decrypt; }
});
Object.defineProperty(exports, "decryptV2", {
	enumerable: true,
	get: function () { return dataSchemas.decryptV2; }
});
Object.defineProperty(exports, "decryptV3", {
	enumerable: true,
	get: function () { return dataSchemas.decryptV3; }
});
Object.defineProperty(exports, "encrypt", {
	enumerable: true,
	get: function () { return dataSchemas.encrypt; }
});
Object.defineProperty(exports, "encryptV2", {
	enumerable: true,
	get: function () { return dataSchemas.encryptV2; }
});
Object.defineProperty(exports, "encryptV3", {
	enumerable: true,
	get: function () { return dataSchemas.encryptV3; }
});
Object.defineProperty(exports, "getRandomValues", {
	enumerable: true,
	get: function () { return dataSchemas.getRandomValues; }
});
Object.defineProperty(exports, "hashBackupCode", {
	enumerable: true,
	get: function () { return dataSchemas.hashBackupCode; }
});
//# sourceMappingURL=index.js.map
