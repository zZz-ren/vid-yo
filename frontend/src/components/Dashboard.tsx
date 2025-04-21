import toast from "react-hot-toast";
import { useLogoutMutation } from "../utils/api";
import { CustomButton, Input } from "./Forms/FormComponents";
import { useState } from "react";

const Dashboard = () => {
  const [roomId, setRoomId] = useState("");
  const [logoutFn] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      const response = await logoutFn().unwrap();
      if (response.success) {
        toast.success("logout successful");
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  };
  return (
    <div className="min-h-screen min-w-screen grid grid-cols-12 dark:text-white dark:bg-neutral-800">
      <div className="flex flex-col justify-center p-5 md:my-5 md:mx-9 md:p-15 col-span-12 md:col-span-6">
        <h3 className="text-2xl md:text-6xl">
          Video Calls and meetings for everyone
        </h3>
        <h5 className="text-base mt-3 md:text-xl">
          Crystal-clear video calls so smooth, it’s like chatting
          face-to-face—no lags, no drama, just pure connection magic.
        </h5>

        <div className="md:flex gap-4">
          <CustomButton onClick={handleLogout} placeholder="Create Meeting" />
          <div className="md:flex">
            <Input
              name="Room ID"
              placeholder="Enter Room Id"
              setValue={setRoomId}
              value={roomId}
              type="text"
            />
            <CustomButton
              style="dark:text-purple-200 text-purple-900 dark:hover:text-purple-400 px-5 py-3 rounded-2xl text-black dark:disabled:text-neutral-300 disabled:text-neutral-50 dark:disabled:bg-neutral-800/95 disabled:bg-neutral-50"
              isDisable={roomId.length <= 0}
              onClick={handleLogout}
              placeholder="Join"
            />
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-6 flex justify-center items-center">
        <div className="w-sm md:w-3/4 h-[550px]">
          <img src="/bg.jpg" alt="" />
        </div>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
