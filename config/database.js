const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'database-1.cndywyl1g5hh.ap-northeast-2.rds.amazonaws.com', //RDS 서버 End point 설정
    user: 'millidb', //user의 계정명
    port: '3306',
    password: 'vibccku2!', //고유 password
    database: 'milli' //database schema
});

module.exports = {
    pool: pool
};
