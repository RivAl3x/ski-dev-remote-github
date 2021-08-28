export class Booking {
    constructor(
        public listingId: number,
        public id: number,
        public name: string,
        public description: string,
        public images: Array<any>,
        public price: number,
        public availibilityCount: number,
        public bookingCount: number,
    ){ }
}