module.exports = function(app){
    const message = require('./messageController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 알람 조회 API
    app.get('/app/alarms/:userId', message.getAlarm);
};
