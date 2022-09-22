import axios from "axios";

const authProvider = {
  login: async ({ username, password }) => {
    const { data } = await axios.post('/auth/login', {
      username, password
    });
    localStorage.removeItem('need_login');
    localStorage.setItem('token', data.token);
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.setItem('need_login', true);
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () => localStorage.getItem('need_login')
    ? Promise.reject()
    : Promise.resolve(),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.setItem('need_login', true);
    return Promise.resolve();
  },
  getPermissions: async () => 'admin',
};

export default authProvider;
