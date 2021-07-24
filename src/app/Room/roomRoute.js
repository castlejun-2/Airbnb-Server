module.exports = function(app){
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // 1. 방 생성 (회원가입) API
    app.post('/app/rooms', room.postRooms);

    // 2. 방 정보 조회 API (+ 방 이름 검색)
    app.get('/app/rooms',room.getRooms);

    // 3. 특정 방 조회 API (국가를 통한 검색)
    app.get('/app/rooms/:country', room.getRoomByCountry);

    

};