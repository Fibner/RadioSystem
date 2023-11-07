import axios from "axios";
import { config } from "../Constants";

const fetchUserSuccess = (userData) => ({
  type: "FETCH_USER_SUCCESS",
  payload: userData,
});

export const logoutUser = ()=>({
  type: "logoutUser"
})

export const fetchUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(config.url.API_URL + "/api/auth", { withCredentials: true });
      const userData = response.data.user;
      const admin = response.data.admin?true:null;
      userData.admin = admin;
      dispatch(fetchUserSuccess(userData));
    } catch (error) {
      // dispatch(fetchUserSuccess(null));
    }
  };
};
