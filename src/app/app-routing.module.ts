import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SearchDetailsComponent } from './search.module/search-details/search-details.component';
import { AuthGuard } from './_core.module/common.module/guards/authGuard';
import { MainComponent } from './_theme/components/main/main.component';


let routes: Routes = [
  {
    path: '',
    component: MainComponent, children: [
        { path: '', loadChildren: () => import('./home.module/home.module').then(m => m.HomeModule) },
        { path: 'account', loadChildren: () => import('./account.module/account.module').then(m => m.AccountModule), canActivate: [AuthGuard] },
        { path: 'search', loadChildren: () => import('./search.module/search.module').then(m => m.SearchModule) },
        { path: 'booking', loadChildren: () => import('./booking.module/booking.module').then(m => m.BookingModule) },
        { path: 'chat', loadChildren: () => import('./chat.module/chat.module').then(m => m.ChatModule), canActivate: [AuthGuard] },

    ],
  },

  { path: 'host', loadChildren: () => import('./host.module/host.module').then(m => m.HostModule), canActivate: [AuthGuard] },
  /* { path: 'chat', loadChildren: () => import('./chat.module/chat.module').then(m => m.ChatModule), canActivate: [AuthGuard] }, */

  //{ path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
        relativeLinkResolution: 'legacy',
        initialNavigation: 'enabled'  // for one load page, without reload
        // useHash: true
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
