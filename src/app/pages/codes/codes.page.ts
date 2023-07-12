import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ToastController, ModalController,
         AnimationController } from '@ionic/angular';
import { UpdCodesModalPage } from '../../modals/upd-codes-modal/upd-codes-modal.page';
import { Utils } from '../../tools/tools';
import { SMS, SmsOptions } from '@ionic-native/sms/ngx';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.page.html',
  styleUrls: ['./codes.page.scss'],
})
export class CodesPage implements OnInit {

  CodeList:any;
  myToast:any;
  userId = {};
  automaticClose = false;
  codeEnabled:any;

  initial: any;
  expiry : any;
  diff: any;
  myRoles:{};
  myToken:any;
  load_codes : true;

  constructor(public api : DatabaseService,
              public toast:ToastController,
              public modalController: ModalController,
              public animationController : AnimationController,
              private sms: SMS) { }

  async ngOnInit() {
    
    this.myToken = await localStorage.getItem('my-token');
    let uId = await localStorage.getItem('my-userId');
    this.userId = await uId;
    this.myRoles = await localStorage.getItem('my-roles');

    // console.log('ngOnInit at codes.page roles --> ', this.myRoles);
    this.collectCodes(); 
  }


  async collectCodes(){
    this.api.getData_key('api/codes/user/' + this.userId, 
      this.myToken).subscribe(async result =>{
      Object.entries(result).forEach(async ([key,item]) =>{
          if(new Date(item.expiry) < new Date()){
            item.expired = true;
          }else{
            item.expired = false;
          }

          item.range = await ((new Date(item.expiry).getTime() - 
            new Date().getTime() ) / 3600000).toFixed(1);
      });
      
      this.CodeList = await result;
      this.CodeList[0].open = true;
      this.initial = this.CodeList[0].initial;
      this.expiry = this.CodeList[0].expiry;
      });

      // await this.HrsRange();
  }

  async doRefresh(event:any){
    this.collectCodes();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  toggleSection(index:number){
    console.log('toggleSection index--> ', index)
    this.CodeList[index].open = !this.CodeList[index].open;
    if(this.automaticClose && this.CodeList[index].open){
      this.CodeList
      .filter((item:{}, itemIndex:number) => itemIndex != index)
      .map((item:any) => item.open = false);
    }
  }

  async sendCode(visitorId:string){
    var pkg : {};

    var options:SmsOptions={
      replaceLineBreaks:false,
      android:{
        intent:''
      }
    }
    // const sim =  await this.storage.get('my-core-sim');
    const sim =  await localStorage.getItem('my-core-sim');

    await Object.entries(this.CodeList).forEach(async (key,  item:any) =>{
      if(item['_id'] === visitorId){
        let pkg = item;
        pkg['initial'] = await Utils.convDate(this.initial);
        pkg['expiry'] = await Utils.convDate(this.expiry);
        pkg['enable'] = await  this.codeEnabled;
        delete pkg['expired'];
        delete pkg['open'];
        // delete pkg['visitorSim'];
        delete pkg['visitorName'];
        delete pkg['email'];

        try{
          await this.api.putData('api/codes/update/' +  
                          pkg['userId'] + '/' + pkg['_id'] ,pkg)

        }catch(err){
            console.error('Error api putData --> ' + err);
        }
      }
    });
    
   
    try{

      // await this.sms.send(sim,'codigo,' + pkg[code]+ ','+ pkg['expiry'] + ',' + pkg['_id']);
      // // alert('Text was sent !')
        const toast = await this.toast.create({
          message : 'Text sent to ' + sim,
          duration: 4000
        });

        this.collectCodes(); 
        toast.present();
          
        
    }
    catch(e:any){
      // alert('Text was not sent !')
      const toast = await this.toast.create({
        message : 'Text was not sent !.. error: ' + e.message,
        duration: 3000
      });

        toast.present();
      }

  }

  async ResendCode(code:string,visitorId:string,Initial:any,Expiry:any){
    // var pkg : {};
    var pkg = {'code':'','_id':'','initial':'','expiry':''};

    console.log('Resend code --> ', 'codigo : ' + code +' ,Initial : '+ Initial + ' ,Expiry : ' + Expiry + ', _id : ' + visitorId)


    return;

    var options:SmsOptions={
      replaceLineBreaks:false,
      android:{
        intent:''
      }
    }
    // const sim =  await this.storage.get('my-core-sim');
    const sim =  await localStorage.getItem('my-core-sim');

    pkg['code'] = code;
    pkg['_id'] = visitorId;
    pkg['initial'] = Utils.convDate(Initial);
    pkg['expiry'] = Utils.convDate(Expiry);


    console.log('Resend code --> ', 'codigo,' + pkg['code'] +','+ pkg['expiry'] + ',' + pkg['_id'])

    try{
      if(environment.app.debugging_send_sms){
        await this.sms.send(sim,'codigo,' + pkg['code'] +','+ pkg['expiry'] + ',' + pkg['_id']);
          const toast = await this.toast.create({
            message : 'Text was sent !',
            duration: 4000
          });

          this.collectCodes(); 
          toast.present();
      }  
        
    }
    catch(e:any){
      // alert('Text was not sent !')
      const toast = await this.toast.create({
        message : 'Text was not sent !.. error: ' + e.message,
        duration: 3000
      });

        toast.present();
      }

  }

  async onChangeExpiry(codeId:string,initial:any,expiry:any){
    console.log('OnChange event ptriggered');
    // this.initial = new Date(initial);
    // console.log('initital: ' + initial + ', expiry: ' + expiry)
    if(new Date(expiry) <= this.initial){
      alert('Tiempo final debe ser meyor al tiempo inicial');
      return;
    }else{
      this.expiry = new Date(expiry);
      this.diff = await (Math.abs(new Date().getTime() - this.expiry.getTime()) / 3600000).toFixed(1);
      if (this.diff > 0){

        var arrFound = this.CodeList.find((item:any,i:number) =>{
          if (item['_id'] == codeId){
            
            console.log('Si te encontre -->', item['code'])
            console.log('Del CodeList -->', this.CodeList[i]['code'])
            this.CodeList[i].changed = true;
          }
        })

        this.codeEnabled = true;
      }
    console.log('Initial : ' + this.initial + '\nExpiry :  ' + this.expiry + '\nDiff hrs. ' + this.diff);
    }
  }

  async onChangeInitial(initial:any,expiry:any){
    console.log('onChangeInitial -> ' + initial)
    if(new Date(initial) >= expiry){
      alert('Tiempo inicial debe ser menor al tiempo final');
      return;
    }else{
      this.initial = new Date(initial);
      // this.diff =  await (Math.abs(this.initial.getTime() - this.expiry.getTime()) / 3600000).toFixed(1);
      console.log('Initial : ' + Utils.convDate(this.initial) + '\nExpiry :  ' + Utils.convDate(this.expiry) + '\nDiff hrs. ' + this.diff);
    }
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

        // ---- Animation controller  ----------------------------------

  async addCode() {
    const modal = await this.modalController.create({
      component: UpdCodesModalPage,
    });
    return await modal.present();
  }

}
