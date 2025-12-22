'use strict';

var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var slurpFile = require('./slurpFile-CD8w198F.js');

const getSSOTokenFilepath = (id) => {
    const hasher = crypto.createHash("sha1");
    const cacheName = hasher.update(id).digest("hex");
    return path.join(slurpFile.getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
};

const { readFile } = fs.promises;
const tokenIntercept = {};
const getSSOTokenFromFile = async (id) => {
    if (tokenIntercept[id]) {
        return tokenIntercept[id];
    }
    const ssoTokenFilepath = getSSOTokenFilepath(id);
    const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
    return JSON.parse(ssoTokenText);
};

exports.getSSOTokenFilepath = getSSOTokenFilepath;
exports.getSSOTokenFromFile = getSSOTokenFromFile;
exports.tokenIntercept = tokenIntercept;
//# sourceMappingURL=getSSOTokenFromFile-BkmVg-em.js.map
