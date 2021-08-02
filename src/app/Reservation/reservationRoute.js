module.exports = function(app){
    const reservation = require('./reservationController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 2. 회원의 이전 예약 기록 및 여행 예정 조회 미리보기 API
    app.get('/app/travels', jwtMiddleware, reservation.getHistory);

    // 3. 여행 예약 API
    app.post('/app/reservations', jwtMiddleware, reservation.travelReservation);

    // 4. 거절된 예약 조회 API
    app.get('/app/rejection-reservations', jwtMiddleware, reservation.rejectReservation);

    // 5. 자신의 숙소 예약 현황 조회 API
    app.get('/app/host-reservations', jwtMiddleware, reservation.hostReservation);

    // 25. 이전 예약 숙소 세부정보 확인 API
    app.get('/app/last-reservation/:reservationid', jwtMiddleware, reservation.lastReservation);

};