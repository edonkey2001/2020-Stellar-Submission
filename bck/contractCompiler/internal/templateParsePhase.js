/**
 * edonkey2001
 * 
 * file: templateParsePhase.js
 * description: given a directory of transaction files, parse the files and return TransactionFile objects
 */
const { readFileSync } = require('fs');

// ------------------------------------ Define Classes ------------------------------------ //
class Label {
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
}

class Execution {
    constructor(filename, isPartial, timedInterval, signers)
    {
        this.filename = filename;
        this.isPartial = isPartial;
        this.timedInterval = timedInterval;
        this.signers = signers;
    }
}

class TemplateManifest {
    constructor(labels, executions) {
        this.labels = labels;
        this.executions = executions;
    }
}

// ------------------------------------ Parse Methods ------------------------------------ //
function parseTemplate(content) {
    const templateHeader = "[TEMPLATE]";
    const executionHeader = "[EXECUTION]";
    // <NAME: TYPE> </NAME>
    const labelsRegex = /<[^:]*:[^>]*>[^<]*<\/[^>]*>/g;
    // separate regex per label to allow for easy capture group extraction
    const labelRegex = /<([^:]*):([^>]*)>([^<]*)<\/([^>]*)>/;
    const transactionsRegex = /[^\n]*/g;

    const templateBegin = content.indexOf(templateHeader) + templateHeader.length;
    const executionBegin = content.indexOf(executionHeader);
    
    if (templateBegin != templateHeader.length || executionBegin == -1)
    {
        throw Error("No header found");
    }

    const labels = content
                    .substring(templateBegin, executionBegin)
                    .trimLeft()
                    .match(labelsRegex)
                    .map(x => 
                        {
                            var y = x.match(labelRegex);
                            if (y.length != 5 || y[1].trim() != y[4].trim()) {
                                return null;
                            }

                            return new Label(y[1].trim(), y[2].trim(), y[3].trim());
                        })
                    .filter(x => !!x); // what a lovely js hack

    const transactions = content
                    .substring(executionBegin + executionHeader.length)
                    .trimLeft()
                    .match(transactionsRegex)
                    .filter(x => x.length)
                    .map(parseTransaction);

    return new TemplateManifest(labels, transactions);
}

function parseTransaction(content) {
    content = content.trim();
    const signerSplit = content.indexOf('[');

    if (signerSplit == -1) {
        throw Error("Expected signers");
    }

    const signers = parseSignerArray(content.substring(signerSplit));
    const splitted = content.substring(0, signerSplit - 1).split(' ');
    switch(splitted.length)
    {
        case 1: return new Execution(splitted[0], false, -1, signers);
        case 2: return new Execution(splitted[1], true, -1, signers);
        case 3: return  new Execution(splitted[2], false, splitted[1], signers);
        default: throw Error("Too many items in Execution");
    }
}

function parseSignerArray(content) {
    if (content[0] != '[') {
        throw Error("Signers in execution improperly formatted");
    }

    content = content.substring(1, content.indexOf(']'));
    const splitted = content.split(',');
    return splitted.map(x => x.trim());
}

// ------------------------------------ Main Method ------------------------------------ //
// may fail, propagate error
function templateParsePhase(templateFilePath) {
    const fileContents = readFileSync(templateFilePath, 'utf8');
    return parseTemplate(fileContents);
}

module.exports = {
    templateParsePhase
}