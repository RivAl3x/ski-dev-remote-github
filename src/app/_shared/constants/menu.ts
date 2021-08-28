export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
}

const data: IMenuItem[] = [{
    id: 'home',
    icon: 'home',
    label: 'menu.home',
    to: '/home'
  },
  {
    id: 'routine',
    icon: 'sun',
    label: 'menu.routine',
    to: '/routine'
  },
  {
    id: 'dummy',
    icon: null,
    label: 'menu.dummy',
    to: '',
  },
  {
    id: 'settings',
    icon: 'cog',
    label: 'menu.settings',
    to: '/settings',
  },
  {
    id: 'account',
    icon: 'user',
    label: 'menu.account',
    to: '/account',
  }
];

export default data;
