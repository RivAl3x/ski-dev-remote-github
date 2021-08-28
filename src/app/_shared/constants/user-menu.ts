export interface IUserMenuItem {
  id?: string;
  label: string;
  to: string;
  info?: boolean;
}

const data: IUserMenuItem[] = [{
    id: 'login',
    label: 'user.login-button',
    to: '/auth/login',
    info: false
  },
  {
    id: 'register',
    label: 'user.register-button',
    to: '/auth/register',
    info: false
  },
  {
    id: 'add-listing',
    label: 'user.add-listing',
    to: '/user/add-listing',
    info: false
  }

];

export default data;
