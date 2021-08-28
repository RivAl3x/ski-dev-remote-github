import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NominatimResponse} from '../_models/nominatim-response.model';
import {map} from 'rxjs/operators';

const BASE_NOMINATIM_URL: string = 'nominatim.openstreetmap.org';
const DEFAULT_VIEW_BOX: string = 'viewbox=-25.0000%2C70.0000%2C50.0000%2C40.0000';

@Injectable({ providedIn: 'root' })
export class NominatimService {

  constructor (private http: HttpClient) {
  }

  addressLookup (req?: any): Observable<NominatimResponse[]> {
    let url = `https://${BASE_NOMINATIM_URL}/search?format=json&q=${req}&${DEFAULT_VIEW_BOX}&bounded=1`;
    return this.http
      .get(url).pipe(
        map((data: any[]) => data.map((item: any) => new NominatimResponse(
          item.lat,
          item.lon,
          item.display_name
          ))
        )
      )
  }

}
