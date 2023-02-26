import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  SoyAdmin = localStorage.getItem('IsAdmin');
  myRoles:any;
  constructor() {}

}
