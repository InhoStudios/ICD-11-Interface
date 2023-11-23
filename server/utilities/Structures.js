const ICD = {
    TOKEN_HOST: "icdaccessmanagement.who.int",
    TOKEN_PATH: "/connect/token",
    TOKEN_URL: "https://icdaccessmanagement.who.int/connect/token",
    SCOPE: "icdapi_access",
    GRANT_TYPE: "client_credentials",
    QUERY_HOST: "https://id.who.int"
}

const METHODS = {
    GET: "GET",
    POST: "POST"
}

class Case {
    caseID;
    title;
    age;
    sex;
    history;
    ethnicity;
    userEntity;
    clinicianEntity;
    pathologistEntity;
    anatomicSite;
    size;
    severity;
    fitzpatrickType;
    tags;
}

class Image {
    imgtype;
}

class LogEntry {
    code;
    initials;
    timestamp;
    unused;

    constructor(code, initials, timestamp) {
        this.code = code;
        this.initials = initials;
        this.timestamp = timestamp;
        this.unused = false;
    }
}

module.exports.ICD = ICD;
module.exports.Case = Case;
module.exports.METHODS = METHODS;
module.exports.LogEntry = LogEntry;