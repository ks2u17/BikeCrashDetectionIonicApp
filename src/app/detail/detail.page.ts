import { Component, OnInit, NgZone} from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BLE } from '@ionic-native/ble/ngx';
import { variable } from '@angular/compiler/src/output/output_ast';
import { SecureStorageService } from '../secure-storage.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions} from '@ionic-native/android-permissions/ngx';
// Bluetooth UUIDs
const BLE_SERVICE = '4a521f2c-d6c5-4da3-9662-68ae13b665f5';
const DIST = '1f2d';
const MAX_SPEED = '1f2e';
const CURRENT_SPEED = '1f2f';
const AVG_SPEED = '1F30';
const S = '1f31';
// const MINS = '1F32';
// const HOURS = '1F33';
const CIRCUM = '1f34';
const ALERT_SEND = '1f35';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss']
})
export class DetailPage implements OnInit {

  peripheral: any = {};
  dis: number;
  max: number;
  current: number;
  av: number;
  sec: number;
  sec_1: any;
  min: number;
  min_1: any;
  hour: number;
  hour_1: any;
  millis: number;
  alert: number;
  username: string;
  decimal: number;
  latitude: any = 0; // latitude
  longitude: any = 0; // longitude
  address: string;
  today: string;
  date: string;
  contact1: string;
  contact2: string;
  contact3: string;



  statusMessage: string;
 public dataFromDevice: any;
    constructor(public route: ActivatedRoute, public router: Router, private ble: BLE,
                private toastCtrl: ToastController, private alertCtrl: AlertController, private ngZone: NgZone,
                private geolocation: Geolocation,
                private nativeGeocoder: NativeGeocoder,
                public androidPermissions: AndroidPermissions,
                private sms: SMS,
                private storageService: SecureStorageService) {

        this.route.queryParams.subscribe(params => {
          if (params && params.special && params.user) {
              const device = JSON.parse(params.special);
              this.username = params.user;
              this.setStatus('Connecting to ' +  this.username);

              // Call BLE Connect - Connect to BLE Device
              this.BleConnect(device);
          }
      });
   }
   options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  // geocoder options
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

    ngOnInit() {
      this.dis = 0.000;
      this.max = 0.000;
      this.current = 0.000;
      this.av = 0.000;
      this.sec = 0.000;
      this.min = 0.000;
      this.millis = 0.000;
      this.hour = 0.000;
      this.alert = 0.000;
      this.sec_1 = '00';
      this.min_1 = '00';
      this.hour_1 = '00';
      }

    BleConnect(device) {
        this.ble.connect(device.id).subscribe(
            peripheral => this.onConnected(peripheral),
            peripheral => this.onDeviceDisconnected(peripheral)
        );
    }

    onConnected(peripheral) {
      this.peripheral = peripheral;
      this.setStatus('Connected to ' + (peripheral.name || peripheral.id));
      this.getStorage(this.username);
      this.ble.startNotification(this.peripheral.id, BLE_SERVICE, S).subscribe(
        data4 => this.onSChange(data4),
        () => this.showAlert('Unexpected Error', 'Z subscription lost')
       );
      this.ble.startNotification(this.peripheral.id, BLE_SERVICE, DIST).subscribe(
        data => this.onDisChange(data),
        () => this.showAlert('Unexpected Error', 'X subscription lost')
      );
      this.ble.startNotification(this.peripheral.id, BLE_SERVICE, CURRENT_SPEED).subscribe(
        data2 => this.onCurrentChange(data2),
        () => this.showAlert('Unexpected Error', 'Z subscription lost')
       );
      this.ble.startNotification(this.peripheral.id, BLE_SERVICE, ALERT_SEND).subscribe(
        data8 => this.onAChange(data8),
        () => this.showAlert('Unexpected Error', 'Z subscription lost')
       );
      /*this.ble.startNotification(this.peripheral.id, BLE_SERVICE, MAX_SPEED).subscribe(
        data1 => this.onMaxChange(data1),
        () => this.showAlert('Unexpected Error', 'Y subscription lost')
       );*/

      /*this.ble.startNotification(this.peripheral.id, BLE_SERVICE, AVG_SPEED).subscribe(
        data3 => this.onAvgChange(data3),
        () => this.showAlert('Unexpected Error', 'Z subscription lost')
       );*/
     
      /*this.ble.startNotification(this.peripheral.id, BLE_SERVICE, MINS).subscribe(
        data5 => this.onMChange(data5),
        () => this.showAlert('Unexpected Error', 'Z subscription lost')
       );
      this.ble.startNotification(this.peripheral.id, BLE_SERVICE, HOURS).subscribe(
        data6 => this.onHChange(data6),
        () => this.showAlert('Unexpected Error', 'Z subscription lost')
       );*/


  }
  onSChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, S ).then(
       data4 => this.onSecondsChange(data4),
       // () => this.showAlert('Unexpected Error', 'Z change lost')
     );
   }
   onDisChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, DIST).then(
       data => this.onDisvalChange(data),
       // () => this.showAlert('Unexpected Error', 'X change lost')
     );
   }
   onCurrentChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, CURRENT_SPEED).then(
       data2 => this.onCurrentvalChange(data2),
       // () => this.showAlert('Unexpected Error', 'Z change lost')
     );
   }
  onAChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, ALERT_SEND).then(
       data8 => this.onAlertChange(data8),
       // () => this.showAlert('Unexpected Error', 'Z change lost')
     );
   }
 /* onMaxChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, MAX_SPEED).then(
       data1 => this.onMaxvalChange(data1),
       // () => this.showAlert('Unexpected Error', 'Y change lost')
     );
   }*/
   /*onAvgChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, AVG_SPEED).then(
       data3 => this.onAvgSpeedChange(data3),
       // () => this.showAlert('Unexpected Error', 'Z change lost')
     );
   }*/
  /* onMChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, MINS).then(
       data5 => this.onMinutesChange(data5),
       // () => this.showAlert('Unexpected Error', 'Z change lost')
     );
   }
   onHChange(buffer: ArrayBuffer) {
    this.ble.read(this.peripheral.id, BLE_SERVICE, HOURS).then(
       data6 => this.onHoursChange(data6),
       // () => this.showAlert('Unexpected Error', 'Z change lost')
     );
   }*/
   onSecondsChange(buffer: ArrayBuffer){
    let DATA_5= new Float32Array(buffer);
    console.log(DATA_5[0]);

    this.ngZone.run(() => {
    this.millis = DATA_5[0];
    if (this.millis >= 1000)
    {
      this.sec = this.millis / 1000 % 60;
      this.min = this.millis / 60000 % 60;
      this.hour = this.millis / 3600000 % 60;
      this.sec_1 = this.sec;
      this.sec_1 = String('0' + Math.floor(this.sec_1)).slice(-2);
      this.min_1 = this.min;
      this.min_1 = String('0' + Math.floor(this.min_1)).slice(-2);
      this.hour_1 = this.hour;
      this.hour_1 = String('0' + Math.floor(this.hour_1)).slice(-2);
    }
    });
  }
  onDisvalChange(buffer: ArrayBuffer){
    let DATA_1= new Float32Array(buffer);
    console.log(DATA_1[0]);

    this.ngZone.run(() => {
    this.dis = DATA_1[0];
    });
  }
  onCurrentvalChange(buffer: ArrayBuffer){
    let DATA_3= new Float32Array(buffer);
    console.log(DATA_3[0]);

    this.ngZone.run(() => {
    this.current = DATA_3[0];
    if (this.current > this.max){
      this.max = this.current;
    }
    this.av = this.dis * (3600000 / this.millis);
    });
  }
   onAlertChange(buffer: ArrayBuffer){
    let DATA_8= new Float32Array(buffer);
    console.log(DATA_8[0]);
    this.alert = DATA_8[0];
    this.ngZone.run(() => {
    if (this.alert === 45)
    {
    this.getCurrentCoordinates();
    // this.setStatus('i am herreee' + this.alert);
    }
  });
  }


  /*onMaxvalChange(buffer: ArrayBuffer){
    let DATA_2= new Float32Array(buffer);
    console.log(DATA_2[0]);

    this.ngZone.run(() => {
    this.max = DATA_2[0];
    });
  }*/

 /* onAvgSpeedChange(buffer: ArrayBuffer){
    let DATA_4= new Float32Array(buffer);
    console.log(DATA_4[0]);

    this.ngZone.run(() => {
    this.av = DATA_4[0];
    });
  }*/

  /*onMinutesChange(buffer: ArrayBuffer){
    let DATA_6= new Float32Array(buffer);
    console.log(DATA_6[0]);

    this.ngZone.run(() => {
    this.min = DATA_6[0];
    this.min_1 = this.min;
    this.min_1 = String('0' + Math.floor(this.min_1)).slice(-2);
    // this.setStatus('time is ' + this.min_1);
    });
  }
  onHoursChange(buffer: ArrayBuffer){
    let DATA_7= new Float32Array(buffer);
    console.log(DATA_7[0]);

    this.ngZone.run(() => {
    this.hour = DATA_7[0];
    this.hour_1 = this.hour;
    this.hour_1 = String('0' + Math.floor(this.hour_1)).slice(-2);
    });
  }*/
  
  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
      // this.setStatus('i am hereeeeee');
      this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.getAddress(this.latitude, this.longitude, this.username);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  // get address using coordinates
  getAddress(lat,long, info){
    let code = this.makeShortCode(lat, long, 17);
    let prefix = this.shortlinkPrefix();
    this.address = prefix + '/go/' + code + '?m=';
    this.today = new Date().toString();
    
    const options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
          intent: ''  // send SMS with the native android SMS messaging
          // intent: '' // send SMS without opening any other app
      }
  };
  /*this.sms.send('07932738514', 'Hello from the other side!', options).then(() => {
    this.showAlert('Success', 'message has been sent');
  })
  .catch(error => {
  });*/
    this.sms.hasPermission().then(() => {
     // this.setStatus('heyyy i am here' + this.contact1);
      this.storageService.get(info).then((result) => {
        this.contact1 = result.Emergency_Contact1;
        this.contact2 = result.Emergency_Contact2;
        this.contact3 = result.Emergency_Contact3;
        this.sms.send(this.contact1, 'I have met with an accident on ' + this.today + ' \n' + this.address, options);
        /*this.sms.send(this.contact2, 'I have met with an accident on ' + this.today + ' \n' + this.address, options);
        this.sms.send(this.contact3, 'I have met with an accident on ' + this.today + ' \n' + this.address, options);*/
      }).catch((err) => {
        console.log(err);
      });
      this.ble.disconnect(this.peripheral.id).then(
        () => this.showAlert('Crash Occured: Disconnected from the device', this.peripheral.id ),
        () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral)));
    })
    .catch(error => {
      this.showAlert('Error', 'Failed: ' + error);
    });
  }

  shortlinkPrefix() {
      return 'http://osm.org';
  }

  interlace(x, y) {
    // tslint:disable-next-line: no-bitwise
    x = (x | (x << 8)) & 0x00ff00ff;
    // tslint:disable-next-line: no-bitwise
    x = (x | (x << 4)) & 0x0f0f0f0f;
    // tslint:disable-next-line: no-bitwise
    x = (x | (x << 2)) & 0x33333333;
    // tslint:disable-next-line: no-bitwise
    x = (x | (x << 1)) & 0x55555555;

    // tslint:disable-next-line: no-bitwise
    y = (y | (y << 8)) & 0x00ff00ff;
    // tslint:disable-next-line: no-bitwise
    y = (y | (y << 4)) & 0x0f0f0f0f;
    // tslint:disable-next-line: no-bitwise
    y = (y | (y << 2)) & 0x33333333;
    // tslint:disable-next-line: no-bitwise
    y = (y | (y << 1)) & 0x55555555;

    // tslint:disable-next-line: no-bitwise
    return (x << 1) | y;
}

/*
 * Called to create a short code for the short link.
 */
  makeShortCode(lat, lon, zoom) {
     // tslint:disable-next-line: variable-name
     const char_array = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_~';
     // tslint:disable-next-line: no-bitwise
     const x = Math.round((lon + 180.0) * ((1 << 30) / 90.0));
     // tslint:disable-next-line: no-bitwise
     const y = Math.round((lat +  90.0) * ((1 << 30) / 45.0));
    // JavaScript only has to keep 32 bits of bitwise operators, so this has to be
    // done in two parts. each of the parts c1/c2 has 30 bits of the total in it
    // and drops the last 4 bits of the full 64 bit Morton code.
     let str = '';
    // tslint:disable-next-line: prefer-const
     // tslint:disable-next-line: no-bitwise
     let c1 = this.interlace(x >>> 17, y >>> 17);
     // tslint:disable-next-line: no-bitwise
     let c2 = this.interlace((x >>> 2) & 0x7fff, (y >>> 2) & 0x7fff);
     for (let i = 0; i < Math.ceil((zoom + 8) / 3.0) && i < 5; ++i) {
        // tslint:disable-next-line: no-bitwise
        const digit = (c1 >> (24 - 6 * i)) & 0x3f;
        str += char_array.charAt(digit);
    }
     for (let i = 5; i < Math.ceil((zoom + 8) / 3.0); ++i) {
        // tslint:disable-next-line: no-bitwise
        const digit = (c2 >> (24 - 6 * (i - 5))) & 0x3f;
        str += char_array.charAt(digit);
    }
     for (let i = 0; i < ((zoom + 8) % 3); ++i) {
        str += '-';
    }
     return str;
}  // address
 async onDeviceDisconnected(peripheral) {
    const toast = await this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    this.ble.disconnect(this.peripheral.id).then(
      () => this.showAlert('You disconnected from the device', this.peripheral.id ),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral)));
    this.ble.stopNotification(this.peripheral.id, BLE_SERVICE, DIST);
    this.ble.stopNotification(this.peripheral.id, BLE_SERVICE, MAX_SPEED);
    this.ble.stopNotification(this.peripheral.id, BLE_SERVICE, CURRENT_SPEED);
  }
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
  getStorage(info: string)
  {
    console.log(info);
    // this.setStatus('heyyy i am here' + info);
    this.storageService.get(info).then((result) => {
      this.decimal = result.radius;
     // this.setStatus('heyyy i am here' + this.decimal);
      let data7 = new Float32Array(1);
      data7[0] = this.decimal;
      this.ble.write( this.peripheral.id, BLE_SERVICE, CIRCUM, data7.buffer);
    }).catch((err) => {
      console.log(err);
    });
    return this.decimal;
  }
    async showAlert(title, message) {
        const alert = await this.alertCtrl.create({
            header: title,
            message,
            buttons: ['OK']
        });
        alert.present();
      }
    }
