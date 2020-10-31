/**
 * edonkey2001
 * 
 * file: transpileTransactionPhase.js
 * description: given TransactionFile objects, convert into StellarSDK Transactions
 */
const { Operation, TransactionBuilder, BASE_FEE, Networks } = require("stellar-sdk");

// ------------------------------------ Transpile Methods ------------------------------------ //
function processOperation(operation) {
    const opType = operation.operationType;
    let op = operation.operation;
    switch(opType) {
        // Payment
        case 0: {
            return Operation.payment({
                source: op.sender.publicKey(),
                destination: op.recipient.publicKey(),
                amount: op.amount.toString(),
                asset: op.asset
            });
        }

        case 1: {
            return Operation.createAccount({
                source: op.creator.publicKey(),
                destination: op.createe.publicKey(),
                startingBalance: "25" // hard coded to the account minimum for now
            });
        }

        case 2: {
            return Operation.setOptions({
                source: op.account.publicKey(),
                signer: {
                    ed25519PublicKey: op.signer.publicKey(),
                    weight: op.weight
                }
            });
        }

        case 3: {
            switch (op.threshold) {
                case "low":
                    return Operation.setOptions({
                        source: op.account.publicKey(),
                        lowThreshold: op.weight
                    });
                case "medium":
                    return Operation.setOptions({
                        source: op.account.publicKey(),
                        medThreshold: op.weight
                    });
                case "high":
                    return Operation.setOptions({
                        source: op.account.publicKey(),
                        highThreshold: op.weight
                    });
                default:
                    throw Error("Unrecognized account threshold");
            }
        }

        default:
            throw Error("Unexpected operation type");
    }
}

// ------------------------------------ Main Method ------------------------------------ //
// may fail, propagate error
function transpileTransactionPhase(transactions, source){
    return transactions.map(tx => {
        const ops = tx.operations.map(op => processOperation(op));
        const txbase = new TransactionBuilder(source, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET
          })

        ops.forEach(op => {
            txbase.addOperation(op);
        })

        return {
            transaction: txbase.setTimeout(30).build(),
            filepath: tx.filepath,
        }
    });
}

module.exports = {
    transpileTransactionPhase
}