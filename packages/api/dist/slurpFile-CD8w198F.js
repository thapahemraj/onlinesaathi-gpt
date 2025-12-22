'use strict';

var require$$0 = require('os');
var path = require('path');
var fs = require('fs');

const homeDirCache = {};
const getHomeDirCacheKey = () => {
    if (process && process.geteuid) {
        return `${process.geteuid()}`;
    }
    return "DEFAULT";
};
const getHomeDir = () => {
    const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${path.sep}` } = process.env;
    if (HOME)
        return HOME;
    if (USERPROFILE)
        return USERPROFILE;
    if (HOMEPATH)
        return `${HOMEDRIVE}${HOMEPATH}`;
    const homeDirCacheKey = getHomeDirCacheKey();
    if (!homeDirCache[homeDirCacheKey])
        homeDirCache[homeDirCacheKey] = require$$0.homedir();
    return homeDirCache[homeDirCacheKey];
};

const { readFile } = fs.promises;
const filePromisesHash = {};
const fileIntercept = {};
const slurpFile = (path, options) => {
    if (fileIntercept[path] !== undefined) {
        return fileIntercept[path];
    }
    if (!filePromisesHash[path] || options?.ignoreCache) {
        filePromisesHash[path] = readFile(path, "utf8");
    }
    return filePromisesHash[path];
};

exports.fileIntercept = fileIntercept;
exports.getHomeDir = getHomeDir;
exports.slurpFile = slurpFile;
//# sourceMappingURL=slurpFile-CD8w198F.js.map
