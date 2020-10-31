const StellarSDK = require("stellar-sdk");
const { compileContract } = require('../../contractCompiler/internal/contractCompiler');
const { executeContract } = require('../index');

// key for PARTY_A in "simple_e2e_completed.templ"
const source = StellarSDK.Keypair.fromSecret('SAREFLSVKCMERG5ZYYUFOUZF7QRUJJ7UIMVF2HJBFGSJPEC5WBSVSEGJ');
var server = new StellarSDK.Server("https://horizon-testnet.stellar.org");

(async () => {
    const { sequence } = await server.accounts()
        .accountId(source.publicKey())
        .call();

    const account = new StellarSDK.Account(source.publicKey(), sequence)
    const templateFilePath = "contractExecutor/examples/simple_e2e/simple_e2e_completed.templ";
    const transactionFileDir = "contractExecutor/examples/simple_e2e/";

    const { transactions, accountCache, template } = compileContract(templateFilePath, transactionFileDir, account);

    // won't do this IRL
    accountCache["PARTY_A"] = source;

    executeContract(transactions, template, accountCache);
})();
