export class UserInfo {
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    gender: any;
    idGender: any;
    birthDate: any;
    phoneNo: any;
    idGovernmentType: any;
    streetAddress: string;
    apartmentSuite: string;
    locality: string;
    state: string;
    zipCode: any;
    idCountry: any;

    public constructor(
        email: string = '',
        firstName: string = '',
        lastName: string = '',
        companyName: string = '',
        gender: any = '',
        idGender: any = '',
        birthDate: any = '',
        phoneNo: any = '',
        idGovernmentType: any = '',
        streetAddress: string = '',
        apartmentSuite: string = '',
        locality: string = '',
        state: string = '',
        zipCode: any = '',
        idCountry: any = ''
    ) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.gender = gender;
        this.idGender = idGender;
        this.birthDate = birthDate;
        this.phoneNo = phoneNo;
        this.idGovernmentType = idGovernmentType;
        this.streetAddress = streetAddress;
        this.apartmentSuite = apartmentSuite;
        this.locality = locality;
        this.state = state;
        this.zipCode = zipCode;
        this.idCountry = idCountry;
    }
}