import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from "../../../environments/environment";
import { AlertController, LoadingController, isPlatform, ModalController} from "@ionic/angular";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Device } from "@capacitor/device";
import { Utils } from 'src/app/tools/tools';
import { RequestsPage } from "../../modals/requests/requests.page";
import { Socket } from "ngx-socket-io";
// import localNotification from "../../tools/localNotification";
import { Sim } from "@ionic-native/sim/ngx"; 

const USER_ROLES = 'my-roles';
const USER_ROLE = 'my-role';
const VISITORS = 'visitors';
const DEVICE_UUID = 'device-uuid';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isAndroid:any;
  credentials: FormGroup;

  // Easy access for form fields
   get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('pwd');
  }
  
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
    private modalController:ModalController,
    private socket:Socket,
    private SIM : Sim,

  ) { }

  async ngOnInit() {

    Utils.cleanLocalStorage();
    this.init();
    this.version = environment.app.version;

    if(isPlatform('cordova') || isPlatform('ios')){
      this.lockToPortrait();
    }else if(isPlatform('android')){
      this.isAndroid = true;
    }

    

    this.credentials =new FormGroup({
      email: new FormControl('neighbor2@gmail.com', [Validators.required, Validators.email]),
      pwd: new FormControl('1234', [Validators.required, Validators.minLength(4)]),
    });

    this.device_info = await Device.getInfo();

    console.log('this.device_info --> ',await JSON.stringify(this.device_info))

   
  }

  async init(): Promise<void> {
    await this.SIM.hasReadPermission().then(async allowed =>{
      if(!allowed){
        console.log('Si entre init sim has read permissions')
        await this.SIM.requestReadPermission().then( 
        async () => {
            await this.SIM.getSimInfo().then(
            (info) => console.log('Sim info: ', info),
            (err) => console.log('Unable to get sim info: ', err)
          );
           },
        () => console.log('Permission denied')
        )
      }
    });
  
     const info = await Device.getInfo();
     console.log('tab1.page SIM info --> ' , info);
     localStorage.setItem(DEVICE_UUID, (await Device.getId()).uuid);

     if (info.platform === 'android') {
       try {
         console.log('soy android OK');
       } catch (e) {
         console.log('soy android con Error: ', e);
     }
   }else{
     console.log('no soy android');
   }
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
          if(localStorage.getItem('locked') === 'true')
          {
            await this.lockedUser('Usuario bloqueado !');
            return;
          }
          if(val_myrole.name === 'admin' || val_myrole.name === 'neighbor'){

    // ------socket.io ---------------------------------

          //   await this.socket.on('connect', async ()=>{
          //     console.log('socket connected: ', this.socket.ioSocket.id);
          //     this.socket.emit('join',localStorage.getItem('core-id'));


          //     await this.socket.emit('join',localStorage.getItem('core-id'));


          //   });

          //   // this.socket.emit('join',localStorage.getItem('core-id'));
          //   // unir(localStorage.getItem('core-id'));

          //   // this.socket.on('*',()=>{
          //   //   console.log('on * !');
          //   //   this.socket.emit('join',localStorage.getItem('core-id'));
          //   // })
        
          //  await this.socket.on('joined', (msg:string)=>{
          //     console.log(msg);
          // });
          
          // await this.socket.on('Alert',async (msg:any)=>{
          //   console.log('Alert --> ', msg);
          //  await  localNotification(msg);
          // });

  // -----------------------------------------


          

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

        let msgErr='';

        const alert = await this.alertController.create({
          header: msgErr,
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

async lockedUser(msg:string){
  const alert = await this.alertController.create({
    // header: msgErr,
    message: msg,
    buttons: [
      {
        text : 'OK',
        role : 'registro',
        handler : () => {
          const url = '/'
          this.router.navigateByUrl(url, {replaceUrl: true});
          // this.router.navigate([url] , { state : { from : 'login'}  }); //send parameters
        }
      },
      { text : 'OK'}
    ],
  });

  await alert.present();
}

async pwdReset(){
  const modal = await this.modalController.create({
    component: RequestsPage,
    componentProps:{request:'pwdReset'}
  });
   await modal.present();

}

async openStore(){
  this.router.navigate(['/store']);
}



}
