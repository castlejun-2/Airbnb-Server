async function selectUserAlarm(connection, userId) {
    const selectAlarmQuery = `
        select ai.alarm as 알람,
        	case when TIMESTAMPDIFF(HOUR, ai.createdAt, current_timestamp()) < 24
		         then date_format(ai.createdAt,'%H:%i:%s')
                 else date_format(ai.createdAt,'%Y-%m-%d')
            end as 알람일자
        from AlarmInfo ai,UserInfo ui
        where ui.id = ai.userId and ui.id = ? and ai.status = 'ACTIVE'
        order by ai.createdAt DESC
    `;
    const [selectAlarmRow] = await connection.query(selectAlarmQuery, userId);
    return selectAlarmRow;
}
async function deleteMyAlarm(connection, userId, alarmId) {
    const deleteMyAlarmQuery = `
        UPDATE AlarmInfo
        SET status = 'DELETE'
        WHERE userId = ? and id = ?;
    `;
    const [deleteMyAlarmRow] = await connection.query(deleteMyAlarmQuery, [userId, alarmId]);
    return deleteMyAlarmRow;
}
module.exports = {
    selectUserAlarm,
    deleteMyAlarm,
}