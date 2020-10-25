// import http from "boot/axios";
import axios from "axios";
export async function asyncSetUserInfo({ commit }, data) {
  sessionStorage.setItem("token", data.token);
  axios.defaults.headers.common["u-token"] = data.token;
  // console.log(data);
  // let tem = { GRID00: "01A264D90D445DFF0CD43F40CA00C4A503F8D132CBEF011D" };
  // const res = await http.post("/person/getPersonInfo", tem);
  // console.log(res);
  commit("setUserInfo", data);
  commit("login");
}
export const userLogout = ({ commit }, token) => {
  sessionStorage.removeItem("token");
  commit("setUserInfo", null);
  commit("logout");
};
