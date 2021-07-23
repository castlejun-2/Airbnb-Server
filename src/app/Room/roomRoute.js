module.exports = function(app){
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 방 정보 조회 API (+ 검색)
    app.get('/app/rooms',room.getRooms);

};