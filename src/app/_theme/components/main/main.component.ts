import { Component, OnInit, HostListener, ViewChild, Inject, PLATFORM_ID } from '@angular/core'; 
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { Category } from 'src/app/app.models';
import { SidenavMenuService } from '../sidenav-menu/sidenav-menu.service';
import { isPlatformBrowser } from '@angular/common';
import { BookingService } from 'src/app/booking.module/_services/booking.service';
import { ISpaceAvailablePriceModel } from 'src/app/host.module/_models/space-available-price.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [ SidenavMenuService ]
})
export class MainComponent implements OnInit {
  public showBackToTop:boolean = false; 
  public categories:Category[];
  public category:Category;
  public sidenavMenuItems:Array<any>;
  @ViewChild('sidenav', { static: true }) sidenav:any;

  public settings: Settings;
  constructor(
    public appSettings:AppSettings, 
    public appService:AppService, 
    public sidenavMenuService:SidenavMenuService,
    public router:Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    public bookingService: BookingService
  ) { 
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.getCategories();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
    setTimeout(() => {
      this.settings.theme = 'orange'; 
    });
  } 

  public getCategories(){    
    this.appService.getCategories().subscribe(data => {
      this.categories = data;
      this.category = data[0];
      this.appService.Data.categories = data;
    })
  }

  public changeCategory(event){
    if(event.target){
      this.category = this.categories.filter(category => category.name == event.target.innerText)[0];
    }
    if(window.innerWidth < 960){
      this.stopClickPropagate(event);
    } 
  }

  public remove(listingId, bookedSpace: ISpaceAvailablePriceModel) {
      this.bookingService.removeBookedSpace(listingId, bookedSpace);   
  }

  public clear(){
    this.bookingService.clearBookingList();  
  }
 

  public changeTheme(theme){
    this.settings.theme = theme;       
  }

  public stopClickPropagate(event: any){
    event.stopPropagation();
    event.preventDefault();
  }

  public search(){}

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
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0,0);
        }  
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;  
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        this.sidenav.close(); 
      }                
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
  }

  public closeSubMenus(){
    if(window.innerWidth < 960){
      this.sidenavMenuService.closeAllSubMenus();
    }    
  }

}