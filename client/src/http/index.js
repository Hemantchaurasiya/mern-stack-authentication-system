import axios from "axios";

var apiInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
});

apiInstance.interceptors.request.use(
    (config) => {
        const access_token = JSON.parse(localStorage.getItem("user")).access_token;
        if (access_token) {
          config.headers["authorization"] = `Bearer ${JSON.parse(localStorage.getItem("user")).access_token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
);

apiInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            let RefreshToken = JSON.parse(localStorage.getItem("user")).refresh_token;
            let userData = JSON.parse(localStorage.getItem("user")).userData;
            console.log(RefreshToken);
            const {data} = await apiInstance.post("auth/refresh-token",{refresh_token:RefreshToken});
            localStorage.setItem("user", JSON.stringify({access_token:data.access_token,refresh_token:data.refresh_token,userData:userData}));
            return apiInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      return Promise.reject(err);
    }
  );
  

// logout user
export const Logout = async(e)=>{
    e.preventDefault();
    try {
        let refresh_token = JSON.parse(localStorage.getItem("user")).refresh_token;
        const {data} = await apiInstance.post(process.env.REACT_APP_API_URL+"auth/logout",{refresh_token});
        localStorage.removeItem("user");
        return data;
    } catch (error) {
        console.log(error);
    }
}
export default apiInstance;