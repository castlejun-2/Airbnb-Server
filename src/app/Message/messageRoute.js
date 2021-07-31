module.exports = function(app){
    const message = require('./messageController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 알람 조회 API
    app.get('/app/alarms', jwtMiddleware, message.getAlarm);

    // 2. 알람 삭제 API
    app.patch('/app/alarms/withdrawal', jwtMiddleware, message.deleteAlarm);
};
