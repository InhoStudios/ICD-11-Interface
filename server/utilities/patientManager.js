var { LogEntry } = require("./Structures")

let counter = 0;
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
let curday = "000000"

/*
LOG: [
    {
        code: "", patient id
        initials: "", operator initials
        timestamp: ""
    }
]
*/

let log = []

function encode(input) {
    if (input === 0) {
        return alphabet[0];
    }

    let encodedString = ""
    let base = alphabet.length;
    while (input) {
        let index = input % base;
        input = Math.floor(input / base);
        encodedString = `${alphabet[index]}${encodedString}`;
    }

    return encodedString;
}

function id(initials) {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    let formattedMonth = month.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
    let formattedDay = day.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    let formattedCounter = encode(counter);

    let dateCode = `${year.toLocaleString('en-US').substring(3)}${formattedMonth}${formattedDay}`

    if (curday !== dateCode) {
        curday = dateCode;
        counter = 0;
    }

    console.log(`Current datecode: ${curday}. Generated datecode: ${dateCode}. Counter: ${counter}. Formatted counter: ${formattedCounter}.`)
    
    let patient_code = `${curday}${formattedCounter}`;
    let log_entry = new LogEntry(patient_code, initials, new Date().toLocaleTimeString());

    log.push(log_entry);

    counter++;

    return log_entry;
}

function getLog() {
    log.sort((a, b) => {
        if (b.timestamp < a.timestamp) {
            return -1;
        }
        if (b.timestamp > a.timestamp) {
            return 1;
        }
        return 0;
    });
    return log;
}

function strikeOut(entry, value) {
    let element = log.find(item => item.code === entry);
    element.unused = value;
}

module.exports = {
    id: id,
    getLog: getLog,
    strikeOut: strikeOut
};