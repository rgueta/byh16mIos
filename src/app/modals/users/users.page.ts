import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from "@ionic/angular";
import { DatabaseService  } from "../../services/database.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users : any;
  automaticClose = false;
  constructor(
    private modalController:ModalController,
    private alertCtrl:AlertController,
    private api:DatabaseService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers(){
    await this.api.getData('api/users/core/' + localStorage.getItem('core-id')).subscribe(async (result:any) => {
      this.users = result;
      this.users[0].open = true;
      console.log('users -->', this.users);
    });

  }

  toggleSection(index:number){
    console.log('toggleSection index--> ', index)
    this.users[index].open = !this.users[index].open;
    if(this.automaticClose && this.users[index].open){
      this.users
      .filter((item:{}, itemIndex:number) => itemIndex != index)
      .map((item:any) => item.open = false);
    }
  }

  async chgLockStatus(event:any,userStatus:any, id:string, name:string) {
    let element = <HTMLInputElement> document.getElementById("disableToggle");
    let titleMsg = 'UnLock ';
    console.log('event -->' ,event)
    console.log('users status --> ', userStatus)

    if(event.target.checked)
    {
      titleMsg = 'Lock ';
    }
    if(event.target.checked != userStatus){
      let alert = await this.alertCtrl.create({
        header: 'Confirm',
        message: titleMsg + '[ ' + name + ' ] ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'icon-color',
            handler: () => {
              element.checked = !event.target.checked;
            }
          },
          {
            text: 'Ok',
            cssClass: 'icon-color',
            handler: async data => {
              if(event.target.checked){
                await this.api.postData('api/users/lock/' + id,{'userId' : id}).then(async (onResolve) =>{
                  await this.getUsers();
                },
                (onReject) =>{
                  console.log('Can not enable core, ', onReject);
                });
                // console.log('Se bloqueara el usuario ', id);
              }else{
                // console.log('api/cores/disable/',{'coreId': id});
                await this.api.postData('api/users/unlock/' + id,{'userId' : id}).then(async (onResolve) =>{
                  await this.getUsers();
                },
                (onReject) =>{
                  console.log('Can not disable core, ', onReject);
                });
                // console.log('Se Desbloqueara el usuario ', id);

              }
                
            }
          }
        ]
      });

    await alert.present();
    }
  }

  removeVisitor(index:number,item:any){

  }

  closeModal(){
    this.modalController.dismiss();
  } 

}
