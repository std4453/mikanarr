import axios from "axios";

const authProvider = {
  login: async ({ username, password }) => {
    const { data } = await axios.post('/auth/login', {
      username, password
    });
    localStorage.setItem('token', data.token);
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () => localStorage.getItem('token')
    ? Promise.resolve()
    : Promise.reject(),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  getPermissions: async () => 'admin',
};

export default authProvider;
