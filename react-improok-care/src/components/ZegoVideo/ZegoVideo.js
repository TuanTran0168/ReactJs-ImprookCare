import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { UserContext } from "../../App";

function randomID(len) {
    let result = "";
    if (result) return result;
    var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
        maxPos = chars.length,
        i;
    len = len || 5;
    for (i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

export function getUrlParams(url = window.location.href) {
    let urlStr = url.split("?")[1];
    return new URLSearchParams(urlStr);
}

export default function App() {
    const roomID = getUrlParams().get("roomID") || randomID(5);
    const [user, dispatch] = React.useContext(UserContext);
    let myMeeting = async (element) => {
        // generate Kit Token
        const appID = 440776203;
        const serverSecret = "9cb2d7299ba81dda9bbb06d688fd581c";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomID,
            randomID(5),
            user?.firstname + " " + user?.lastname
        );

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: "Personal link",
                    url:
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        window.location.pathname +
                        "?roomID=" +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
            },
            // showPreJoinView: false,
        });
    };

    return (
        <div
            className="myCallContainer"
            ref={myMeeting}
            style={{ width: "100vw", height: "100vh" }}
        ></div>
    );
}