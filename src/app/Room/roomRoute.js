module.exports = function(app){
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    
    // 6. 숙소 등록 API
    app.post('/app/rooms',jwtMiddleware, room.postRooms);

    // 7. 숙소 정보 조회 API (+ 방 이름 검색)
    app.get('/app/rooms', room.getRooms);

    // 8. 특정 숙소 조회 API (국가를 통한 검색)
    app.get('/app/rooms/:country', room.getRoomByCountry);

    // 9. 숙소 규칙 조회 API
    app.get('/app/room-rules/:roomid', room.getRoomRules);

    // 10. 자신이 등록한 숙소 조회 API
    app.get('/app/host-rooms',jwtMiddleware, room.getMyRoom);

    // 11. 숙소 상태 변경 API (삭제)
    app.patch('/app/rooms/:roomid/withdrawal',jwtMiddleware, room.deleteRoom);

    // 21. 숙소 상태 변경 API (운영정지)
    app.patch('/app/rooms/:roomid/stop',jwtMiddleware, room.stopRoom);

    // 22. 숙소 상태 변경 API (휴식모드)
    app.patch('/app/rooms/:roomid/rest',jwtMiddleware, room.restRoom);

    // 14. 숙소 정보 변경 API (숙소 이름)
    app.patch('/app/rooms/:roomid/title',jwtMiddleware, room.updateTitle);

};