'use strict';

var getSSOTokenFromFile = require('./getSSOTokenFromFile-BkmVg-em.js');
var slurpFile = require('./slurpFile-CD8w198F.js');

const externalDataInterceptor = {
    getFileRecord() {
        return slurpFile.fileIntercept;
    },
    interceptFile(path, contents) {
        slurpFile.fileIntercept[path] = Promise.resolve(contents);
    },
    getTokenRecord() {
        return getSSOTokenFromFile.tokenIntercept;
    },
    interceptToken(id, contents) {
        getSSOTokenFromFile.tokenIntercept[id] = contents;
    },
};

exports.externalDataInterceptor = externalDataInterceptor;
//# sourceMappingURL=externalDataInterceptor-CfQunm20.js.map
