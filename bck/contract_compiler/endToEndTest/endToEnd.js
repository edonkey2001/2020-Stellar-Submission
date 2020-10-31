const StellarSDK = require("stellar-sdk");
const { compileContract } = require('../internal/contractCompiler');

const source = StellarSDK.Keypair.fromSecret('SDU6UF36VIEQ4TB5FPQULZB5AKIH33HMG7VEH4C3URU7MI7YGD7QT7WR');
const server = new StellarSDK.Server('https://horizon-testnet.stellar.org');


(async () => {
    const { sequence } = await server.accounts()
        .accountId(source.publicKey())
        .call();

    const account = new StellarSDK.Account(source.publicKey(), sequence)
    const templateFilePath = "contract_compiler/examples/completed_escrow.templ";
    const transactionFileDir = "contract_compiler/examples/";

    const transactions = compileContract(templateFilePath, transactionFileDir, account);

    console.log(transactions);
})();
