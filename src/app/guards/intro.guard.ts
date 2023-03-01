import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export const INTRO_KEY = 'intro-seen';
@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  constructor(private router: Router){}
  async canLoad(): Promise<boolean>  {
    const hasSeenIntro = await localStorage.getItem(INTRO_KEY)
    if(hasSeenIntro && (hasSeenIntro === 'true')){
      return true;
    }else{
      this.router.navigateByUrl('/intro', { replaceUrl : true});
      return true;
    }
  }
}
