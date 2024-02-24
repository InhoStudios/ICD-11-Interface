const mysql = require("mysql2/promise");
let connection;
connect();

async function connect() {
    connection = await mysql.createPool({
        host: 'localhost',
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: 'ildsdb',
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    });
    console.log(`Connected`)
}

async function postQuery(query) {
    let [rows, fields] = await connection.execute(query);
    return rows;
}

async function select(values, from, where="true") {
    let query = `SELECT ${values} FROM ${from} WHERE ${where};`;
    return await postQuery(query);
}

async function insert(into, values) {
    let valueHeaders = Object.keys(values).join();
    let valueBody = Object.values(values).join();
    let query = `INSERT IGNORE INTO ${into} (${valueHeaders}) VALUES (${valueBody});`
    console.log(query);
    return await postQuery(query);
}

async function insertArray(into, values) {
    let valueHeaders = Object.keys(values[0]).join();
    let valuesArr = []
    for (let value of values) {
        let valueBody = Object.values(value).join();
        valuesArr.push(`(${valueBody})`);
    }
    let query = `INSERT IGNORE INTO ${into} (${valueHeaders}) VALUES ${valuesArr.join()};`
    console.log(query);
    return await postQuery(query);
}

async function insertParticipant(part) {
    let query = `INSERT IGNORE INTO Participant (participant_id, birth_date, gender, skin_type, ethnicity) VALUES ("${part.participant_id}", ${part.birth_date}, STR_TO_DATE("${part.gender}", "%m-%Y"), ${part.skin_type}, "${part.ethnicity}");`
    console.log(query);
    return await postQuery(query);
}

async function updateMeasurement(measurement) {
    return;
}

module.exports = {
    postQuery: postQuery,
    insert: insert,
    insertArray: insertArray,
    insertParticipant: insertParticipant,
    select: select,
};