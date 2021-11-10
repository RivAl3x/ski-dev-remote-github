import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/_core.module/auth.module/services/auth.service';
import { AuthGuard } from 'src/app/_core.module/common.module/guards/authGuard';
import { RoleAuthorizeGuard } from 'src/app/_core.module/common.module/guards/roleAuthorizeGuard';
import { SignalrService } from 'src/app/_shared/services/signalR.service';
import { AppService } from '../../../app.service';
import { Settings, AppSettings } from '../../../app.settings';

const languageKey = '__lang';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  public currencies = ['EUR', 'USD'];
  public currency:any;
  public chatUpdates: boolean = false;

  public settings: Settings;
  constructor(
    readonly guard: AuthGuard,
    readonly roleGuard: RoleAuthorizeGuard,
    public authService: AuthenticationService,
    public appSettings: AppSettings,
    public appService: AppService,
    public translateService: TranslateService,
    private signalrService: SignalrService,
    public router: Router
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.currency = this.currencies[0];

    this.signalrService.messages.subscribe((conversationId: any) => {
      // console.info('Signalr messages subscribe from top-menu comp --- ', conversationId);

      if (conversationId && this.router.url !== '/chat') {
        this.chatUpdates = true;
      }
    });
  }

  public resetChatUpdates() {
    this.chatUpdates = false;
  }

  public changeCurrency(currency){
    this.currency = currency;
  }

  public changeLang(lang:string){
    this.translateService.use(lang);
    localStorage.setItem(languageKey, lang);
  }

  public getLangText(lang){
    if(lang == 'de'){
      return 'German';
    }
    else if(lang == 'fr'){
      return 'French';
    }
    else if(lang == 'ro'){
      return 'Romanian';
    }
    else if(lang == 'tr'){
      return 'Turkish';
    }
    else{
      return 'English';
    }
  }

  public onSignOut() {
    console.info('onSignOut clicked');
    this.authService.logout();
  }

}
