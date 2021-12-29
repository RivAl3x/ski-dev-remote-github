import { Menu } from './menu.model';

export const menuItems = [
  // new Menu (10, 'host-nav.dashboard', '/host/host-instructor-landing-page', null, 'monetization_on', null, false, 0),
    new Menu (10, 'host-nav.dashboard', '/host/dashboard', null, 'dashboard', null, false, 0),
    new Menu (20, 'host-nav.listings', '/host/listings', null, 'list', null, false, 0),
    new Menu (30, 'host-nav.add-listing', '/host/add-listing', null, 'add_circle_outline', null, false, 0),
    new Menu (40, 'host-nav.bookings', '/host/bookings', null, 'list_alt', null, false, 0),
    new Menu (50, 'host-nav.inhouse-booking', '/host/inhouse-booking', null, 'list_alt', null, false, 0),
    new Menu (60, 'host-nav.payments', '/host/payment-options', null, 'monetization_on', null, false, 0),
    new Menu (70, 'host-nav.conversations', '/host/chat', null, 'chat', null, false, 0),
]
