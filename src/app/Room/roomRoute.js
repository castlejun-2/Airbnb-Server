module.exports = function(app){
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // 1. 숙소 등록 (회원가입) API
    app.post('/app/rooms', room.postRooms);

    // 2. 숙소 정보 조회 API (+ 방 이름 검색)
    app.get('/app/rooms', room.getRooms);

    // 3. 특정 숙소 조회 API (국가를 통한 검색)
    app.get('/app/rooms/:country', room.getRoomByCountry);

    // 4. 숙소 규칙 조회 API
    app.get('/app/roomrule/:roomName', room.getRoomRules);

    // 5. 자신이 등록한 숙소 조회 API
    app.get('/app/hostrooms/:userId', room.getMyRoom);

};