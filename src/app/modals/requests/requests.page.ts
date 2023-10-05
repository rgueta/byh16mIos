import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams,ToastController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DatabaseService } from "../../services/database.service";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  title: string ;
  validator: FormGroup;
  myToast:any;

  constructor(
    private modalController:ModalController,
    private navParams:NavParams,
    private api:DatabaseService,
    private toast:ToastController
  ) { }

  ngOnInit() {
    switch(this.navParams.data['request']){
      case 'UnblockAccount':
        this.title = 'Desbloquear usuario';
        break;

      case 'deviceLost':
        this.title = 'Reportar equipo perdido';
        break;
      
      case 'pwdReset':
        this.title = 'Recuperar contraseña';
        break;
      
      default:
        this.title = 'Request page';
        break;
    }


    this.validator = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.required]),
      comment: new FormControl('', [Validators.required, Validators.required]),
    });
  }


  sendRequest(){

    this.api.post_pwdRST('api/pwdResetReq/' + this.email.value).subscribe(async result => {
      // this.api.post_pwdRST('api/pwdResetReq/email/').subscribe(async result => {
        console.log('psswordRST_request result -- >', result);
        this.toastEvent('Reciviras un correo para recuperar tu contraseña ..',5000)
      },err =>{
        console.log('psswordRST_request Error -- >', err);
        this.toastEvent('No se envio el correo, el correo no esta relacionado a una cuenta  ..',5000)
      });

  }

   // -------   toast control alerts    ---------------------
   toastEvent(msg:string,time:number){
    this.myToast = this.toast.create({
      message:msg,
      duration:time
    }).then((toastData) =>{
      console.log(toastData);
      toastData.present();
    });
  }


  closeModal(){
    this.modalController.dismiss();
  } 

  get email() {
    return this.validator.get('email');
  }

}
