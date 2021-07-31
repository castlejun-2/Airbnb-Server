module.exports = function(app){
    const reservation = require('./reservationController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 2. 회원의 이전 예약 기록 및 여행 예정 조회 API
    app.get('/app/travels', jwtMiddleware, reservation.getHistory);

    // 3. 여행 예약 API
    app.post('/app/reservations', jwtMiddleware, reservation.travelReservation);

    // 4. 거절된 예약 조회 API
    app.get('/app/rejections', jwtMiddleware, reservation.rejectReservation);

    // 5. 자신의 숙소 예약 현황 조회 API
    app.get('/app/hostreservations', jwtMiddleware, reservation.hostReservation);
};