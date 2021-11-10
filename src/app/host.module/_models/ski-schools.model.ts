import { SpokenLanguagesModel } from "./listing-spoken-languages.model";

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
  price?:number;
  spokenLanguages?: SpokenLanguagesModel;



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
    price:number=null,
    spokenLanguages:SpokenLanguagesModel= new SpokenLanguagesModel

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
      this.spokenLanguages=spokenLanguages;

    }
}


