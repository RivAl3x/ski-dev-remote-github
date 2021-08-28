import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, Product } from './app.models';
import { environment } from 'src/environments/environment';  

export class Data {
    constructor(public categories: Category[],
                public compareList: Product[],
                public wishList: Product[],
                public bookingList: Product[],
                public totalPrice: number,
                public totalBookingCount: number) { }
}

@Injectable()
export class AppService {
    public Data = new Data(
        [], // categories
        [], // compareList
        [],  // wishList
        [],  // bookingList
        null, //totalPrice,
        0 //totalBookingCount
    )
    
    public url = environment.url + '/assets/data/'; 

    constructor(public http:HttpClient, public snackBar: MatSnackBar) { }
    
    public getCategories(): Observable<Category[]>{
        return this.http.get<Category[]>(this.url + 'categories.json');
    }
   
    public getProducts(type): Observable<Product[]>{        
        return this.http.get<Product[]>(this.url + type + '-products.json');
    }

    public getProductById(id): Observable<Product>{
        return this.http.get<Product>(this.url + 'product-' + id + '.json');
    }

    public getBanners(): Observable<any[]>{
        return this.http.get<any[]>(this.url + 'banners.json');
    }

    public addToCompare(product:Product){
        let message, status;
        if(this.Data.compareList.filter(item=>item.id == product.id)[0]){
            message = 'The product ' + product.name + ' already added to comparison list.'; 
            status = 'error';     
        }
        else{
            this.Data.compareList.push(product);
            message = 'The product ' + product.name + ' has been added to comparison list.'; 
            status = 'success';  
        }
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    public addToWishList(product:Product){
        let message, status;
        if(this.Data.wishList.filter(item=>item.id == product.id)[0]){
            message = 'The product ' + product.name + ' already added to wish list.'; 
            status = 'error';     
        }
        else{
            this.Data.wishList.push(product);
            message = 'The product ' + product.name + ' has been added to wish list.'; 
            status = 'success';  
        }
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    } 

    public addToBookingList(booking){
        let message, status;        
       
        this.Data.totalPrice = null;
        this.Data.totalBookingCount = null;

        if(this.Data.bookingList.filter(item=>item.id == booking.id)[0]){ 
            let item = this.Data.bookingList.filter(item=>item.id == booking.id)[0];
            item.cartCount = booking.cartCount;  
        }
        else{           
            this.Data.bookingList.push(booking);
        }        
        this.Data.bookingList.forEach(booking=>{
            this.Data.totalPrice = this.Data.totalPrice + (booking.cartCount * booking.newPrice);
            this.Data.totalBookingCount = this.Data.totalBookingCount + booking.cartCount;
        });

        message = 'Your booking has been added to the booking list!'; 
        status = 'success';          
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    public resetProductCartCount(product:Product){
        product.cartCount = 0;
        let compareProduct = this.Data.compareList.filter(item=>item.id == product.id)[0];
        if(compareProduct){
            compareProduct.cartCount = 0;
        };
        let wishProduct = this.Data.wishList.filter(item=>item.id == product.id)[0];
        if(wishProduct){
            wishProduct.cartCount = 0;
        }; 
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

    public getCountries(){
        return [ 
            {id: 1, name: 'Afghanistan', code: 'AF'}, 
            {id: 1, name: 'Aland Islands', code: 'AX'}, 
            {id: 1, name: 'Albania', code: 'AL'}, 
            {id: 1, name: 'Algeria', code: 'DZ'}, 
            {id: 1, name: 'American Samoa', code: 'AS'}, 
            {id: 1, name: 'AndorrA', code: 'AD'}, 
            {id: 1, name: 'Angola', code: 'AO'}, 
            {id: 1, name: 'Anguilla', code: 'AI'}, 
            {id: 1, name: 'Antarctica', code: 'AQ'}, 
            {id: 1, name: 'Antigua and Barbuda', code: 'AG'}, 
            {id: 1, name: 'Argentina', code: 'AR'}, 
            {id: 1, name: 'Armenia', code: 'AM'}, 
            {id: 1, name: 'Aruba', code: 'AW'}, 
            {id: 1, name: 'Australia', code: 'AU'}, 
            {id: 1, name: 'Austria', code: 'AT'}, 
            {id: 1, name: 'Azerbaijan', code: 'AZ'}, 
            {id: 1, name: 'Bahamas', code: 'BS'}, 
            {id: 1, name: 'Bahrain', code: 'BH'}, 
            {id: 1, name: 'Bangladesh', code: 'BD'}, 
            {id: 1, name: 'Barbados', code: 'BB'}, 
            {id: 1, name: 'Belarus', code: 'BY'}, 
            {id: 1, name: 'Belgium', code: 'BE'}, 
            {id: 1, name: 'Belize', code: 'BZ'}, 
            {id: 1, name: 'Benin', code: 'BJ'}, 
            {id: 1, name: 'Bermuda', code: 'BM'}, 
            {id: 1, name: 'Bhutan', code: 'BT'}, 
            {id: 1, name: 'Bolivia', code: 'BO'}, 
            {id: 1, name: 'Bosnia and Herzegovina', code: 'BA'}, 
            {id: 1, name: 'Botswana', code: 'BW'}, 
            {id: 1, name: 'Bouvet Island', code: 'BV'}, 
            {id: 1, name: 'Brazil', code: 'BR'}, 
            {id: 1, name: 'British Indian Ocean Territory', code: 'IO'}, 
            {id: 1, name: 'Brunei Darussalam', code: 'BN'}, 
            {id: 1, name: 'Bulgaria', code: 'BG'}, 
            {id: 1, name: 'Burkina Faso', code: 'BF'}, 
            {id: 1, name: 'Burundi', code: 'BI'}, 
            {id: 1, name: 'Cambodia', code: 'KH'}, 
            {id: 1, name: 'Cameroon', code: 'CM'}, 
            {id: 1, name: 'Canada', code: 'CA'}, 
            {id: 1, name: 'Cape Verde', code: 'CV'}, 
            {id: 1, name: 'Cayman Islands', code: 'KY'}, 
            {id: 1, name: 'Central African Republic', code: 'CF'}, 
            {id: 1, name: 'Chad', code: 'TD'}, 
            {id: 1, name: 'Chile', code: 'CL'}, 
            {id: 1, name: 'China', code: 'CN'}, 
            {id: 1, name: 'Christmas Island', code: 'CX'}, 
            {id: 1, name: 'Cocos (Keeling) Islands', code: 'CC'}, 
            {id: 1, name: 'Colombia', code: 'CO'}, 
            {id: 1, name: 'Comoros', code: 'KM'}, 
            {id: 1, name: 'Congo', code: 'CG'}, 
            {id: 1, name: 'Congo, The Democratic Republic of the', code: 'CD'}, 
            {id: 1, name: 'Cook Islands', code: 'CK'}, 
            {id: 1, name: 'Costa Rica', code: 'CR'}, 
            {id: 1, name: 'Cote D\'Ivoire', code: 'CI'}, 
            {id: 1, name: 'Croatia', code: 'HR'}, 
            {id: 1, name: 'Cuba', code: 'CU'}, 
            {id: 1, name: 'Cyprus', code: 'CY'}, 
            {id: 1, name: 'Czech Republic', code: 'CZ'}, 
            {id: 1, name: 'Denmark', code: 'DK'}, 
            {id: 1, name: 'Djibouti', code: 'DJ'}, 
            {id: 1, name: 'Dominica', code: 'DM'}, 
            {id: 1, name: 'Dominican Republic', code: 'DO'}, 
            {id: 1, name: 'Ecuador', code: 'EC'}, 
            {id: 1, name: 'Egypt', code: 'EG'}, 
            {id: 1, name: 'El Salvador', code: 'SV'}, 
            {id: 1, name: 'Equatorial Guinea', code: 'GQ'}, 
            {id: 1, name: 'Eritrea', code: 'ER'}, 
            {id: 1, name: 'Estonia', code: 'EE'}, 
            {id: 1, name: 'Ethiopia', code: 'ET'}, 
            {id: 1, name: 'Falkland Islands (Malvinas)', code: 'FK'}, 
            {id: 1, name: 'Faroe Islands', code: 'FO'}, 
            {id: 1, name: 'Fiji', code: 'FJ'}, 
            {id: 1, name: 'Finland', code: 'FI'}, 
            {id: 1, name: 'France', code: 'FR'}, 
            {id: 1, name: 'French Guiana', code: 'GF'}, 
            {id: 1, name: 'French Polynesia', code: 'PF'}, 
            {id: 1, name: 'French Southern Territories', code: 'TF'}, 
            {id: 1, name: 'Gabon', code: 'GA'}, 
            {id: 1, name: 'Gambia', code: 'GM'}, 
            {id: 1, name: 'Georgia', code: 'GE'}, 
            {id: 1, name: 'Germany', code: 'DE'}, 
            {id: 1, name: 'Ghana', code: 'GH'}, 
            {id: 1, name: 'Gibraltar', code: 'GI'}, 
            {id: 1, name: 'Greece', code: 'GR'}, 
            {id: 1, name: 'Greenland', code: 'GL'}, 
            {id: 1, name: 'Grenada', code: 'GD'}, 
            {id: 1, name: 'Guadeloupe', code: 'GP'}, 
            {id: 1, name: 'Guam', code: 'GU'}, 
            {id: 1, name: 'Guatemala', code: 'GT'}, 
            {id: 1, name: 'Guernsey', code: 'GG'}, 
            {id: 1, name: 'Guinea', code: 'GN'}, 
            {id: 1, name: 'Guinea-Bissau', code: 'GW'}, 
            {id: 1, name: 'Guyana', code: 'GY'}, 
            {id: 1, name: 'Haiti', code: 'HT'}, 
            {id: 1, name: 'Heard Island and Mcdonald Islands', code: 'HM'}, 
            {id: 1, name: 'Holy See (Vatican City State)', code: 'VA'}, 
            {id: 1, name: 'Honduras', code: 'HN'}, 
            {id: 1, name: 'Hong Kong', code: 'HK'}, 
            {id: 1, name: 'Hungary', code: 'HU'}, 
            {id: 1, name: 'Iceland', code: 'IS'}, 
            {id: 1, name: 'India', code: 'IN'}, 
            {id: 1, name: 'Indonesia', code: 'ID'}, 
            {id: 1, name: 'Iran, Islamic Republic Of', code: 'IR'}, 
            {id: 1, name: 'Iraq', code: 'IQ'}, 
            {id: 1, name: 'Ireland', code: 'IE'}, 
            {id: 1, name: 'Isle of Man', code: 'IM'}, 
            {id: 1, name: 'Israel', code: 'IL'}, 
            {id: 1, name: 'Italy', code: 'IT'}, 
            {id: 1, name: 'Jamaica', code: 'JM'}, 
            {id: 1, name: 'Japan', code: 'JP'}, 
            {id: 1, name: 'Jersey', code: 'JE'}, 
            {id: 1, name: 'Jordan', code: 'JO'}, 
            {id: 1, name: 'Kazakhstan', code: 'KZ'}, 
            {id: 1, name: 'Kenya', code: 'KE'}, 
            {id: 1, name: 'Kiribati', code: 'KI'}, 
            {id: 1, name: 'Korea, Democratic People\'S Republic of', code: 'KP'}, 
            {id: 1, name: 'Korea, Republic of', code: 'KR'}, 
            {id: 1, name: 'Kuwait', code: 'KW'}, 
            {id: 1, name: 'Kyrgyzstan', code: 'KG'}, 
            {id: 1, name: 'Lao People\'S Democratic Republic', code: 'LA'}, 
            {id: 1, name: 'Latvia', code: 'LV'}, 
            {id: 1, name: 'Lebanon', code: 'LB'}, 
            {id: 1, name: 'Lesotho', code: 'LS'}, 
            {id: 1, name: 'Liberia', code: 'LR'}, 
            {id: 1, name: 'Libyan Arab Jamahiriya', code: 'LY'}, 
            {id: 1, name: 'Liechtenstein', code: 'LI'}, 
            {id: 1, name: 'Lithuania', code: 'LT'}, 
            {id: 1, name: 'Luxembourg', code: 'LU'}, 
            {id: 1, name: 'Macao', code: 'MO'}, 
            {id: 1, name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'}, 
            {id: 1, name: 'Madagascar', code: 'MG'}, 
            {id: 1, name: 'Malawi', code: 'MW'}, 
            {id: 1, name: 'Malaysia', code: 'MY'}, 
            {id: 1, name: 'Maldives', code: 'MV'}, 
            {id: 1, name: 'Mali', code: 'ML'}, 
            {id: 1, name: 'Malta', code: 'MT'}, 
            {id: 1, name: 'Marshall Islands', code: 'MH'}, 
            {id: 1, name: 'Martinique', code: 'MQ'}, 
            {id: 1, name: 'Mauritania', code: 'MR'}, 
            {id: 1, name: 'Mauritius', code: 'MU'}, 
            {id: 1, name: 'Mayotte', code: 'YT'}, 
            {id: 1, name: 'Mexico', code: 'MX'}, 
            {id: 1, name: 'Micronesia, Federated States of', code: 'FM'}, 
            {id: 1, name: 'Moldova, Republic of', code: 'MD'}, 
            {id: 1, name: 'Monaco', code: 'MC'}, 
            {id: 1, name: 'Mongolia', code: 'MN'}, 
            {id: 1, name: 'Montserrat', code: 'MS'}, 
            {id: 1, name: 'Morocco', code: 'MA'}, 
            {id: 1, name: 'Mozambique', code: 'MZ'}, 
            {id: 1, name: 'Myanmar', code: 'MM'}, 
            {id: 1, name: 'Namibia', code: 'NA'}, 
            {id: 1, name: 'Nauru', code: 'NR'}, 
            {id: 1, name: 'Nepal', code: 'NP'}, 
            {id: 1, name: 'Netherlands', code: 'NL'}, 
            {id: 1, name: 'Netherlands Antilles', code: 'AN'}, 
            {id: 1, name: 'New Caledonia', code: 'NC'}, 
            {id: 1, name: 'New Zealand', code: 'NZ'}, 
            {id: 1, name: 'Nicaragua', code: 'NI'}, 
            {id: 1, name: 'Niger', code: 'NE'}, 
            {id: 1, name: 'Nigeria', code: 'NG'}, 
            {id: 1, name: 'Niue', code: 'NU'}, 
            {id: 1, name: 'Norfolk Island', code: 'NF'}, 
            {id: 1, name: 'Northern Mariana Islands', code: 'MP'}, 
            {id: 1, name: 'Norway', code: 'NO'}, 
            {id: 1, name: 'Oman', code: 'OM'}, 
            {id: 1, name: 'Pakistan', code: 'PK'}, 
            {id: 1, name: 'Palau', code: 'PW'}, 
            {id: 1, name: 'Palestinian Territory, Occupied', code: 'PS'}, 
            {id: 1, name: 'Panama', code: 'PA'}, 
            {id: 1, name: 'Papua New Guinea', code: 'PG'}, 
            {id: 1, name: 'Paraguay', code: 'PY'}, 
            {id: 1, name: 'Peru', code: 'PE'}, 
            {id: 1, name: 'Philippines', code: 'PH'}, 
            {id: 1, name: 'Pitcairn', code: 'PN'}, 
            {id: 1, name: 'Poland', code: 'PL'}, 
            {id: 1, name: 'Portugal', code: 'PT'}, 
            {id: 1, name: 'Puerto Rico', code: 'PR'}, 
            {id: 1, name: 'Qatar', code: 'QA'}, 
            {id: 1, name: 'Reunion', code: 'RE'}, 
            {id: 1, name: 'Romania', code: 'RO'}, 
            {id: 1, name: 'Russian Federation', code: 'RU'}, 
            {id: 1, name: 'RWANDA', code: 'RW'}, 
            {id: 1, name: 'Saint Helena', code: 'SH'}, 
            {id: 1, name: 'Saint Kitts and Nevis', code: 'KN'}, 
            {id: 1, name: 'Saint Lucia', code: 'LC'}, 
            {id: 1, name: 'Saint Pierre and Miquelon', code: 'PM'}, 
            {id: 1, name: 'Saint Vincent and the Grenadines', code: 'VC'}, 
            {id: 1, name: 'Samoa', code: 'WS'}, 
            {id: 1, name: 'San Marino', code: 'SM'}, 
            {id: 1, name: 'Sao Tome and Principe', code: 'ST'}, 
            {id: 1, name: 'Saudi Arabia', code: 'SA'}, 
            {id: 1, name: 'Senegal', code: 'SN'}, 
            {id: 1, name: 'Serbia and Montenegro', code: 'CS'}, 
            {id: 1, name: 'Seychelles', code: 'SC'}, 
            {id: 1, name: 'Sierra Leone', code: 'SL'}, 
            {id: 1, name: 'Singapore', code: 'SG'}, 
            {id: 1, name: 'Slovakia', code: 'SK'}, 
            {id: 1, name: 'Slovenia', code: 'SI'}, 
            {id: 1, name: 'Solomon Islands', code: 'SB'}, 
            {id: 1, name: 'Somalia', code: 'SO'}, 
            {id: 1, name: 'South Africa', code: 'ZA'}, 
            {id: 1, name: 'South Georgia and the South Sandwich Islands', code: 'GS'}, 
            {id: 1, name: 'Spain', code: 'ES'}, 
            {id: 1, name: 'Sri Lanka', code: 'LK'}, 
            {id: 1, name: 'Sudan', code: 'SD'}, 
            {id: 1, name: 'Suriname', code: 'SR'}, 
            {id: 1, name: 'Svalbard and Jan Mayen', code: 'SJ'}, 
            {id: 1, name: 'Swaziland', code: 'SZ'}, 
            {id: 1, name: 'Sweden', code: 'SE'}, 
            {id: 1, name: 'Switzerland', code: 'CH'}, 
            {id: 1, name: 'Syrian Arab Republic', code: 'SY'}, 
            {id: 1, name: 'Taiwan, Province of China', code: 'TW'}, 
            {id: 1, name: 'Tajikistan', code: 'TJ'}, 
            {id: 1, name: 'Tanzania, United Republic of', code: 'TZ'}, 
            {id: 1, name: 'Thailand', code: 'TH'}, 
            {id: 1, name: 'Timor-Leste', code: 'TL'}, 
            {id: 1, name: 'Togo', code: 'TG'}, 
            {id: 1, name: 'Tokelau', code: 'TK'}, 
            {id: 1, name: 'Tonga', code: 'TO'}, 
            {id: 1, name: 'Trinidad and Tobago', code: 'TT'}, 
            {id: 1, name: 'Tunisia', code: 'TN'}, 
            {id: 1, name: 'Turkey', code: 'TR'}, 
            {id: 1, name: 'Turkmenistan', code: 'TM'}, 
            {id: 1, name: 'Turks and Caicos Islands', code: 'TC'}, 
            {id: 1, name: 'Tuvalu', code: 'TV'}, 
            {id: 1, name: 'Uganda', code: 'UG'}, 
            {id: 1, name: 'Ukraine', code: 'UA'}, 
            {id: 1, name: 'United Arab Emirates', code: 'AE'}, 
            {id: 1, name: 'United Kingdom', code: 'GB'}, 
            {id: 1, name: 'United States', code: 'US'}, 
            {id: 1, name: 'United States Minor Outlying Islands', code: 'UM'}, 
            {id: 1, name: 'Uruguay', code: 'UY'}, 
            {id: 1, name: 'Uzbekistan', code: 'UZ'}, 
            {id: 1, name: 'Vanuatu', code: 'VU'}, 
            {id: 1, name: 'Venezuela', code: 'VE'}, 
            {id: 1, name: 'Viet Nam', code: 'VN'}, 
            {id: 1, name: 'Virgin Islands, British', code: 'VG'}, 
            {id: 1, name: 'Virgin Islands, U.S.', code: 'VI'}, 
            {id: 1, name: 'Wallis and Futuna', code: 'WF'}, 
            {id: 1, name: 'Western Sahara', code: 'EH'}, 
            {id: 1, name: 'Yemen', code: 'YE'}, 
            {id: 1, name: 'Zambia', code: 'ZM'}, 
            {id: 1, name: 'Zimbabwe', code: 'ZW'} 
        ]
    }

    public getMonths(){
        return [
            { value: '01', name: 'January' },
            { value: '02', name: 'February' },
            { value: '03', name: 'March' },
            { value: '04', name: 'April' },
            { value: '05', name: 'May' },
            { value: '06', name: 'June' },
            { value: '07', name: 'July' },
            { value: '08', name: 'August' },
            { value: '09', name: 'September' },
            { value: '10', name: 'October' },
            { value: '11', name: 'November' },
            { value: '12', name: 'December' }
        ]
    }

    public getYears(){
        return ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030" ]
    }

    public getDeliveryMethods(){
        return [
            { value: 'free', name: 'Free Delivery', desc: '$0.00 / Delivery in 7 to 14 business Days' },
            { value: 'standard', name: 'Standard Delivery', desc: '$7.99 / Delivery in 5 to 7 business Days' },
            { value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days' }
        ]
    }

} 