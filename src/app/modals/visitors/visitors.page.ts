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
  @Input() name:string = '';
  @Input() email:string = '';
  @Input() sim: string = '';
  @Input() address: string= '';
  // @Input() gender:String;
  @Input() avatar: string = '';


  myToast : any;
  public gender = "M";
  // contacts: Observable<Contact[]>;
  contacts: [];
  contactSelected:any = {};
  userId : string;

  visitors:any;
  vis_pkg : any;

  constructor(
            private modalController : ModalController,
            private toast : ToastController,
            public api:DatabaseService,
            private animationController : AnimationController,

  ) { 
    this.RegisterForm = new FormGroup({
      LocalName : new FormControl('', [Validators.required]),
      LocalSim : new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    this.userId = await localStorage.getItem('my-userId');
    this.visitors = await this.readVisitors();
    console.log('actual visitors --> ', this.visitors);
  }


  async readVisitors(){
    return await fetch('assets/visitors.json')
    .then((res:any) => res.json())
  }

  async appendVisitor(pkg:any){
    await this.visitors.push(pkg);
    console.log('visitor added --> ', this.visitors)
  }

  async onSubmit(){
    this.vis_pkg = {'name':this.name,'email':this.email,'sim':this.sim,'address': this.address,'gender': this.gender}

    this.appendVisitor(this.vis_pkg);

  }

  async onSubmit_(){
    await this.api.postData('api/visitors/' + this.userId ,{'userId': this.userId,'name':this.name,'email':this.email,'sim':this.sim,'address':this.address,'gender':this.gender,'avatar':this.avatar}).then(async (result:any) => {
      console.log('omSubmit Closing modal ...!');
        await this.closeModal()
      }, err => {
        alert('No se agrego el contacto');
      }

    );

  }

        // ---- Animation controller  ----------------------------------
  async modalContacts() {
    const modal = await this.modalController.create({
      component: ContactsPage,
      backdropDismiss:true,
      cssClass:"my-modal",
      componentProps: {contact: this.contactSelected}
    });

    modal.onDidDismiss()
    .then(async (data) => {
      this.name = '';
      this.email = '';
      this.sim ='';
      this.contactSelected = await data['data'];

      if(this.contactSelected.phones){
        this.name = await this.contactSelected.name['display'];
      }
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

  closeModal(){
    console.log('Closing modal ...!');
    this.modalController.dismiss(null,'dismiss');
  } 


}
