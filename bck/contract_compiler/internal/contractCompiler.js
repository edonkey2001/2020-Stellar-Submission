/**
 * edonkey2001
 * 
 * file: contractCompiler.js
 * description: compile a Stellar Smart Contract from a template and a series of transaction
 *              files into StellarSDK transaction objects and a TemplateManifest by way of a
 *              four phase process
 */
const { templateParsePhase } = require("./templateParsePhase");
const { transactionFileParsePhase } = require("./transactionFileParsePhase");
const { preprocessTransactionPhase } = require("./preprocessTransactionPhase");
const { transpileTransactionPhase } = require("./transpileTransactionPhase");

// ------------------------------------ Main Method ------------------------------------ //
// may fail, propagate error
function compileContract(templateFilePath, transactionFileDir, source) {
    const template = templateParsePhase(templateFilePath);
    let transactions = transactionFileParsePhase(transactionFileDir);
    transactions = preprocessTransactionPhase(template, transactions);
    return {
        transactions: transpileTransactionPhase(transactions, source),
        template,
    };
}

module.exports = {
    compileContract
}