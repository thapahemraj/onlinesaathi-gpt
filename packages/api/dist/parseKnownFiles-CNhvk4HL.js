'use strict';

var loadSharedConfigFiles = require('./loadSharedConfigFiles-C6WdD3O1.js');

const mergeConfigFiles = (...files) => {
    const merged = {};
    for (const file of files) {
        for (const [key, values] of Object.entries(file)) {
            if (merged[key] !== undefined) {
                Object.assign(merged[key], values);
            }
            else {
                merged[key] = values;
            }
        }
    }
    return merged;
};

const parseKnownFiles = async (init) => {
    const parsedFiles = await loadSharedConfigFiles.loadSharedConfigFiles(init);
    return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
};

exports.parseKnownFiles = parseKnownFiles;
//# sourceMappingURL=parseKnownFiles-CNhvk4HL.js.map
