import { Component, OnInit, Input } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface, SwiperScrollbarInterface } from 'ngx-swiper-wrapper';
import { AuthenticationService } from 'src/app/_core.module/auth.module/services/auth.service';
import { RoleAuthorizeGuard } from 'src/app/_core.module/common.module/guards/roleAuthorizeGuard';
import { ListingsService } from '../_services/listings.service';
import { SkiSchoolModel } from '../_models/ski-schools.model';



import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';



@Component({
  selector: 'app-host-instructor-registration-langing-page',
  templateUrl: './host-instructor-registration-langing-page.component.html',
  styleUrls: ['./host-instructor-registration-langing-page.component.scss']
})
export class HostInstructorRegistrationLangingPageComponent implements OnInit {

  brands: Array<any> = [
    { name: 'aloha', image: 'assets/images/brands/aloha.png' },
    { name: 'dream', image: 'assets/images/brands/dream.png' },
    { name: 'congrats', image: 'assets/images/brands/congrats.png' },
    { name: 'best', image: 'assets/images/brands/best.png' },
    { name: 'original', image: 'assets/images/brands/original.png' },
    { name: 'retro', image: 'assets/images/brands/retro.png' },
    { name: 'king', image: 'assets/images/brands/king.png' },
    { name: 'love', image: 'assets/images/brands/love.png' },
    { name: 'the', image: 'assets/images/brands/the.png' },
    { name: 'easter', image: 'assets/images/brands/easter.png' },
    { name: 'with', image: 'assets/images/brands/with.png' },
    { name: 'special', image: 'assets/images/brands/special.png' },
    { name: 'bravo', image: 'assets/images/brands/bravo.png' }
];;

public config: SwiperConfigInterface = {

};

  //extra filters
  public filters: any;
  public extraFilters: any;
  public pageNumber = 1;
  public pageSize = 2;
  // get listings from hard-coded json
  public listings: SkiSchoolModel[];
  // get reviews
  public reviews=[];

  constructor(
    readonly roleGuard: RoleAuthorizeGuard,
    public authService: AuthenticationService,
    private listingsService: ListingsService,
  ) { }

  ngOnInit(): void {

    this.getListingsForCards();

    this.logRandomReview();
  }

  ngAfterViewInit(){
    this.config = {
      slidesPerView: 7,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 1000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide",
      breakpoints: {
        240: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3
        },
        960: {
          slidesPerView: 4
        },
        1280: {
          slidesPerView: 5
        },
        1500: {
          slidesPerView: 6
        }
      }
    }
  }

  onClickConsoleLog(){
    console.log("button clicked")
  }

  public getListingsForCards(){
    this.listingsService.getListingsForCards(
   )
      .subscribe(response => {
      this.listings = response;
      console.log("getListings =>",this.listings, typeof this.listings);

       this.reviews=response.map(( {id, reviews} ) =>  ({id, reviews}) )
      console.log(this.reviews)



    })
  }



  public getBrands(){
    return [
        { name: 'aloha', image: 'assets/images/brands/aloha.png' },
        { name: 'dream', image: 'assets/images/brands/dream.png' },
        { name: 'congrats', image: 'assets/images/brands/congrats.png' },
        { name: 'best', image: 'assets/images/brands/best.png' },
        { name: 'original', image: 'assets/images/brands/original.png' },
        { name: 'retro', image: 'assets/images/brands/retro.png' },
        { name: 'king', image: 'assets/images/brands/king.png' },
        { name: 'love', image: 'assets/images/brands/love.png' },
        { name: 'the', image: 'assets/images/brands/the.png' },
        { name: 'easter', image: 'assets/images/brands/easter.png' },
        { name: 'with', image: 'assets/images/brands/with.png' },
        { name: 'special', image: 'assets/images/brands/special.png' },
        { name: 'bravo', image: 'assets/images/brands/bravo.png' }
    ];
}

// reviews = [
  // { idRef: '1', content: '1AAAAA' },
  // { idRef: '1', content: '1BBBBB' },
  // { idRef: '1', content: '1CCCCC' },
  // { idRef: '2', content: '2AAAAA' },
  // { idRef: '2', content: '2BBBBB' },
  // { idRef: '2', content: '2CCCCC' },
  // { idRef: '2', content: '2DDDDD' },
  // { idRef: '3', content: '3AAAAA' }

// ];
randomReview = this.reviews[Math.floor(Math.random() * this.reviews.length)];

logRandomReview(){
  console.log(this.randomReview);

}

}
