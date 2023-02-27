import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { environment } from "../../environments/environment";
import { DatabaseService  } from "../services/database.service";
import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";


const helper = new JwtHelperService();

const REFRESH_TOKEN_KEY = 'my-refresh-token';
const TOKEN_KEY = 'my-token';
const USERID = 'my-userId';
const USER_ROLES = 'my-roles';
const MY_SIM = 'my-sim';
const CORE_SIM = 'my-core-sim';
const USER_ROLE = 'my-role';
const CORE_NAME = 'core-name';
const LOCATION = 'location';
const TWILIO = 'twilio';
const CODE_EXPIRY = 'code_expiry';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }
}
