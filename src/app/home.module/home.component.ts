import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Product } from "../app.models";
import { ListingModel } from '../host.module/_models/listing.model';
import { SearchResultsService } from '../search.module/_services/search-results.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public slides = [
    { title: 'Book 6000+ lessons and activities', subtitle: 'in over 500 winter destinations', image: 'assets/images/banner-ski-1.jpg' },
    { title: 'Book 6000+ lessons and activities', subtitle: 'in over 500 winter destinations', image: 'assets/images/banner-ski-2.jpg' }
  ];

  public brands = [];
  public banners = [];
  public featuredProducts: Array<Product>;
  public onSaleProducts: Array<Product>;
  public topRatedProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;

  public featuredListings: Array<ListingModel>;
  public latestListings: Array<ListingModel>;
  public imagesLoaded: boolean = false;



  constructor(
    public appService:AppService,
    public searchResultsService: SearchResultsService
  ) { }

  ngOnInit() {
    this.getBanners();
    this.getProducts("featured");
    this.getBrands();

    this.getListings("featured");
  }

  public onLinkClick(e){
    this.getProducts(e.tab.textLabel.toLowerCase()); 
  }

  public onTabChange(e){
    this.getListings(e.tab.textLabel.toLowerCase());
  }

  public getProducts(type){
    if(type == "featured" && !this.featuredProducts){
      this.appService.getProducts("featured").subscribe(data=>{
        this.featuredProducts = data;      
      }) 
    }
    if(type == "on sale" && !this.onSaleProducts){
      this.appService.getProducts("on-sale").subscribe(data=>{
        this.onSaleProducts = data;      
      })
    }
    if(type == "top rated" && !this.topRatedProducts){
      this.appService.getProducts("top-rated").subscribe(data=>{
        this.topRatedProducts = data;      
      })
    }
    if(type == "new arrivals" && !this.newArrivalsProducts){
      this.appService.getProducts("new-arrivals").subscribe(data=>{
        this.newArrivalsProducts = data;      
      })
    }
   
  }

  public getBanners(){
    this.appService.getBanners().subscribe(data=>{
      this.banners = data;
    })
  }

  public getBrands(){
    this.brands = this.appService.getBrands();
  }

  public getListings(type){
    if(type == "featured" && !this.featuredListings){
      this.searchResultsService.getListingsByType("featured").subscribe(data=>{
        console.info(data,"");
        this.featuredListings = data;
        let count = this.featuredListings.length;

        this.featuredListings.map((listing) => {
          this.searchResultsService.getListingImageById(listing.id).subscribe((imageResponse) => {
            listing.description.images[0] = imageResponse;

            count--;
            this.imagesLoaded = count == 0 ? false : true;
          });
        });
      })
    }
    if(type == "latest" && !this.latestListings){
      this.searchResultsService.getListingsByType("latest").subscribe(data=>{
        this.latestListings = data;
        let count = this.latestListings.length;

        this.latestListings.map((listing) => {
          this.searchResultsService.getListingImageById(listing.id).subscribe((imageResponse) => {
            listing.description.images[0] = imageResponse;

            count--;
            this.imagesLoaded = count == 0 ? false : true;
          });
        });
      })
    }
  }

}
