import { Component } from '@angular/core';
import { ModalController, AnimationController,ToastController, AlertController } from "@ionic/angular";
import { SMS, SmsOptions } from '@ionic-native/sms/ngx';
import { DatabaseService } from '../services/database.service';
import { VisitorsPage } from '../modals/visitors/visitors.page';
import { Utils } from "../tools/tools";


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})

export class Tab4Page {
  public VisitorsList:any;
  public myVisitorsList:any;
  automaticClose = false;
  userId = {};
  public alertButtons = ['OK'];

  constructor(
        public animationController : AnimationController,
        public modalController : ModalController,
        public api : DatabaseService,
        private sms: SMS,
        private toast: ToastController,
        public alertCtrl : AlertController
  ) {}

 async ngOnInit() {
  this.userId = await localStorage.getItem('my-userId');
    this.getVisitors();
  }

  async doRefresh(event:any) {
    this.getVisitors();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async refreshVisitors(){
    this.getVisitors();
  }


  async getVisitors(){
    this.VisitorsList = await JSON.parse(localStorage.getItem('visitors'))

    //Sort Visitors by name
    this.VisitorsList = await Utils.sortJsonVisitors(this.VisitorsList,'name',true);

    this.VisitorsList[0].open = true;
  }


  async removeVisitor(index:number,name:string){
    const alertControl = await this.alertCtrl.create({
      header: 'Borrar al visitante ?',
      message: name,
      buttons: [
        {
        text: 'Cancelar',
          role: 'cancel',
          cssClass: 'icon-color',
          handler: () => {}
        },{
            text:'Si',
            handler:async () => {
              try{
                console.log('Se borrara --> ', this.VisitorsList[index]);
                this.VisitorsList.splice(index,1)
                localStorage.setItem('visitors',JSON.stringify(this.VisitorsList));
                this.VisitorsList[0].open = true;
              }
              catch(e){
                alert('No se pudo borrar');
              }
            }
          }
      ]
    });

    await alertControl.present();

  }

  toggleSection(index:number){
    this.VisitorsList[index].open = !this.VisitorsList[index].open;
    if(this.automaticClose && this.VisitorsList[index].open){
      this.VisitorsList
      .filter((item:[], itemIndex:number) => itemIndex != index)
      .map((item:any) => item.open = false);
    }
  }


  async modalVisitors() {
    const modal = await this.modalController.create({
      component: VisitorsPage,
      backdropDismiss:true
    });

    modal.onDidDismiss().then(_ => {
       this.getVisitors();
     });

    return await modal.present();
  }



  async update(field:string,visitorId:string,visitor:string,ActualValue:string) {
    let dbField ='email';
    switch (field){
      case 'direccion':
        dbField = 'address';
        break;
      case 'telefono':
        dbField = 'sim';
        break;
    }

    const alert = await this.alertCtrl.create({
        header: 'Cambios a ' + visitor,
        message: 'Escribe los cambios a ' + field,
        backdropDismiss: false,
        inputs: [{name: dbField,value:ActualValue, placeholder: field }],
        buttons: [{ text: 'Cancelar', role: 'cancel',handler : () =>{} },
                  { text: 'Cambiar', handler: async (data:any) => {
                        try{
                          await this.api.putData('api/visitors/simple/' + 
                          this.userId + '/' + visitorId,data)
                          .then(async resp =>{
                              console.log('response --> ', resp)
                          },
                          error => {
                            this.errorUpdate(field);
                          });
                        }catch(err){
                          console.log('Can not change ' + field, err);
                        }
                      
                    }
                  }
                 ]
    });
    await alert.present();
  }


  async errorUpdate(field:string){
    alert('Cambio no realiado a ' + field);
  }


  async updateGender(visitorId:string,visitor:string,ActualValue:any){
    let Male = false;
    let Female = false;
    let Other = false;
    if (ActualValue == 'M'){
      Male = true;
    }else if (ActualValue == 'F'){
      Female = true;
    }else{
      Other = true;
    }

    let alertGender = await this.alertCtrl.create({
      header: 'Cambiar genero de ' + visitor,
      message: 'Favor de seleccionar el nuevo genero',
      backdropDismiss: true,
      inputs: [{name:'Mujer', type:'radio', label: 'Mujer', value:'F',checked:Female},
               {name:'Hombre',type:'radio', label: 'Hombre', value:'M' ,checked:Male},
               {name:'Otro',type:'radio', label: 'Otro', value:'O' ,checked:Other}
              ],
      buttons: [{ text: 'Cancelar', role: 'cancel',handler : () =>{} },
                { text: 'Cambiar', handler: async (data:any) => {
                    if (data == ActualValue) {
                      console.log('Same value')
                    }else{
                      data = {'gender' : data}
                      try{
                        await this.api.putData('api/visitors/simple/' + 
                          this.userId + '/' + visitorId,data)
                        await this.getVisitors()
                      }catch(err){
                        console.log('Can not change gender' , err);
                      }
                    }
                  }
                }
               ]
  });
  await alertGender.present();
  }

}



