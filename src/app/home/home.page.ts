import { Component, OnInit, NgZone } from '@angular/core';
import { SecureStorageService } from '../secure-storage.service';
import { FormsModule } from '@angular/forms';
import { App } from '@capacitor/core';
import { ToastController, Platform, IonRouterOutlet } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
 public data1 = {
   name: '',
   pass: ''
 };
  constructor(private storageService: SecureStorageService,  private ngZone: NgZone, public router: Router,
              private toastCtrl: ToastController, public platform: Platform, private routerOutlet: IonRouterOutlet ) 
              {
                this.platform.backButton.subscribeWithPriority(-1, () => {
                  if (!this.routerOutlet.canGoBack()) {
                    navigator['app'].exitApp();
                  }
                });
               }

  ngOnInit() {
  }
  getStorage()
  {
    console.log(this.data1.name);
    this.storageService.get(this.data1.name).then((result) => {
      if ((result.password) === (this.data1.pass)) {
        console.log(result);
        const navigationExtras: NavigationExtras = {queryParams: {special: this.data1.name}};
        this.router.navigate(['ble'], navigationExtras );
      }
    }).catch((err) => {
      console.log(err);
    });
  }

}
