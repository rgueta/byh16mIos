import { Component, OnInit } from '@angular/core';
import { ModalController,AlertController, isPlatform, 
  ToastController, LoadingController} from '@ionic/angular';
import { Contacts, GetContactsResult } from "@capacitor-community/contacts";
// import { Observable } from 'rxjs';

// import { Observable } from 'rxjs/internal/Observable';
// import { Contact } from 'src/app/phone-contacts';



@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  myToast : any;
  // public contacts: Observable<[Contact]>;
  // contacts: Observable<Contact[]>;
  // contacts: Observable<Contact[]>;
  // public contacts? : GetContactsResult;
  public contacts : any = [];
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
          }

        }).then(async (result) => {
          this.contacts = await result.contacts;
          console.log('Contacts ---> ', this.contacts);
          console.log('Contacts.name ---> ', this.contacts[0].name.display);
          localStorage.setItem('lista',JSON.stringify(this.contacts));
        });

        // .then(result =>{
        //   this.contacts = result;
        //   console.log('Contacts --> ',this.contact);
        // });


        }catch(e){
          console.log('Error to get contacts --> ', e);
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
