import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { MdCallEnd } from "react-icons/md";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { AiOutlineAudio, AiOutlineAudioMuted } from "react-icons/ai";

const VideoRoom = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const getVideo = async () => {
    let video = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMediaStream(video);
  };
  useEffect(() => {
    // getVideo();
  }, []);

  const handleCamera = () => {
    mediaStream
      ?.getTracks()
      .filter((track) => track.kind === "video")
      .map((track) => {
        track.enabled = false;
        track.stop();
      });
  };
  const handleMicrophone = () => {
    mediaStream
      ?.getTracks()
      .filter((track) => track.kind === "audio")
      .map((track) => {
        track.stop();
        track.enabled=false
      });
  };

  const getData = () => console.log(mediaStream?.getTracks());

  return (
    <div className="dark:text-white h-screen w-screen px-5 dark:bg-neutral-800">
      <div className="flex h-[92%] relative">
        {mediaStream && (
          <ReactPlayer
            playing
            width={"100%"}
            height={"100%"}
            url={mediaStream}
          />
        )}
        {mediaStream && (
          <ReactPlayer
            playing
            height={"15%"}
            width={"auto"}
            style={{ bottom: 0, right: 0, position: "absolute" }}
            url={mediaStream}
          />
        )}
      </div>
      <div className="flex h-[8%] justify-between items-center">
        <div className="">
          Room Id :
          <span className="text-xl ms-2 text-purple-500">xyz-123-ghgh</span>
        </div>
        <ul className="flex gap-5 items-center text-3xl bg-neutral-600 rounded-3xl my-2 mx-3 p-3">
          <li> </li>
          <li onClick={handleMicrophone} className="cursor-pointer ">
            {!mediaStream?.active ? (
              <AiOutlineAudioMuted />
            ) : (
              <AiOutlineAudio />
            )}{" "}
          </li>
          <li onClick={handleCamera} className="cursor-pointer ">
            {!mediaStream?.active ? <FaVideoSlash /> : <FaVideo />}{" "}
          </li>
          <li onClick={getData} className="cursor-pointer text-red-500">
            <MdCallEnd />{" "}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VideoRoom;
