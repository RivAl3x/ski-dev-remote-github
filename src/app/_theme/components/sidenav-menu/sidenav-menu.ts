import { SidenavMenu } from './sidenav-menu.model';

export const sidenavMenuItems = [ 
    new SidenavMenu (1, 'NAV.HOME', '/', null, null, false, 0),
    new SidenavMenu (50, 'Jewellery', '/products/jewellery', null, null, false, 0), 
    new SidenavMenu (51, 'Electronics', '/products/electronics', null, null, false, 0), 
    new SidenavMenu (52, 'Sports', '/products/sports', null, null, false, 0), 
    new SidenavMenu (60, 'NAV.PAGES', null, null, null, true, 0),   
    new SidenavMenu (61, 'NAV.SHOP', null, null, null, true, 60), 
    new SidenavMenu (62, 'NAV.ALL_PRODUCTS', '/products', null, null, false, 61),  
    new SidenavMenu (63, 'NAV.PRODUCT_DETAIL', '/products/2/PC All-in-One', null, null, false, 61), 
    new SidenavMenu (64, 'NAV.CART', '/cart', null, null, false, 61), 
    new SidenavMenu (65, 'NAV.CHECKOUT', '/checkout', null, null, false, 61),  
    new SidenavMenu (70, 'LOGIN', '/sign-in', null, null, false, 60), 
    new SidenavMenu (71, 'NAV.404_PAGE', '/404', null, null, false, 60), 
    new SidenavMenu (72, 'NAV.LANDING', '/landing', null, null, false, 60), 
    new SidenavMenu (80, 'NAV.CONTACT', '/contact', null, null, false, 0),  
    new SidenavMenu (90, 'NAV.ADMIN', '/admin', null, null, false, 0),  
    new SidenavMenu (140, 'Level 1', null, null, null, true, 0),
    new SidenavMenu (141, 'Level 2', null, null, null, true, 140),
    new SidenavMenu (142, 'Level 3', null, null, null, true, 141),
    new SidenavMenu (143, 'Level 4', null, null, null, true, 142),
    new SidenavMenu (144, 'Level 5', null, 'https://google.com', null, false, 143),
    new SidenavMenu (200, 'NAV.EXTERNAL_LINK', null, 'https://google.com', '_blank', false, 0)
]