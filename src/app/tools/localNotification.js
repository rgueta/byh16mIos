import { LocalNotifications } from "@capacitor/local-notifications";

 function localNotification(msg){
    scheduleBasic(msg.title,msg.msg,msg.summary);
 }
    async function scheduleBasic(title,msg,summary){
    await LocalNotifications.schedule({
        notifications: [
        {
            title: title,
            body: msg,
            id:2,
            summaryText: summary,
            extra:{
            // data: 'Pass data to your handler'
            },
            iconColor:'#488AFF'
        }
        ]
    });
    }


export default localNotification;