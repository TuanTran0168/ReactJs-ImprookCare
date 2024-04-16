import React, { useContext, useEffect, useRef, useState } from "react";
import "./VideoCall.css";
import { UserContext } from "../../App";

const VideoCall = () => {
  const [current_user] = useContext(UserContext);
  const selfViewRef = useRef(null);
  const remoteViewRef = useRef(null);
  const audioSelectRef = useRef(null);
  const videoSelectRef = useRef(null);
  const [audioSource, setAudioSource] = useState("");
  const [videoSource, setVideoSource] = useState("");

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const handleToggleMicrophone = () => {
    setIsMicrophoneOn((prevMicrophoneState) => !prevMicrophoneState);
  };

  useEffect(() => {
    let signalingChannel;
    const pc = new RTCPeerConnection();
    let isPolite;
    let makingOffer = false;
    let ignoreOffer = false;

    const selfView = selfViewRef.current;
    const remoteView = remoteViewRef.current;
    const audioSelect = audioSelectRef.current;
    const videoSelect = videoSelectRef.current;

    const handleSignalingMessage = async ({ data }) => {
      const { polite, description, candidate } = JSON.parse(data);

      if (polite) {
        isPolite = polite;
      }

      try {
        if (description) {
          const offerCollision =
            description.type === "offer" &&
            (makingOffer || pc.signalingState !== "stable");

          ignoreOffer = offerCollision && !isPolite;
          if (ignoreOffer) {
            return;
          }

          await pc.setRemoteDescription(description);
          if (description.type === "offer") {
            await pc.setLocalDescription();
            signalingChannel.send(
              JSON.stringify({ description: pc.localDescription })
            );
          }
        } else if (candidate) {
          try {
            await pc.addIceCandidate(candidate);
          } catch (error) {
            if (!ignoreOffer) {
              throw error;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleTrackEvent = ({ track }) => {
      console.log("Received remote track(s) ...");
      remoteView.srcObject = new MediaStream();
      remoteView.srcObject.addTrack(track);
    };

    const handleNegotiationNeeded = async () => {
      console.log("Negotiation is starting ...");
      try {
        makingOffer = true;
        await pc.setLocalDescription();
        signalingChannel.send(
          JSON.stringify({ description: pc.localDescription })
        );
      } catch (error) {
        console.log(error);
      } finally {
        makingOffer = false;
      }
    };

    const handleIceCandidate = ({ candidate }) => {
      if (candidate) {
        signalingChannel.send(JSON.stringify({ candidate: candidate }));
      }
    };

    // const getDevices = async () => {
    //     const mediaDevices = await navigator.mediaDevices.enumerateDevices();

    //     mediaDevices.forEach((device) => {
    //         const option = document.createElement("option");
    //         option.value = device.deviceId;
    //         option.text = device.label;

    //         if (device.kind === "videoinput") {
    //             videoSelect.appendChild(option);
    //         } else if (device.kind === "audioinput") {
    //             audioSelect.appendChild(option);
    //         }
    //     });
    // };

    const getDevices = async () => {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();

      // Xóa các tùy chọn hiện có
      audioSelect.innerHTML = "";
      videoSelect.innerHTML = "";

      mediaDevices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label;

        if (device.kind === "videoinput") {
          videoSelect.appendChild(option);
        } else if (device.kind === "audioinput") {
          audioSelect.appendChild(option);
        }
      });
    };

    const start = async () => {
      if (window.stream) {
        window.stream.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        audio: { deviceId: { ideal: audioSource } },
        video: { deviceId: { ideal: videoSource } },
      };

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        window.stream = mediaStream;
        mediaStream.getTracks().forEach((track) => pc.addTrack(track));
        selfView.srcObject = mediaStream;
      } catch (error) {
        if (error.name === "OverconstrainedError") {
          console.log("Không thể đáp ứng các ràng buộc phương tiện yêu cầu.");
        } else {
          console.log("Lỗi khi truy cập thiết bị phương tiện:", error);
        }
      }
    };

    const handleAudioChange = () => {
      setAudioSource(audioSelect.value);
    };

    const handleVideoChange = () => {
      setVideoSource(videoSelect.value);
    };

    const initVideoChat = async () => {
      signalingChannel = new WebSocket(
        "ws://localhost:2024/IMPROOK_CARE/api/public/video-chat/"
        // "ws://springboot-improokcare-production.up.railway.app/IMPROOK_CARE/api/public/video-chat/"
      );

      signalingChannel.onmessage = handleSignalingMessage;

      pc.ontrack = handleTrackEvent;

      pc.onnegotiationneeded = handleNegotiationNeeded;

      pc.onicecandidate = handleIceCandidate;

      audioSelect.addEventListener("change", handleAudioChange);
      videoSelect.addEventListener("change", handleVideoChange);

      await getDevices();
      await start();
    };

    initVideoChat();

    // return () => {
    //   // Clean up code (if needed)
    // };
  }, [audioSource, videoSource]);

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    const videoElement = document.getElementById("selfView");
    const imageElement = document.getElementById("selfImage");

    if (videoElement.style.display === "none") {
      videoElement.style.display = "block";
      imageElement.style.display = "none";
    } else {
      videoElement.style.display = "none";
      imageElement.style.display = "block";
    }
  };

  return (
    <>
      <div className="video_call_wrapper">
        <div className="video_call_header">
          <button>Tạo cuộc họp</button>
          <button>Tham gia cuộc họp</button>
        </div>
        <div className="video_call_content">
          <div className="video">
            <video
              id="selfView"
              autoPlay
              ref={selfViewRef}
              muted={!isMicrophoneOn}
            ></video>
            <img
              id="selfImage"
              src={current_user?.avatar}
              alt="User"
              style={{ display: "none", width: "50%" }}
            />
            <video id="remoteView" autoPlay ref={remoteViewRef}></video>
          </div>
          <div className="controls">
            <button onClick={toggleCamera}>
              {isCameraOn ? "Tắt Camera" : "Bật Camera"}
            </button>
            <button onClick={handleToggleMicrophone}>
              {isMicrophoneOn ? "Tắt Micro" : "Bật Micro"}
            </button>
            <button onClick={handleToggleMicrophone}>
              {isMicrophoneOn ? "Tắt Micro" : "Bật Micro"}
            </button>
          </div>
          <div className="select">
            <label htmlFor="audioSource">Audio source: </label>
            <select id="audioSource" ref={audioSelectRef}></select>
          </div>
          <div className="select">
            <label htmlFor="videoSource">Video source: </label>
            <select id="videoSource" ref={videoSelectRef}></select>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCall;
