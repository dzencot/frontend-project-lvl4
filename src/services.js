import Cookies from 'js-cookie';
import faker from 'faker';

const userNameCookieKey = 'SLACK_USER_NAME';

const getCurrentUserName = () => Cookies.get(userNameCookieKey);

const saveCurrentUserName = (userName) => {
  Cookies.set(userNameCookieKey, userName, { path: '' });
};

const getRandomUserName = () => faker.internet.userName();

export {
  saveCurrentUserName,
  getCurrentUserName,
  getRandomUserName,
};
