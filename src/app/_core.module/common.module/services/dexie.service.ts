import { Injectable } from '@angular/core';
import Dexie from 'dexie';


@Injectable({ providedIn: 'root' })
export class DexieService extends Dexie {
  constructor() {
    super('deskhubLocalDB');
    this.version(1).stores({
      listings: '++localId',
      bookings: 'id',
      listing_types: 'id',
      //6
      office_types: 'id',
      office_amenities: 'id',
      currencies: 'id',
      countries: 'id',
      government_id_types: 'id',
      genders: 'id',
      booking_filter_options: 'id',
      cancel_reasons: 'id'
    });
  }
}
