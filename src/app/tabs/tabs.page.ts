import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  SoyAdmin : boolean = false;
  myRoles:any;
  constructor() {}

  async ionViewWillEnter(){
    console.log('------------------ ionViewWillEnter tabs.page ----------------');
    localStorage.getItem('IsAdmin') === 'true' ? this.SoyAdmin = true : this.SoyAdmin = false ;
    console.log('tabs Soy admin -->' ,this.SoyAdmin);
  }

}
