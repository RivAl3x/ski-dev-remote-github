// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://deskhub-back.logic-s.ro/api/',
  // apiUrl:'https://proiect1-a4726-default-rtdb.europe-west1.firebasedatabase.app/ski-schools.json',
  apiUrl: "https://proiect1-a4726-default-rtdb.europe-west1.firebasedatabase.app/ski-schools.json",
  url: '',

   firebaseConfig : {
    apiKey: "AIzaSyDfCvLgyotrgmbERFv-LKr-vhbxYZLbTtM",
    authDomain: "proiect1-a4726.firebaseapp.com",
    // databaseURL: "https://proiect1-a4726-default-rtdb.europe-west1.firebasedatabase.app",
    apiUrl: "https://proiect1-a4726-default-rtdb.europe-west1.firebasedatabase.app/ski-schools.json",
    projectId: "proiect1-a4726",
    storageBucket: "proiect1-a4726.appspot.com",
    messagingSenderId: "178973351107",
    appId: "1:178973351107:web:2a2dc7403b0b1d5fd71676",
    measurementId: "G-8JDGKSZG2N"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
