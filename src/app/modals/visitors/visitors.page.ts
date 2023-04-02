import { Component, OnInit, Input } from '@angular/core';
import { ModalController,AlertController, isPlatform, ToastController, AnimationController } from '@ionic/angular';
import { Validators, FormControl, FormBuilder, FormGroup} from "@angular/forms";
import { DatabaseService } from "../../services/database.service";
import { ContactsPage } from "../../modals/contacts/contacts.page";
import { HttpClient } from "@angular/common/http";
import { switchMap } from 'rxjs/operators'


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
  pkg: {} = {};

  pkg2 = {
    "name" : "Atsushi Mikami",
    "email" : "atsushi.mikami@d4cpd.com",
    "sim" : "+1 (858) 735-0751",
    "uuid" : "+1 (858) 735-0751",
    "address" : "San Diego"
  }

  constructor(
            private modalController : ModalController,
            private toast : ToastController,
            public api:DatabaseService,
            private animationController : AnimationController,
            private http: HttpClient

  ) { 
    this.RegisterForm = new FormGroup({
      LocalName : new FormControl('', [Validators.required]),
      LocalSim : new FormControl('', [Validators.required]),
    });
  }

  async ngOnInit() {
    this.userId = await localStorage.getItem('my-userId');
  }


  async readVisitors(){

    // this.pkg = await this.http.get('assets/visitors.json').pipe(
    //   switchMap((res:any) => res.json()
    //   ))
    
      
    //   console.log('visitors --> ' + JSON.stringify(this.pkg));
    

    await this.http.get('assets/visitors.json').subscribe((res) =>{
      this.pkg = res;
      console.log('visitors --> ' + JSON.stringify(this.pkg));
    })
  }

  async insertVisitor(){
    const options = {Headers, responseType: 'json' as 'blob'};
    this.http.put('assets/visitors.json', this.pkg2, options).subscribe(
      data => {
         console.log(data);
      })
  }

  async onSubmit_(){
    await this.api.postData('api/visitors/' + this.userId ,{'userId': this.userId,'name':this.name,'email':this.email,'sim':this.sim,'address':this.address,'gender':this.gender,'avatar':this.avatar}).then(
      (result) => this.modalController.dismiss(),
      (err) => alert('No se agrego el contacto')
    );

  }

  async onSubmit(){
    await this.api.postData('api/visitors/' + this.userId ,{'userId': this.userId,'name':this.name,'email':this.email,'sim':this.sim,'address':this.address,'gender':this.gender,'avatar':this.avatar}).then(async result => {
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
