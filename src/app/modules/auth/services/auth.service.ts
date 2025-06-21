import { EventEmitter, Injectable, inject } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { LoginViewModel } from '../models/account-model';
import { AuthJWTToken, AuthToken, JwtResponse } from '../models/token';
import { BehaviorSubject, Observable, filter, map, mergeMap, of, share, timer } from 'rxjs';
import { Router } from '@angular/router';
import { ApiOkResponse } from '../../shared/models/api-response';
import { HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService<LoginViewModel> {

  sessionExpiredEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _getSessionStorage: string = "getSessionStorage";
  private _sessionStorage: string = "sessionStorage";
  private _removeSessionStorage: string = "removeSessionStorage";
  private _refreshTokenStartedStorage: string = "refreshTokenStartedStorage";
  private _refreshTokenStorage: string = "refreshTokenStorage";
  private _shareTimeoutStorage: string = "shareTimeoutStorage";

  protected key = 'cs_auth_app_token';
  private _remember?: boolean;
  private _jwtResponse?: JwtResponse;
  private _checkSession?: boolean;
  private _authJWTToken?: AuthJWTToken;
  protected _token$: BehaviorSubject<AuthToken | undefined> = new BehaviorSubject<AuthToken | undefined>(undefined);
  private _tokenRefreshTimer?: any
  private _refreshTokenStarted: boolean = false;
  private _ignoreUrls?: string[];
  readonly DEFAULT_TIME_OUT = 20 * 60; //20 min as default.
  private _idleTimerOut = this.DEFAULT_TIME_OUT; // 20 min as default. 
  private _idleTimer?: NodeJS.Timeout;

  redirectUrl: string = "/dashboard";
  issueUrl?: string = undefined;
  isSessionPopupShown: boolean = false;

  protected _router = inject(Router);

  constructor() {
    super(BaseService.ApiUrls.Auth);
    this._initTokenInfoAndEvent();
    this._ignoreUrls = [];
    this._ignoreUrls.push('/Auth/logout');
  }

  //#region JWT token handing methods

  /**
  * @ignore
  * One time init from ctor for token from storage and event binding for storage
  */
  private _initTokenInfoAndEvent() {
    this._remember = false;
    this.jwtResponse = localStorage.getItem(this.key) ?? undefined;
    if (this._jwtResponse) {
      this._remember = true;
    }
    else {
      this.askSessionStorageDetailFromOtherTabs();
      this._checkSession = true;
    }
    this.publishToken();
    this.startStorageEventListener();
  }

  /**
  * @ignore
  * set jwtResponse from JSON string store in session/local store.
  */
  private set jwtResponse(rawValue: string | undefined) {
    if (rawValue) {
      this._jwtResponse = JSON.parse(rawValue);
    } else {
      this._jwtResponse = undefined;
    }
  }

  /**
   * Set token detail as per JwtResponse and fire publish event for the same. 
   * @param {JwtResponse} token  JwtResponse from login api.
   * @param {boolean} remember true will remember token detail in localStorage otherwise in sessionStorage. 
   */
  setToken(token: JwtResponse, remember: boolean | undefined): boolean {
    this._jwtResponse = token;
    let strVal = JSON.stringify(token);
    this._remember = remember;
    if (remember) {
      localStorage.setItem(this.key, strVal);
    } else {
      sessionStorage.setItem(this.key, strVal);
    }

    if (this._refreshTokenStarted) {
      this._refreshTokenStarted = false;
      //share with other tab!
      localStorage.setItem(this._refreshTokenStorage, strVal);
      localStorage.removeItem(this._refreshTokenStorage);
    }
    this.publishToken();
    return true;
  }

  /**
   * return the current AuthToken detail. null if yet not Authenticated!
   */
  public get getCurrentToken(): AuthToken | undefined {
    return this._authJWTToken;
  }

  /**
   * clear token information from memory and local/session storage. also fire session storage event to notify other tab!
   * and navigate to login page!
   */
  clearToken() {
    //remove from other tabs if any!
    localStorage.setItem(this._removeSessionStorage, Date.now().toString());
    localStorage.removeItem(this._removeSessionStorage);
    this._clearToken();
  }

  /**
   * @ignore clear token detail from local and session storage. and publish even for the same.
   */
  private _clearToken() {
    localStorage.removeItem(this.key);
    sessionStorage.removeItem(this.key);
    this._jwtResponse = undefined;
    this._remember = false;
    this.publishToken();
    this._router.navigate(["/auth"]); //login page..
  }

  /**
   * publish new token value.
   */
  protected publishToken() {
    this._authJWTToken = new AuthJWTToken(this._jwtResponse);
    //set the refresh token timer to refresh it before expired!
    this.setRefreshTokenTimer();
    this._token$.next(this._authJWTToken);
  }


  /**
   * set the timer to refresh token before access_token get expired.
   * before three Minute ... the time callback will refresh token from server.
   */
  protected setRefreshTokenTimer() {

    if (this._tokenRefreshTimer) {
      let prevTimer = this._tokenRefreshTimer;
      clearTimeout(prevTimer);
      this._tokenRefreshTimer = undefined;
    }
    //Refresh token if token is valid.
    if (this._authJWTToken) {
      if (this._authJWTToken.isValid()) {
        let threeMinute = 180;//seconds        
        let timeOut = this._authJWTToken?.jwtResponse?.expires_in;
        if (timeOut) {
          if (timeOut > threeMinute) {
            timeOut = timeOut - threeMinute;
          }
          timeOut = timeOut * 1000; // in ms!
          //console.log("refresh token timer set for :" + timeOut);
          this._tokenRefreshTimer = setTimeout(() => {
            this.refreshToken();
          }, timeOut);

        }
      }
    }
  }

  /**
   * Call refreshTokenFromServer if not already start by other tab if any.
   * if success then it will set new token otherwise app will redirected to login page!
   */
  protected refreshToken() {
    if (!this._refreshTokenStarted) {
      this._refreshTokenStarted = true;
      localStorage.setItem(this._refreshTokenStartedStorage, Date.now().toString());
      localStorage.removeItem(this._refreshTokenStartedStorage);
      this.refreshTokenFromServer().subscribe(
        {
          next: (res) => {
            //do nothing..
          },
          error: (error) => {
            console.dir(error);
          }
        });
    }
  }

  /**
   * true if authenticated and have valid token.
   */
  isAuthenticated(): Observable<boolean> {
    if (this._checkSession) {
      return timer(500).pipe(
        map(tick => tick),
        mergeMap(tickInfo => {
          this._checkSession = false;
          this.jwtResponse = sessionStorage.getItem(this.key) ?? undefined;
          if (this._jwtResponse) {
            this.publishToken();
          }
          let isValid = false;
          if (this._authJWTToken) {
            isValid = this._authJWTToken.isValid();

          }
          return of(isValid);
        }));
    } else {
      let isValid = false;
      if (this._authJWTToken) {
        isValid = this._authJWTToken.isValid();
        if (!isValid && this._authJWTToken.refreshToken()) {
          return this.refreshTokenAtStartUp();
        }
      }
      return of(isValid);
    }
  }

  /**
   * refresh the token at startup if saved access_token is exp. and refresh_token is there!
   * make actual http call for refresh token as applicable.
   */
  protected refreshTokenAtStartUp(): Observable<boolean> {
    if (!this._refreshTokenStarted) {
      this._refreshTokenStarted = true;
      localStorage.setItem(this._refreshTokenStartedStorage, Date.now().toString());
      localStorage.removeItem(this._refreshTokenStartedStorage);
      return this.refreshTokenFromServer().pipe(
        map(data => data),
        mergeMap(res => {
          return of(true);
        })
      );
    } else {
      return of(false);
    }
  }

  /**
   * event for Authentication change
   */
  onAuthenticationChange(): Observable<boolean | undefined> {
    return this.onTokenChange()
      .pipe(map((token: AuthToken | undefined) => token?.isValid()));
  }

  /**
   * event for Token value change.
   */
  onTokenChange(): Observable<AuthToken | undefined> {
    return this._token$
      .pipe(
        filter(value => !!value),
        share(),
      );
  }

  //#endregion

  //#region sharing token/session between tabs!

  /**
   * @ignore ask session storage detail from other tab if any.
   */
  private askSessionStorageDetailFromOtherTabs(): void {
    //Ask other tabs for sessionStorage
    localStorage.setItem(this._getSessionStorage, Date.now().toString());
    localStorage.removeItem(this._getSessionStorage);
  }

  /**
   * @ignore start listen to Storage event..
   */
  private startStorageEventListener(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  /**
   * actual storage event listener function to share session between tabs!
   * @param {StorageEvent} event storage event detail 
   */
  private storageEventListener(event: StorageEvent) {

    if (event.storageArea == localStorage) {
      if (event.key == this._getSessionStorage) {
        // Some tab asked for the sessionStorage -> send it
        if (sessionStorage && sessionStorage.length) {
          let sessionStorageString = JSON.stringify(sessionStorage);
          localStorage.setItem(this._sessionStorage, sessionStorageString);
          localStorage.removeItem(this._sessionStorage);
        }
      } else if (event.key == this._sessionStorage && event.newValue) {

        let data = JSON.parse(event.newValue);
        for (let key in data) {
          sessionStorage.setItem(key, data[key]);
        }
      } else if (event.key == this._removeSessionStorage && event.newValue) {
        if (this._jwtResponse) {
          this._clearToken();
        }
      } else if (event.key == this._refreshTokenStartedStorage && event.newValue) {
        //Indicate that refresh token started!
        if (!this._refreshTokenStarted) {
          this._refreshTokenStarted = true;
        }
      } else if (event.key == this._refreshTokenStorage && event.newValue) {
        //Indicate that token is shared to other tab!
        if (this._refreshTokenStarted) {
          this._refreshTokenStarted = false;
          this.jwtResponse = event.newValue;
        }
      }
    }
  }
  //#endregion

  //#region Auth related view/Page apis


  /**
   * login user with given user/email and password.
   * @param {LoginViewModel} viewModel user email and password for login.
   */
  login(viewModel: LoginViewModel): Observable<ApiOkResponse<any>> {
    const url = "/login";
    viewModel.userName = viewModel.email;
    return this.postResponse(this.baseUrl, url, viewModel).pipe(
      map(res => {
        return this.processResultToken(res, viewModel.rememberMe);
      })
    );
  }

  /**
   * make http call to refreshToken from server!
   */
  protected refreshTokenFromServer(): Observable<ApiOkResponse<any>> {
    const url = "/renew-token";
    return this.postResponse(this.baseUrl, url, this._jwtResponse).pipe(
      map(res => {
        return this.processResultToken(res, this._remember);
      })
    );
  }

  /**
   * logout the currently logged in user and clear associated token information!
   * and navigate to login page.
   */
  logout() {
    const url = "/logout";
    if (this._jwtResponse) {
      this.postResponse<JwtResponse, JwtResponse>(this.baseUrl, url, this._jwtResponse).subscribe(
        {
          next: (res) => {
            this.clearToken();
          },
          error: (error) => {
            console.dir(error);
            this.clearToken();

          }
        }
      );

    }
  }

  /** 
   * @param result JwtResponse information.
   * @param rememberMe  indicate whether to remember the token or not.
   */
  private processResultToken(result: ApiOkResponse<any>, rememberMe: boolean | undefined): ApiOkResponse<any> {
    if (result.data) {
      let response: JwtResponse = result.data;
      this.setToken(response, rememberMe);
    }
    return result;
  }

  //#endregion


  //#region idle timeout related

  setIdleTimer(req: HttpRequest<any>) {
    if (this.isSessionPopupShown) {
      let isIgnore = true;
      if (req) {
        isIgnore = this.ignoreAutoApiCall(req);
      }
      if (isIgnore) {
        //do nothing
      } else {
        this.setActualIdleTimer();
      }
    }
  }

  ignoreAutoApiCall(req: HttpRequest<any>) {
    if (req.url && this._ignoreUrls) {
      for (let i = 0; i < this._ignoreUrls.length; i++) {
        let apiUrl = this._ignoreUrls[i];
        if (apiUrl && req.url.includes(apiUrl)) {
          return true;
        }
      }
    }
    return false;
  }

  setActualIdleTimer(doNotNotify = false) {
    let timeOut = this._idleTimerOut;
    if (timeOut) {
      //before one minute, show session expiry warning popup
      let oneMinute = 60;
      if (timeOut > oneMinute) {
        timeOut = (timeOut - oneMinute) * 1000; // millisecond!
      }
      else {
        //this should not happen at all
        timeOut = timeOut * 1000;
      }

      this.clearActualIdleTimer();
      this._idleTimer = setTimeout(() => {
        this.sessionExpiredEvent.emit(true);
      }, timeOut);

      // sharing timeout for other tab!
      if (!doNotNotify) {
        localStorage.setItem(this._shareTimeoutStorage, Date.now().toString());
        localStorage.removeItem(this._shareTimeoutStorage);
      }
    }
  }

  clearActualIdleTimer() {
    if (this._idleTimer) {
      let prevTimer = this._idleTimer;
      clearTimeout(prevTimer);
    }
  }

  //#endregion

}
