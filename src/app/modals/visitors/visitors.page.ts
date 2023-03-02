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
  contactSelected:{};
  userId : string;

  constructor(
            private modalController : ModalController,
            private toast : ToastController,
            public api:DatabaseService,
            private animationController : AnimationController,
  ) { 
    this.RegisterForm = new FormGroup({
      LocalName : new FormControl('', [Validators.required]),
      LocalSim : new FormControl('', [Validators.required]),
      LocalEmail : new FormControl('', [Validators.required])
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
        const enterAnimation = (baseEl: any) => {
          const backdropAnimation = this.animationController.create()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');
    
          const wrapperAnimation = this.animationController.create()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
              { offset: 0, opacity: '0', transform: 'scale(0)' },
              { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);
    
          return this.animationController.create()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(700)
            .addAnimation([backdropAnimation, wrapperAnimation]);
        }
    
        const leaveAnimation = (baseEl: any) => {
          return enterAnimation(baseEl).direction('reverse');
        }
    
        const modal = await this.modalController.create({
          component: ContactsPage,
          enterAnimation,
          leaveAnimation,
          componentProps: {contact: this.contactSelected}
        });
  
        modal.onDidDismiss()
        .then((data) => {
          this.name = '';
          this.email = '';
          this.sim ='';
          this.contactSelected = data['data']
  
          // const phoneAcc = Object.keys(this.contactSelected['phoneNumbers']).length
          // const emailsAcc = Object.keys(this.contactSelected['emails']).length;
  
          // this.name = this.contactSelected['displayName'];
          // if(phoneAcc > 0)  this.sim = this.contactSelected['phoneNumbers'][0]['number'];
          
          // if(emailsAcc> 0) this.email = this.contactSelected['emails'][0]['address'];
        });
  
        return await modal.present();
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
