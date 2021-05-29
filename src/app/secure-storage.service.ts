import { Injectable } from '@angular/core';

import 'capacitor-secure-storage-plugin';
import { Plugins } from '@capacitor/core';

const { SecureStoragePlugin } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SecureStorageService {
  storage: any;
  constructor() { }

  async set(storagekey: string, value: any){
    console.log(storagekey,value);
    console.log(value);
    const encrypted_value = JSON.stringify(value);
    const success = await SecureStoragePlugin.set({
      key : storagekey,
      value: encrypted_value
    });
    return success;
  }
  async get(key: string){
    this.storage = await SecureStoragePlugin.get({key});
    return JSON.parse(this.storage.value);
  }
}
