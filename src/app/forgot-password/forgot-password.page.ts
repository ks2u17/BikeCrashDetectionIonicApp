import { Component, OnInit, NgZone } from '@angular/core';
import { SecureStorageService } from '../secure-storage.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public keydata = {
    username: '',
  };
 public getData = {
   password: '',
   age: 0,
   gender: '',
   radius: 0,
   height: 0
 };
  constructor(private storageService: SecureStorageService,  private ngZone: NgZone, public router: Router) { }

  ngOnInit() {
  }
  getStorage()
  {
    this.storageService.get(this.keydata.username).then((result) => {
      console.log(result);
      this.getData.age = result. age;
      this.getData.gender = result.gender;
      this.getData.height = result.height;
      this.getData.radius = result.radius;
      this.storageService.set(this.keydata.username, this.getData);
      console.log(this.getData.password);
      this.router.navigate(['home']);
    }).catch((err) => {
      console.log(err);
    });
  }
}
