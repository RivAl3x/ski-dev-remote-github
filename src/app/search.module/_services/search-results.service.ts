import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppHttpClient } from 'src/app/_core.module/common.module/services/httpClient.service';
import { ListingModel } from 'src/app/host.module/_models/listing.model';
import { ListingLocationModel } from 'src/app/host.module/_models/listing-location.model';
import { ListingDescriptionModel } from 'src/app/host.module/_models/listing-description.model';
import { ListingPriceModel } from 'src/app/host.module/_models/listing-price.model';
import { ListingHoursModel } from 'src/app/host.module/_models/listing-hours.model';
import { ListingPaymentModel } from 'src/app/host.module/_models/listing-payment.model';
import { ListingDocumentsModel } from 'src/app/host.module/_models/listing-documents.model';
import { SkiSchoolModel } from 'src/app/host.module/_models/ski-schools.model';


@Injectable({ providedIn: 'root' })
export class SearchResultsService {
  constructor(private apiClient: AppHttpClient,
     ) {}

  // getSearchResults(filters, extraFilters, pageNumber, pageSize) {
  //   const url = environment.databaseURL + 'Search/listing/-1';

  //   console.info('service getSearchResults filters: ', filters);
  //   console.info('service getSearchResults extraFilters: ', extraFilters);

  //   let params = new HttpParams();

  //       params = params.append('pageNumber', pageNumber + '');
  //       params = params.append('pageSize', pageSize + '');

  //       /* params = params.append('location', filters.location + '');
  //       params = params.append('officeTypes', filters.officeTypes + '');
  //       params = params.append('startDate', filters.startDate + '');
  //       params = params.append('seatsNo', filters.seatsNo + ''); */

  //       Object.keys(extraFilters).forEach(k => {
  //         params = params.append(k, extraFilters[k]);
  //       });

  //       //params = params.append('priceLevels', extraFilters.priceLevels + '');

  //   return this.apiClient.get(url, {params})
  //     .pipe(
  //       map((response: any) => {
  //         return response.data.map((apiListing) => {
  //           return this.listingApiResponseToModel(apiListing)
  //         });
  //       }),
  //       catchError(errorRes => {
  //         return throwError(errorRes);
  //       })
  //     );
  // }

  ////////START
  getSearchResultsSki(filters, extraFilters, pageNumber, pageSize) {
    const url = environment.apiUrl + 'Search/listing/-1';


    console.info('service getSearchResults FILTERS: ', filters);
    console.info('service getSearchResults EXTRAFILTERS: ', extraFilters);

    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '');

    Object.keys(extraFilters).forEach((k) => {
      params = params.append(k, extraFilters[k]);
    });

    //params = params.append('priceLevels', extraFilters.priceLevels + '');

    return this.apiClient.get(url, { params }).pipe(
      map((response: any) => {
        console.info("getSearchResultsSki din SERVICIU",response)
        return response;
      }),
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  getListingByIdSki(id: any ) {
    // const url = environment.apiUrl + 'Search/listing/' + id;
    // console.log(url);
    let arr = this.getSki();
    console.log(arr);
    var found = arr.find(doc=>doc.id == id);
    console.log(found);
    return found;


      // map((response: any) => {
      //   console.warn("getListingByIdSky api-response ----  ", response)
      // const found = response.find(doc=>doc.id == id)
      //   console.info("getListingByIdSki din SERVICIU- FULL ARRAY:",response)
      //   console.warn("getListingByIdSki din SERVICIU- OBJ FOUND:",found);

      //   return found;
      // }),
      // catchError((errorRes) => {
      //   return throwError(errorRes);
      // })

  }





  ///END

  getListingById(id: any = 1) {
    const url = environment.apiUrl + 'Search/image/' + id;

    return this.apiClient.get(url).pipe(
      map((response: any) => {
        return response
      }),
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  getListingsByType(type) {
    const url = environment.apiUrl + 'Search/images/' ;

    let params = new HttpParams();


    return this.apiClient.get(url, { params }).pipe(
      map((response: any) => {
        return response.data.map((apiListing) => {
          return response
        });
      }),
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }

  getListingImageById(id: any = 1) {
    const url = environment.apiUrl + 'Search/image/' + id;

    return this.apiClient.get(url).pipe(
      map((response: any) => {
        // console.info('getListingImagesById response -- ', response);
        return response.data;
      }),
      catchError((errorRes) => {
        console.info('error images: ', errorRes);
        return throwError(errorRes);
      })
    );
  }

  //start
  getListingImageByIdSki(id: any = 1) {
    const url = environment.apiUrl + 'Search/images/' + id;

    return this.apiClient.get(url).pipe(
      map((response: any) => {
        console.info('getListingImagesById response -- ', response);
        return response.data[0];
      }),
      catchError((errorRes) => {
        // console.info('error images: ', errorRes);
        return throwError(errorRes);
      })
    );
  }
  //end


  // private listingApiResponseToModel(apiListing: any) {
  //   let listing = new ListingModel(
  //     apiListing.id,
  //     '', //localId
  //     apiListing.idStatus,
  //     apiListing.statusCode,
  //     apiListing.modifiedDate,
  //     new ListingLocationModel(
  //       apiListing.location.name,
  //       apiListing.location.streetAddress,
  //       apiListing.location.apartmentSuite,
  //       apiListing.location.locality,
  //       apiListing.location.state,
  //       apiListing.location.zipCode,
  //       apiListing.location.idCountry,
  //       apiListing.location.country,
  //       {
  //         id: apiListing.location.idCountry,
  //         name: apiListing.location.country,
  //       },
  //       apiListing.location.latitude,
  //       apiListing.location.longitude,
  //       apiListing.location.listingId,
  //       apiListing.location.listingType
  //     ),
  //     new ListingDescriptionModel(
  //       apiListing.description.description,
  //       apiListing.description.officeTypes /* ? apiListing.description.officeTypes.map(a => a.id) : [] */,
  //       apiListing.description.availableSpaces,
  //       apiListing.description.availableSpacesCount,
  //       [], //images
  //       apiListing.description.amenities /* ? apiListing.description.amenities.map(a => a.id) : [] */
  //     ),
  //     new ListingPriceModel(
  //       apiListing.price ? apiListing.price.idCurrency : 1,
  //       apiListing.price && apiListing.price.listPrice
  //         ? apiListing.price.listPrice
  //         : 10,
  //       apiListing.price ? apiListing.price.availableSpacesPrice : []
  //     ),
  //     new ListingHoursModel(
  //       apiListing.hours ? apiListing.hours.availableHours : '',
  //       apiListing.hours ? apiListing.hours.fromHours : '',
  //       apiListing.hours ? apiListing.hours.toHours : '',
  //       apiListing.hours ? apiListing.hours.differentHours : '',
  //       apiListing.hours ? apiListing.hours.satOpen : '',
  //       apiListing.hours ? apiListing.hours.sunOpen : ''
  //     ),
  //     new ListingPaymentModel(apiListing.payment.id),
  //     new ListingDocumentsModel()
  //   );

  //   return listing;
  // }

  getOptionsFromApi(apiOption) {
    const url = environment.apiUrl + 'SP/comm.ctrl_' + apiOption;

    return this.apiClient.get(url).pipe(
      map((response: any) => {
        return response.data.map((option) => {
          return {
            ...option,
          };
        });
      })
    );
  }

  ////////
  // private listingApiResponseToModelSki(apiListing: any) {
  //   let listing = new SkiSchoolModel(
  //     apiListing.id,
  //     apiListing.title,
  //     apiListing.authors,
  //     apiListing.edition,
  //     apiListing.year,
  //     apiListing.skiSchoolName,
  //     apiListing.about,
  //     apiListing.image,
  //     apiListing.description,
  //     apiListing.maximumParticipants,
  //     apiListing.minimumAge
  //   );

  //   return listing;
  // }



      public getSki(){
        return [

              {
                "id": "1",
                "skiSchoolId": "65435634",
                "description": "Private Ski Lesson (All Levels)",
                "skiSchoolName": "Ski School Predeal",
                "typeOfLessons": "private",
                "maximumParticipants": 4,
                "minimumAge": 5,
                "price": 55,
                "ratingStars": "200",
                "ratingsCount": "3",
                "about": "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum ha",
                "image": "https://www.slovenija.eu.com/wp-content/uploads/2018/12/Ski-school-slovenia.jpg",
                "spokenLanguages":[{"code":"en", "src":"https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/ro.svg"},
                  {"code":"ro", "src":"https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/gb.svg"}]
              },
              {
                "id": "2",
                "skiSchoolId": "4324325",
                "description": "Adult Group Ski Lessons (All Levels)",
                "skiSchoolName": "Ski School Brasov",
                "typeOfLessons": "group",
                "maximumParticipants": 2,
                "minimumAge": 18,
                "price": 35,
                "ratingStars": "320",
                "ratingsCount": "4",
                "about": " Lorem Ipsum, you need to be sure ther eerror sit voluptatem accusantium   of text. ",
                "image": "https://media.istockphoto.com/photos/powder-skiing-picture-id623101316?k=20&m=623101316&s=612x612&w=0&h=dUdFM4jtoQyxTmgsg--m6bIvtBiocaR9Qn6avNzDBBw=",
                "spokenLanguages":[{"code":"en", "src":"https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/ro.svg"}]
              },
              {
                "id": "3",
                "skiSchoolId": "8766966",
                "description": "Private Off Piste Guiding",
                "skiSchoolName": "Ski School Sinaia",
                "typeOfLessons": "private",
                "maximumParticipants": 8,
                "minimumAge": 16,
                "price": 62,
                "ratingStars": "1900",
                "ratingsCount": "10",
                "about": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium dolomnis iste natus error sit voluptatem accusantium doloremque lamnis iste natus error sit voluptatem accusantium doloremque laremque laudantium",
                "image": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2tpfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
                "spokenLanguages":[{"code":"en", "src":"https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/ro.svg"},
                  {"code":"ro", "src":"https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/gb.svg"}]
              },
              {
                "id": 4,
                "skiSchoolId": "543543543",
                "description": "Ski School Bușteni",
                "skiSchoolName": "Ski School Bușteni",
                "typeOfLessons": "private",
                "maximumParticipants": 4,
                "minimumAge": 18,
                "price": 45,
                "ratingStars": "1900",
                "ratingsCount": "10",
                "about": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium",
                "image": "https://res.cloudinary.com/whistler/image/upload/w_500,c_scale,dpr_3.0,q_auto/v1/s3/images/header/kids-ski-lessons-whistler.jpg",
                "spokenLanguages":[
                  {"code":"ro", "src":"https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/gb.svg"}]
              }
            ]
          }
}
