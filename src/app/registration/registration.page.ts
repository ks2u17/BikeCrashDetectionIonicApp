import { Component, OnInit, NgZone } from '@angular/core';
import { SecureStorageService } from '../secure-storage.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  public keydata = {
    username: '',
  }
 public getData = {
   password: '',
   age: 0,
   gender: '',
   radius: 0,
   height: 0,
   Emergency_Contact1: '',
   Emergency_Contact2: '',
   Emergency_Contact3: '',
 };
  ngOnInit() {}
  constructor(private storageService: SecureStorageService,  private ngZone: NgZone) {}

  setStorage()
  {
    this.storageService.set(this.keydata.username, this.getData).then((result) => {
      console.log(this.getData);
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  }
  getStorage()
  {
    this.storageService.get(this.keydata.username).then((result) => {
      console.log(result);
      console.log(result.password);
      if ((result.password) === (this.getData.password)) {
        console.log(result.password);
      }
    }).catch((err) => {
      console.log(err);
    });
  }
}

