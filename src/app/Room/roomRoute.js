module.exports = function(app){
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // 6. 숙소 등록 API
    app.post('/app/rooms', room.postRooms);

    // 7. 숙소 정보 조회 API (+ 방 이름 검색)
    app.get('/app/rooms', room.getRooms);

    // 8. 특정 숙소 조회 API (국가를 통한 검색)
    app.get('/app/rooms/:country', room.getRoomByCountry);

    // 9. 숙소 규칙 조회 API
    app.get('/app/roomrule/:roomName', room.getRoomRules);

    // 10. 자신이 등록한 숙소 조회 API
    app.get('/app/hostrooms/:userId', room.getMyRoom);

    // 11. 숙소 상태 변경 API
    app.patch('/app/rooms/:roomName/withdrawal', room.updateRoom);

};