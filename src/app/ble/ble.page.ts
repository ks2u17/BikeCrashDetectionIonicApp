import { BLE } from '@ionic-native/ble/ngx';
import { Component, NgZone, OnInit } from '@angular/core';
import { ToastController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Router, NavigationExtras , ActivatedRoute} from '@angular/router';
import { SecureStorageService } from '../secure-storage.service';
import { App } from '@capacitor/core';
const THERMO = '4a521f2c-d6c5-4da3-9662-68ae13b665f5';

@Component({
  selector: 'app-ble',
  templateUrl: './ble.page.html',
  styleUrls: ['./ble.page.scss'],
})
export class BLEPage implements OnInit {
  devices: any[] = [];
  statusMessage: string;
  deviceMode = true;
  username: string;
  name: string;
  val: number;

  constructor(
    public router: Router,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone,
    public route: ActivatedRoute,
    private storageService: SecureStorageService,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet

  ) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
          this.username = params.special;
          console.log(this.username);
         // this.setStatus('Connecting to ' + this.username);
          // Call BLE Connect - Connect to BLE Device
      }
      this.getStorage();
  });
  }

  ngOnInit() {
  }
  scan() {
    this.setStatus('Scanning for Bluetooth LE Devices');
    this.devices = []; // clear list

    this.ble.scan([THERMO], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );

    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  // If location permission is denied, you'll end up here
  async scanError(error) {
    this.setStatus('Error ' + error);
    const toast = await this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }
  getStorage()
  {
    console.log(this.username);
    this.storageService.get(this.username).then((result) => {
      console.log(result);
      this.val = result.password;
      // this.setStatus('password'+ this.val);
      console.log(this.val);
    }).catch((err) => {
      console.log(err);
    });
  }
  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }
  deviceSelected(device: any) {
    console.log(JSON.stringify(device) + ' selected');
    const navigationExtras: NavigationExtras = {
          queryParams: {
              special: JSON.stringify(device),
              user: this.username
          }
      };
    this.router.navigate(['detail'], navigationExtras);
  }
}
