import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapPopupService {
  constructor() { }

  makeListingPopup(result: any): string {
    if(result.description.images[0]) {
      return `` +
      `<div class="product-item"><a href="/search/results/${ result.id }" class="image-link" target="_blank"><img src="${ result.description.images[0].url}"></a></div>` +
      `<div>${ result.location.name }</div>` +
      `<div>From ${ result.price.listPrice } €/day</div>`
    }else {
      return `` +
      `<div class="product-item"><a href="/search/results/${ result.id }" class="image-link" target="_blank"><img src="assets/images/no-image.jpg"></a></div>` +
      `<div>${ result.location.name }</div>` +
      `<div>From ${ result.price.listPrice } €/day</div>`
    }
    
  }
}
