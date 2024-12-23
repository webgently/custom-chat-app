import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { notificationActions } from "../store/notificationSlice";

const token = JSON.parse(localStorage.getItem("token"));

// Create an Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/api`, // Replace with your server's base URL
  headers: {
    "Content-Type": "application/json",
    "x-auth-token": token,
  },
});

const useFetch = ({ method, url }, successFn, errorFn) => {
  const [requestState, setRequestState] = useState();
  const dispatch = useDispatch();

  const requestFunction = async (values) => {
    try {
      setRequestState("loading");

      const config = {
        method: method.toUpperCase(),
        url,
        ...(method.toUpperCase() !== "GET" && { data: values }),
      };

      const response = await axiosInstance(config);
      const data = response.data;

      setRequestState("success");
      successFn && successFn(data);
      return data;
    } catch (error) {
      setRequestState("error");

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      dispatch(
        notificationActions.addNotification({
          message: errorMessage,
          type: "error",
        })
      );

      errorFn && errorFn(error);
    }
  };

  return {
    reqState: requestState,
    reqFn: requestFunction,
  };
};

export default useFetch;
