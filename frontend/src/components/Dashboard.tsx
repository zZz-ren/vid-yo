import toast from "react-hot-toast";
import { useLogoutMutation } from "../utils/api";

const Dashboard = () => {
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
    <div>
      Dashboard
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
