export const setUserInfo = (state, userInfo) => {
  state.userInfo = userInfo;
};

export const login = state => {
  state.isLogin = true;
};
export const logout = state => {
  state.isLogin = false;
};
