/**
 * edonkey2001
 * 
 * file: index.js
 * description: main file of module which exposes "public" methods
 */
const { compileContract } = require("./internal/contractCompiler");

module.exports = {
    /**
     * compileContract takes a contract template and a directory where transactions live and
     * returns three things:
     *      1. Transactions:
     *          * transaction filename
     *          * StellarSDK transaction object (unsigned)
     *      2. TemplateManifest:
     *          * parsed labels
     *          * execution instructions
     *      3. AccountCache:
     *          * name --> StellarSDK Account mapping of generated, temporary accounts
     */
    compileContract
}