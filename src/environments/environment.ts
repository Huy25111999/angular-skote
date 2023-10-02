// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as CryptoJS from 'crypto-js';

export const environment = {
  production: false,
  defaultauth: 'serviceUrl',
  server: 'http://smartmotor.techasians.com',
  serviceUrl:'http://192.168.1.45:8082/api',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  },
  keyAuthorizationBasic: 'Basic ' + btoa(`demo-client:${encryptCode()}`),
  key: 'SMARTMOTOR123456',
};

function encryptCode() {
  let _key = CryptoJS.enc.Utf8.parse('SMARTMOTOR123456');
  let _passs = CryptoJS.enc.Utf8.parse('123456a@');
  let passwordEncoded = CryptoJS.AES.encrypt(
    _passs, _key, {
    mode: CryptoJS.mode.ECB,
  });
  return passwordEncoded.ciphertext.toString(CryptoJS.enc.Hex);
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
