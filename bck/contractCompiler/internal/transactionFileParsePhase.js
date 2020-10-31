/**
 * edonkey2001
 * 
 * file: transactionFileParsePhase.js
 * description: given a directory of transaction files, parse the files and return TransactionFile objects
 */
const { readFileSync, readdirSync } = require('fs');

/**
 * Sentences
 * Payment: _ pay _ amount _ of _.
 * Asset/Account Creation: _ create _.
 * Add Signer: add _ to _ weighted _.
 * Change Threshold: _ threshold-_-change _.
 */

// ------------------------------------ Define Regex ------------------------------------ //
const paymentSentenceRegex = /\w* (\w*) pay (\w*) amount (\w*) of (\w*)/;
const creationRegex = /\w* (\w*) create (\w*)/;
const addSignerRegex = /\w* add (\w*) to (\w*) weighted (\w*)/;
const changeThresholdRegex = /\w* (\w*) threshold-([^-]*)-change (\w*)/;

// ------------------------------------ Define Classes ------------------------------------ //
class PaymentSentence {
    constructor(sender, recipient, amount, asset) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.asset = asset;
    }
}

class Creation {
    constructor(creator, createe) {
        this.creator = creator;
        this.createe = createe;
    }
}

class AddSigner {
    constructor(signer, account, weight) {
        this.signer = signer;
        this.account = account;
        this.weight = weight;
    }
}

class ChangeThreshold {
    constructor(account, threshold, weight) {
        this.account = account;
        this.threshold = threshold;
        this.weight = weight;
    }
}

class Operation {
    constructor(operationType, operation) {
        this.operationType = operationType;
        this.operation = operation;
    }
}

class TransactionFile {
    constructor(filepath, operations) {
        this.filepath = filepath;
        this.operations = operations;
    }
}

// ------------------------------------ Parse Methods ------------------------------------ //
function parseSentence(sentence) {
    const paymentMatched = sentence.match(paymentSentenceRegex);
    if (paymentMatched != null) {
        return new Operation(0, new PaymentSentence(paymentMatched[1], paymentMatched[2], paymentMatched[3], paymentMatched[4]));
    }

    const creationMatched = sentence.match(creationRegex);
    if (creationMatched != null) {
        return new Operation(1, new Creation(creationMatched[1], creationMatched[2]));
    }

    const addSignerMatched = sentence.match(addSignerRegex);
    if (addSignerMatched != null) {
        return new Operation(2, new AddSigner(addSignerMatched[1], addSignerMatched[2], addSignerMatched[3]));
    }

    const changeThresholdMatched = sentence.match(changeThresholdRegex);
    if (changeThresholdMatched != null) {
        return new Operation(3, new ChangeThreshold(changeThresholdMatched[1], changeThresholdMatched[2], changeThresholdMatched[3]));
    }

    throw Error(`Unrecognized sentence structure: ${sentence}`);
}

function parseTransaction(filepath) {
    return new TransactionFile(filepath, readFileSync(filepath, 'utf8')
                                            .split('\n')
                                            .map(x => parseSentence(x.trim())));
}

// ------------------------------------ Main Method ------------------------------------ //
// may fail, propagate error
function transactionFileParsePhase(transactionFilesDirectory){
    return readdirSync(transactionFilesDirectory)
        .filter(x => x.endsWith('.tx'))
        .map(x => parseTransaction(transactionFilesDirectory + x));
}

module.exports = {
    transactionFileParsePhase
}