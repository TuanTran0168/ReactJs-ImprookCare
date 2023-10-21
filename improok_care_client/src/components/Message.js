import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { MyUserContext } from "../App";
import message from "../assests/images/message.png"
import printer from "../assests/images/printer.png"
import profileicon from "../assests/images/profile-icon.png"
import { authApi, endpoints } from "../configs/Apis";

const Message = () => {

    const [current_user, dispatch] = useContext(MyUserContext);
    const { profileDoctorId } = useParams();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [listMessage, setListMessage] = useState([]);
    // const [selectedProfile, setSelectedProfile] = useState();
    // const [profilePatient, setProfilePatient] = useState([]);

    const [userMessage, setUserMessage] = useState([]);

    const viewMessageUser = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                const res = await authApi().get(endpoints['get-message-for-doctor-view'](profileDoctorId, current_user.userId));
                setListMessage(res.data.content);
                console.log(res.data.content);
                console.log(listMessage);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    return <>
        <div class="Message_Wrapper">
            <div class="Message">
                Hello
            </div>
        </div>
    </>
}

export default Message;