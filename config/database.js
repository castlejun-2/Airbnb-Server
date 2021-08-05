const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: '', //RDS 서버 End point 설정
    user: '', //user의 계정명
    port: '3306',
    password: '', //DB Server password
    database: 'milli' //database schema
});

module.exports = {
    pool: pool
};
