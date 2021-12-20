import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { TranslateService } from '@ngx-translate/core';
import { LocalDBService } from './_core.module/common.module/services/localDb.service';
import { SignalrService } from './_shared/services/signalR.service';
import { CurrentUser } from './_core.module/common.module/services/currentuser.service';

const languageKey = '__lang';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading: boolean = false;
  public settings: Settings;

  defaultLanguage = localStorage.getItem(languageKey) || 'en';

  constructor(
    public localDBService: LocalDBService,
    public signalR: SignalrService,
    public currentUser: CurrentUser,
    public appSettings: AppSettings,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    public translate: TranslateService
  ){
    this.settings = this.appSettings.settings;
    translate.addLangs(['en','fr']);
    translate.setDefaultLang(this.defaultLanguage);
    translate.use(this.defaultLanguage);

    localStorage.setItem(languageKey, this.defaultLanguage);

    localDBService.syncListOptions();
  }

  ngOnInit() {
    //this.localDBService.syncListOptions();
    if (this.currentUser.isAuthenticated) this.subscribeToChatUpdates();
  }

  private subscribeToChatUpdates() {
    this.signalR.initiateSignalrConnection();
    this.signalR.messages.subscribe((conversationId: any) => {
        // console.info('Signalr messages subscribe from auth service --- ', conversationId);
    });
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0,0);
        }
      }
    })
  }
}
