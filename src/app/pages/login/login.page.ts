import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from "../../../environments/environment";
import { AlertController, LoadingController, isPlatform} from "@ionic/angular";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Device } from "@capacitor/device";

const USER_ROLES = 'my-roles';
const USER_ROLE = 'my-role';

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
    private orientation:ScreenOrientation,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,

  ) { }

  async ngOnInit() {
    this.version = environment.app.version;
    if(isPlatform('cordova') || isPlatform('ios')){
      this.lockToPortrait();
    }else if(isPlatform('android')){
      this.isAndroid = true;
    }

    localStorage.clear();
    this.credentials = this.fb.group({
      email: ['neighbor2@gmail.com', [Validators.required, Validators.email]],
      pwd: ['1234', [Validators.required, Validators.minLength(4)]],
    });

    this.device_info = await JSON.stringify(Device.getInfo())
    console.log('this.device_info --> ',JSON.stringify(this.device_info))
  }

  lockToPortrait(){
    this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT)
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async res => {        
        await loading.dismiss();
        const roles = await localStorage.getItem(USER_ROLES); // typeof object
        // let myrole = await localStorage.getItem(USER_ROLE);

       for(const val_myrole of JSON.parse(roles)){
          console.log('Login.. page my-role --->  ' + roles);
          if(val_myrole.name === 'admin' || val_myrole.name === 'neighbor'){
            this.router.navigateByUrl('/tabs', { replaceUrl: true });
          }else{
           this.router.navigateByUrl('/store', { replaceUrl: true });
          }
        };

      },
      async err  =>{
        if (err.error.errId == 1){
          console.log('Abrir registro');
        }

        await loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Fallo el acceso: ' + JSON.stringify(err),
          message: err.error.ErrMsg,
          buttons: [
            {
              text : 'Registro nuevo',
              role : 'registro',
              handler : () => {
                const url = '/register'
                this.router.navigateByUrl(url, {replaceUrl: true});
                // this.router.navigate([url] , { state : { from : 'login'}  }); //send parameters
              }
            },
            { text : 'OK'}
          ],
        });

        await alert.present();
      }
    );


}

   // Easy access for form fields
   get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('pwd');
  }

}
