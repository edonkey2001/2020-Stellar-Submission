/**
 * edonkey2001
 * 
 * file: preprocessTransactionPhase.js
 * description: given TransactionFile objects and a TemplateManifest, fill in the free variables
 *              if they exist
 */
const { Asset, Keypair } = require("stellar-sdk");

// hack to capture generated accounts
// NAME --> ACCOUNT (obj)
const accountCache = {};

// ------------------------------------ Process Methods ------------------------------------ //
function processOperation(operation, findAndReplace) {
    const opType = operation.operationType;
    let op = operation.operation;
    switch(opType) {
        // Payment
        case 0:
            op.sender = findAndReplace(op.sender);
            op.recipient = findAndReplace(op.recipient);
            op.amount = findAndReplace(op.amount);
            op.asset = findAndReplace(op.asset);
            break;

        case 1:
            op.creator = findAndReplace(op.creator);
            op.createe = findAndReplace(op.createe);
            break;

        case 2:
            op.signer = findAndReplace(op.signer);
            op.account = findAndReplace(op.account);
            op.weight = findAndReplace(op.weight);
            break;

        case 3:
            op.account = findAndReplace(op.account);
            op.threshold = findAndReplace(op.threshold);
            op.weight = findAndReplace(op.weight);
            break;

        default:
            throw Error("Unexpected operation type");
    }
}

function findAndReplace(template) {
    return (freeVariable) => {
        const fillin = template.labels.filter(x => x.name == freeVariable);
        return fillin.length == 1 ? convertValue(fillin[0]) : freeVariable;
    };
}

function convertValue(label) {
    switch(label.type) {
        case "ASSET": {
            const [code, issuer] = label.value.split(':');
            if (issuer.toLowerCase() == "native") {
                return Asset.native();
            }

            return new Asset(code, issuer);
        }
           
        case "NUMBER":
            return parseInt(label.value);

        // TODO: actually implement
        case "FRACTION":
            throw Error("Not implemented");

        case "STRING":
            return label.value;

        case "ACCOUNT":
            return Keypair.fromPublicKey(label.value);

        // assign account then switch type so only assigned once
        case "NEW_ACCOUNT":
            const key = Keypair.random();
            accountCache[label.name] = key;
            label.value = key.publicKey();
            label.type = "ACCOUNT";
            return key;
    }
}

// ------------------------------------ Main Method ------------------------------------ //
// may fail, propagate error
function preprocessTransactionPhase(template, transactions){
    return {
            transactions: transactions.map(tx => {
                                             tx.operations.forEach(op => processOperation(op, findAndReplace(template)));
                                            return tx;
                                        }),
            accountCache
                                    };
}

module.exports = {
    preprocessTransactionPhase
}