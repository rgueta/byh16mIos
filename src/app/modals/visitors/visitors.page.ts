import { Component, OnInit, Input } from '@angular/core';
import { ModalController,AlertController, isPlatform, ToastController, AnimationController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup} from "@angular/forms";
import { DatabaseService } from "../../services/database.service";
import { ContactsPage } from "../../modals/contacts/contacts.page";

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.page.html',
  styleUrls: ['./visitors.page.scss'],
})
export class VisitorsPage implements OnInit {
  RegisterForm : FormGroup;
  @Input() name:string;
  @Input() email:string;
  @Input() sim:String;
  @Input() address:String;
  // @Input() gender:String;
  @Input() avatar:String;


  myToast : any;
  public gender = "M";
  // contacts: Observable<Contact[]>;
  contacts: [];
  contactSelected:any = {};
  userId : string;

  constructor(
            private modalController : ModalController,
            private toast : ToastController,
            public api:DatabaseService,
            private animationController : AnimationController,
  ) { 
    this.RegisterForm = new FormGroup({
      LocalName : new FormControl('', [Validators.required]),
      LocalSim : new FormControl('', [Validators.required])
      // LocalEmail : new FormControl('', [Validators.required])
    });
  }

  async ngOnInit() {
    this.userId = await localStorage.getItem('my-userId');
    console.log('userId --> ' + JSON.stringify(this.userId));
  }


  async onSubmit(){

    await this.api.postData('api/visitors/' + this.userId ,{'userId': this.userId,'name':this.name,'email':this.email,'sim':this.sim,'address':this.address,'gender':this.gender,'avatar':this.avatar});
    
  }

  closeModal(){
    this.modalController.dismiss();
  } 

      // ---- Animation controller  ----------------------------------
  async modalContacts() {
    const modal = await this.modalController.create({
      component: ContactsPage,
      cssClass:"my-modal",
      componentProps: {contact: this.contactSelected}
    });

    modal.onDidDismiss()
    .then(async (data) => {
      this.name = '';
      this.email = '';
      this.sim ='';
      this.contactSelected = await data['data'];
      await console.log('Data received -->', this.contactSelected)
      this.name = await this.contactSelected.name['display'];
      if(this.contactSelected.phones){
        this.sim = this.contactSelected.phones[0]['number'];
      }
      if(this.contactSelected.emails){
        this.email = this.contactSelected.emails[0]['address'];
      }
    });
  
    modal.present()
  }
  
         // -------   toast control alerts    ---------------------
   toastEvent(msg:string){
    this.myToast = this.toast.create({
      message:msg,
      duration:2000
    }).then((toastData) =>{
      console.log(toastData);
      toastData.present();
    });
  }


}
