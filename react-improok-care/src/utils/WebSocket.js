import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import cookie from "react-cookies";

var clientStomp = null;
var isToastDisplayed = false;

const connectNotification = (data) => {
    // isToastDisplayed = false;
    if (clientStomp !== null) {
        return;
    }
    let Sock = new SockJS('http://localhost:2024/IMPROOK_CARE/api/public/notification/');
    clientStomp = over(Sock);
    clientStomp.connect({}, () => onConnectedNotification(data, clientStomp), onErrorNotification);
    // return clientStomp;
};

const onConnectedNotification = (data, clientStomp) => {
    clientStomp.subscribe('/user/' + data + '/notification', onPrivateNotification);
    cookie.save("socket", clientStomp);
    // console.log(clientStomp);
};

const onErrorNotification = (err) => {
    console.log(err);
};

const onPrivateNotification = (payload) => {
    isToastDisplayed = false;
    console.log("ĐÂY LÀ PAYLOAD");
    console.log(payload);
    var payloadData = JSON.parse(payload.body);
    console.log("PAYLOAD LÀM SẠCH");
    console.log(payloadData);
    if (!isToastDisplayed) {
        toast.info(payloadData.notificationContent);
        isToastDisplayed = true; // Đánh dấu là đã hiển thị toast
    }
};

export const reConnectNotification = (isConnected, data) => {
    if (isConnected === false && clientStomp === null) {
        connectNotification(data);
    }
}