import { Component, Input, OnInit,NgModule  } from '@angular/core';
import { ModalController,AlertController, Platform, ToastController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Utils } from '../../tools/tools';
// import { element } from 'protractor';
import { Sim } from "@ionic-native/sim/ngx";
import { SMS, SmsOptions } from "@ionic-native/sms/ngx";
import { Validators, FormControl, FormBuilder, FormGroup} from "@angular/forms";
import { timeoutWith } from 'rxjs/operators';
import { Router } from '@angular/router';

const USERID = 'my-userId';

@Component({
  selector: 'app-upd-codes-modal',
  templateUrl: './upd-codes-modal.page.html',
  styleUrls: ['./upd-codes-modal.page.scss'],
})
export class UpdCodesModalPage implements OnInit {
  @Input() code:string;
  @Input() visitorSim:string;
  @Input() range:Number;
  @Input() localComment:string;
  myVisitors:any;
  // public UpdCodeForm: FormGroup;
  
  selectdVisitor:any;
  initial: any = new Date().toISOString();
  expiry : any = new Date().toISOString();
  diff: any;
  userId = {};
  StrPlatform = '';
  comment = '';
  visitorId='';
  public code_expiry:any;

  // -- Validators  ------------

  UpdCodeForm =  this.formBuilder.group({
    visitor: ['',Validators.required],
    visitorSim: ['',Validators.required]
    // visitorSim: new FormControl(['',Validators.required])

  });

  get visitor(){
    return this.UpdCodeForm.get('visitor');
  }

  public get sim(){
    return this.UpdCodeForm.get('sim');
  }
  
  constructor(public modalController : ModalController,
              public api : DatabaseService,
              public platform : Platform,
              public libSim : Sim,
              public formBuilder: FormBuilder,
              public sms:SMS,
              public toast:ToastController,
              private alertController: AlertController,
              private router: Router, ) { }


  async ngOnInit() {
    // this.userId = await this.storage.get('my-userId')
    // this.userId = await Storage.get({key :USERID});
    this.userId = await localStorage.getItem('my-userId');

    this.code_expiry = Number(await localStorage.getItem('code_expiry'));

    console.log('Soy el usuario : ' + this.userId + ', code_expiry: ' + this.code_expiry.toString());
    this.code = this.genCode().toString();
    this.getVisitors();
    this.initDates();
    this.getPlatform();

  

    this.libSim.hasReadPermission().then(
      (info) => console.log('Has permission: ', info)
    );
    
    this.libSim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );

    this.libSim.getSimInfo().then(
      (info) => console.log('Sim info: ' , info ),
      (err) => console.log('Unable to get sim info: ', err)
    );

  }

getPlatform(){
  console.log('Platform : ' + this.platform.platforms);
  if (this.platform.is('android')){
    this.StrPlatform = 'android';
  }
  else if(this.platform.is('ios')){
    this.StrPlatform = 'ios';
  }else if(this.platform.is('desktop')){
    this.StrPlatform = 'desktop';
  }else if(this.platform.is('mobile')){
    this.StrPlatform = 'mobile';
  }else{
    this.StrPlatform = 'other';
  }
}


  async initDates(){
    this.initial = new Date();
    this.expiry = new Date(new Date().setHours(new Date().getHours() + this.code_expiry));
    this.diff =  await (Math.abs(this.initial.getTime() - this.expiry.getTime()) / 3600000).toFixed(1);

    this.initial = await new Date().toISOString();
    this.expiry =  await new Date(new Date().setHours(new Date().getHours() + this.code_expiry)).toISOString();
  }


  async onChangeInitial(init:any){
    if(new Date(init) >= new Date(this.expiry)){
      alert('Tiempo inicial debe ser menor al tiempo final');
      this.initDates();
      return;
    }else{
      // var initTemp = new Date(init);
      this.initial = await new Date(init);
      this.expiry = await new Date(this.expiry);
      
      this.diff =  await (Math.abs(this.initial.getTime() - this.expiry.getTime()) / 3600000).toFixed(1);
      console.log('Initial : ' + Utils.convDate(this.initial) + '\nExpiry :  ' + Utils.convDate(this.expiry) + '\nDiff hrs. ' + this.diff);
    }

  }

  async onChangeExpiry(expiry:any){
    if(new Date(expiry) <= new Date(this.initial)){
      alert('Tiempo final debe ser meyor al tiempo inicial');
      this.initDates();
      return;
    }else{
      this.initial = await new Date(this.initial);
      this.expiry = await new Date(expiry);

      this.diff = await (Math.abs(this.initial.getTime() - this.expiry.getTime()) / 3600000).toFixed(1);
    console.log('Initial : ' + this.initial + '\nExpiry :  ' + this.expiry + '\nDiff hrs. ' + this.diff);
    }
  }

  async getVisitors(){
    this.myVisitors = await JSON.parse(localStorage.getItem('visitors'))

    //Sort Visitors by name
    this.myVisitors = await Utils.sortJsonVisitors(this.myVisitors,'name',true);


}

  newCode(){
    // console.log('generate ne code..!');
    this.code = this.genCode().toString();
    // alert(this.genCode())[0];
    // this.genCode();
  }

   genCode(){
    var result           = [];
    var characters       = '0123456789ABCD';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
       result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));

   }
   return result.join('');
  }

  async onChangeComment($event:any){
    console.log('comment -> ' + $event);
    this.localComment = $event;
  }


  async onSubmitTemplate(){
    var dateInit = '';
    var dateFinal = '';
    // const sim =  await this.storage.get('my-core-sim')
    const coreSim =  await localStorage.getItem('my-core-sim')
    const userSim =  await localStorage.getItem('my-sim')
    const coreName = await localStorage.getItem('core-name')
    const expire = await ((new Date(this.expiry).getTime() - new Date().getTime() ) / 3600000).toFixed(1)


    console.log('API -->')
    console.log('api/codes/' + this.userId + JSON.stringify({'code':this.code,'sim':this.visitorSim,
       'initial': Utils.convDate(new Date(this.initial)),
       'expiry' : Utils.convDate(new Date(this.expiry)),'visitorId' : this.visitorId ,'comment': this.localComment}) + JSON.stringify(
       {'source': {'user' : this.userId,'platform' : this.StrPlatform, 'id' : userSim}}));


    try{

      this.api.postData('api/codes/' + this.userId,{'code':this.code,'sim':this.visitorSim,
       'initial': Utils.convDate(new Date(this.initial)),
       'expiry' : Utils.convDate(new Date(this.expiry)),'visitorId' : this.visitorId ,'comment': this.localComment,
       'source': {'user' : this.userId,'platform' : this.StrPlatform, 'id' : userSim}}).then(async resp => {
        
//------- Uncomment, just to fix bug 
        const respId = await Object.values(resp)[1];

        await console.log('response from aPI --> ', respId);
        
         // Send code to core
        const pckgToCore = await 'codigo,' + this.code +','+ Utils.convDate(new Date(this.expiry)) 
        + ',' + this.userId + ',' + this.visitorSim + ',' + respId

        await console.log('send to core module --> ', pckgToCore);
        
      // await this.sendSMS(coreSim, pckgToCore);

      //  // send code to visitor
      //  await this.sendSMS(this.visitorSim,'codigo ' + coreName + ': ' + this.code + 
      //  '  Expira en ' + expire + ' Hrs.' )

      //  this.closeModal();
 
      // //  this.showAlerts('Message', 'Se envio el codigo')

       },error =>{
          alert('No se pudo enviar el codigo');
       });

    }catch(err){
        console.log('Can not post data : ', err);
    }
    
    // this.api.sendPostRequest('api/newCode',{'code':this.code,'sim':this.sim,'range':this.range});
  }


  async sendSMS(sim:string,text:string){
    var options:SmsOptions={
      replaceLineBreaks:false,
      android:{
        intent:''
      }
    }

    const use_twilio =  await localStorage.getItem('twilio');

    try{

      if(use_twilio == 'false'){
        console.log('sim --> ',sim);
        console.log('text --> ',text);
        await this.sms.send(sim,text);
      }else{
        console.log('url -- >   api/twilio/' + this.userId + '/' + text + '/' + sim);
        this.api.postData('api/twilio/open/' + this.userId + '/' + text + '/' + sim,'')
      }

        // this.showAlerts('Message', 'Se envio el codigo')

        // const toast = await this.toast.create({
        //   message : 'Text was sent !',
        //   duration: 4000
        // });

        //   toast.present();
        
    }
    catch(e){
      // alert('Text was not sent !')
      const toast = await this.toast.create({
        message : 'Text was not sent !.. error: ' + e,
        duration: 3000
      });

        toast.present();
      }
  }
  
  // async setupCode(visitorId,visistorSim){
    async setupCode(event:any){
      this.visitorSim = this.selectdVisitor.sim;
      this.visitorId = this.selectdVisitor._id;
    //  Object.entries(this.myVisitors).forEach(async ([key,item]) =>{
    //    Object.keys(item).forEach(async (key) => {
    //     console.log('setupCode visitorSim --> ',item['sim'])
    //      if(item['_id'] === item['_id'] && key === 'sim'){
    //        this.visitorId = await item[key];
    //        console.log('setupCode visitorSim --> ',item[key])
    //      }
        
    //    })
    //   });
    
  } 

   // -------   show alerts              ---------------------------------
   async showAlerts(header:string,message:string){
    const MsgAlert = await this.alertController.create({
      cssClass : "basic-alert",
      header: header,
      message: message,
      buttons: [
        { text : 'OK',
        handler : () => {
          this.closeModal();
          // const url = '/codes'
          // this.router.navigateByUrl(url, {replaceUrl: true});
          // this.router.navigate([url] , { state : { from : 'login'}  }); //send parameters
        }
        
      }
      ],
    });
    await MsgAlert.present();
  }

  closeModal(){
    this.modalController.dismiss();
  } 

}
