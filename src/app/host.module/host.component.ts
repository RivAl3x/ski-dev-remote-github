import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AppSettings, Settings } from '../app.settings';
import { Router, NavigationEnd } from '@angular/router'; 
import { MenuService } from './_components/menu/menu.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../_core.module/auth.module/services/auth.service';

const languageKey = '__lang';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {
  @ViewChild('sidenav') sidenav:any;  
  public userImage = 'assets/images/others/admin.jpg'; 
  public settings:Settings;
  public menuItems:Array<any>;
  public toggleSearchBar:boolean = false;

  public currencies = ['EUR', 'USD'];
  public currency:any; 

  constructor(
    public appSettings:AppSettings, 
    public router:Router,
    private menuService: MenuService,
    public authService: AuthenticationService,
    public translateService: TranslateService
  ){        
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {  
    if(window.innerWidth <= 960){ 
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    }; 

    setTimeout(() => {
      this.settings.theme = 'orange'; 
    });

    this.currency = this.currencies[0];
    this.menuItems = this.menuService.getMenuItems();    
  }

  ngAfterViewInit(){  
    if(document.getElementById('preloader')){
      document.getElementById('preloader').classList.add('hide');
    } 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url == '/host/chat') {
          this.sidenav.close();
        }

        this.scrollToTop();
      } 
      if(window.innerWidth <= 960){
        this.sidenav.close(); 
      }                
    });  
    this.menuService.expandActiveSubMenu(this.menuService.getMenuItems());  
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
    else if(lang == 'ru'){
      return 'Russian';
    }
    else if(lang == 'tr'){
      return 'Turkish';
    }
    else{
      return 'English';
    }
  }

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(window.pageYOffset != 0){
         window.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);
    if(window.innerWidth <= 768){
      setTimeout(() => {  
        window.scrollTo(0,0); 
      });
    }
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    if(window.innerWidth <= 960){
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false; 
    }
    else{ 
      this.settings.adminSidenavIsOpened = true;
      this.settings.adminSidenavIsPinned = true;
    }
  }

}
