import { Component, OnInit } from '@angular/core';
import { ModalController,AlertController, isPlatform, 
  ToastController, LoadingController} from '@ionic/angular';
import { Contacts } from "@capacitor-community/contacts";
import { Observable } from 'rxjs';
import { Contact } from 'src/app/phone-contacts';
// import { Contact } from '@byrds/capacitor-contacts';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  myToast : any;
  // contacts: Observable<[Contact]>;
  contacts: Observable<Contact[]>;
  // contacts : any;
  // Contacts : {}
  contact = {};
  constructor(private modalController : ModalController,
              private loadingController : LoadingController,
              private toast: ToastController,) {
   }

  async ngOnInit() {
    this.loadContacts();
    this.basicLoader();
  }

  async loadContacts(){
    if(isPlatform('android')){
      try{
        console.log('Soy plataforma android...')
        // await Contacts.getPermissions().then(response => {
        //   if (!response.granted){
        //     console.log('No permission granted...!');
        //     // await loading.dismiss(); 
        //     return
        //   }
        // });

        
        
        // Contacts.getContacts().then(async result => {
        //   const phoneContacts: [Contact] = await result.contacts;
        //   this.contacts = await of(phoneContacts);
        // })

        await Contacts.getContacts({
          projection: {
            // Specify which fields should be retrieved.
            name: true,
            phones: true,
            postalAddresses: true,
            emails:true
          },
        }).then(result =>{
          this.contacts = result;
          console.log('Contacts --> ',this.contact);
        });

        

        }catch(e){
          console.log('Error to get permissions --> ', e);
      }
    }
  }

  basicLoader() {
    this.loadingController.create({
        message: 'Please wait...',
        duration: 3000,
        translucent: true
    }).then((res) => {
        res.present();
    });
}

  async onClickContact(Contact: {}){
    this.contact = Contact;
    this.closeModal();
  }

  closeModal(){
    this.modalController.dismiss(this.contact);
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
