import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController} from "@ionic/angular";
import { DatabaseService } from '../../services/database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upd-cpus',
  templateUrl: './upd-cpus.page.html',
  styleUrls: ['./upd-cpus.page.scss'],
})
export class UpdCpusPage implements OnInit {
  public userId : any;
  public CpuList:any;
  automaticClose = false;
  routineOpen=false;
  isReadOnly: boolean = true;
  myToast : any;
  backup_cpus : any = [];

  constructor(
    public modalController : ModalController,
    public api : DatabaseService,
    private alertCtrl :AlertController
  ) { 
    this.getCpus();
  }

  ngOnInit() {
    // this.getCpus();
  }

  async doRefresh(event:any){
    this.isReadOnly = true;
    this.getCpus();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  toggleSection(index:number){
    this.CpuList[index].open = !this.CpuList[index].open;
    if(this.automaticClose && this.CpuList[index].open){
      this.CpuList
      .filter((item:{}, itemIndex:number) => itemIndex != index)
      .map((item:any) => item.open = false);
    }
  }

  async getCpus(){
    this.userId = await localStorage.getItem('my-userId');
    let location = localStorage.getItem('location').split('.');

    this.api.getData( 'api/cpus/full/' + `${location[0]},${location[1]},${location[2]},${location[3]}/`).subscribe(async (result:any) =>{
      result.forEach(async (element:any) => {
        await this.backup_cpus.push(element);
      });
      this.CpuList = await result;
      // this.backup_cpus = await result;
      this.CpuList[0].open = true;
    },error => {
      console.log('Error response --> ', error)
    });
  }

  async updCpu(obj:any,value:boolean,index:number, item:any){
    this.isReadOnly = value;
    if(obj.target.innerHTML === 'Save'){ 
      console.log('Save to mongo ! --> ', item);

      const MsgAlert = await this.alertCtrl.create({
        header: 'Confirmacion',
        message: 'Save changes ?',
        buttons: [
          { 
            text : 'OK',
            handler : () => {
              console.log('grabar --> ', this.CpuList[index]);
              this.isReadOnly = true;
            }
          },
          {
            text:'Cancelar',
            role:"cancel",
            cssClass :"secondary",
            handler :()=>{
              console.log("Return to --> ", this.backup_cpus);
          }
        }
        ]
      });

      await MsgAlert.present();

      
    }else{
      console.log('Solo para modo edicion');
      this.isReadOnly = false;
    }
  }

  CancelUpd(){
    this.isReadOnly = true;
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
