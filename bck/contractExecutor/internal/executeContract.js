/**
 * edonkey2001
 * 
 * file: executeContract.js
 * description: executes a single contract
 */
const StellarSDK = require("stellar-sdk");

var server = new StellarSDK.Server("https://horizon-testnet.stellar.org");

async function executeContract(transactions, templateManifest, accountCache) {
    for (let i = 0; i < templateManifest.executions.length; i++) {
        const execution = templateManifest.executions[i];

        if (execution.isPartial || execution.timedInterval != -1) {
            throw Error("Partial and timed transactions not supported yet. Stay tuned :)");
        }
        
        const transactionObjs = transactions.filter(tx => tx.filename == execution.filename);
        if (transactionObjs.length != 1) {
            throw Error("Expected only 1 transaction with filename");
        }

        const tx = transactionObjs[0].transaction;

        execution.signers.map(x => accountCache[x]).forEach(x => tx.sign(x));

        console.log("Executing:",  transactions[i].filename);
        console.log(tx._operations);
        const resp = await server.submitTransaction(tx);
        console.log("Success");
    }
}

module.exports = {
    executeContract,
}