import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { MatDialog } from '@angular/material/dialog';
import { Data, AppService } from '../../../app.service';
import { Product } from "../../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'app-listings-carousel',
  templateUrl: './listings-carousel.component.html',
  styleUrls: ['./listings-carousel.component.scss']
})
export class ListingsCarouselComponent implements OnInit {

  @Input('listings') listings: Array<Product> = [];
  public config: SwiperConfigInterface = {};
  public settings: Settings;
  constructor(
    public appSettings:AppSettings,
    public appService:AppService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    console.info("Listings ***",this.listings)
  }

  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 1
        },
        740: {
          slidesPerView: 2
        },
        960: {
          slidesPerView: 3
        },
        1280: {
          slidesPerView: 4
        },
        1500: {
          slidesPerView: 5
        }
      }
    }
  }



}
