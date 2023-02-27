import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from "../../../environments/environment";
import { AlertController, LoadingController, isPlatform} from "@ionic/angular";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isAndroid:any;
  credentials!: FormGroup;
  creds = {
    email :'neighbor2@gmail.com',
    pwd : '1234'
  };
  
  device_info:any;

 private  REST_API_SERVER = environment.db.server_url;
 public version = '';
 

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private orientation:ScreenOrientation

  ) { }

  ngOnInit() {
    this.version = environment.app.version;
    if(isPlatform('cordova') || isPlatform('ios')){
      this.lockToPortrait();
    }else if(isPlatform('android')){
      this.isAndroid = true;
    }
  }

  lockToPortrait(){
    this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT)
  }


  async login() {

}

   // Easy access for form fields
   get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('pwd');
  }

}
