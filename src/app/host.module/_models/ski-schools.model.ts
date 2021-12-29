import { SpokenLanguagesModel } from "./listing-spoken-languages.model";
import { ListingSkiLocationModel } from "./listing-ski-location.model";
import { ListingSkiPriceModel } from "./listing-ski-price.model";

export class SkiSchoolModel {

  id?: any;
  title?: any;
  authors?:Array<any>;
  edition?: any;
  year?: number;
  skiSchoolName?: any;
  about?: any;
  image?:any;
  description?:any;
  maximumParticipants?:any;
  minimumAge?:any;
  typeOfLessons?:any;
  reviews?:any;
  spokenLanguages?: SpokenLanguagesModel;
  location?: ListingSkiLocationModel;
  price?: ListingSkiPriceModel;



  public constructor(
    id: any = null,
    title: any= null,
    authors:Array<any>[]=[],
    edition:any= null,
    year:number= null,
    skiSchoolName:any= null,
    about:any= null,
    image:any=null,
    description:any=null,
    maximumParticipants:any=null,
    minimumAge:any=null,
    typeOfLessons:any=null,
    reviews:Array<any>[]=[],
    spokenLanguages:SpokenLanguagesModel= new SpokenLanguagesModel,
    location: ListingSkiLocationModel= new ListingSkiLocationModel,
    price:ListingSkiPriceModel = new ListingSkiPriceModel

    ){
      this.id = id;
      this.title = title;
      this.authors=authors;
      this.edition= edition;
      this.year= year;
      this.skiSchoolName= skiSchoolName;
      this.about= about;
      this.image=image;
      this.description=description;
      this.maximumParticipants=maximumParticipants;
      this.minimumAge=minimumAge;
      this.typeOfLessons=typeOfLessons;
      this.price=price;
      this.reviews=reviews;
      this.spokenLanguages=spokenLanguages;
      this.location=location;
      this.price=price;

    }
}


