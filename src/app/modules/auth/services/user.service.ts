import { Injectable, inject } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { ChangePasswordDto, ResetPasswordRequest, UserDto, UserLookUpDto, UserWithPermissionsDto } from '../../admin/models/user-dto';
import { Observable, map, of, catchError, throwError } from 'rxjs';
import { UserProfileDto } from '../../admin/models/user-profile-dto';
import { ApiOkResponse, ApiError } from '../../shared/models/api-response';
import { EnumPermissionFor } from '../../shared/models/common-enums';
import { AuthService } from './auth.service';
import { AuthToken } from '../models/token';
import { instanceToInstance } from 'class-transformer';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserDto> {

  private _currentUserRequest?: Observable<UserWithPermissionsDto| undefined> = undefined;

  userInfo? :UserWithPermissionsDto

  // inject services
  protected _authService = inject(AuthService);

  constructor() {
    super(BaseService.ApiUrls.User); 
    //On user token changed event.  
    this._authService.onTokenChange().subscribe( (data : AuthToken | undefined) => {
      if(!data?.isValid()) {
        //Make current user invalid!!
        this.userInfo = new UserWithPermissionsDto();
        this.permissionService.setCurrentUser(this.userInfo); 
      }
    });
  }


  //#region Entity specific apis

  public get currentUser(): UserWithPermissionsDto {
    return this.permissionService.currentUser;
  }

  /**
   * get all records from server for entity lookup combo.
   */
  getLookUpList(): Observable<UserLookUpDto[]> {
    return this.lookUpList<UserLookUpDto>();
  }    

  /**
   * record to be created/updated. if record.id == 0 it means new record otherwise update existing record.
   * @param {UserDto} record model
   */
  update(record: UserDto): Observable<ApiOkResponse<UserDto>> {
    return this.updateRecord<UserDto>(record.id, record)
    .pipe(map(res => {
      if (record.id == this.currentUser.id) {
        //Update the current user detail..
         instanceToInstance<UserDto>(record);
      }
      return res;
    }));
  }
  
  /**
   * Make actual http call if logged in user detail is not loaded yet!
   * @param id userId for get record detail from db.
   */
  loadCurrentUser(id: number | undefined): Observable<UserWithPermissionsDto> {
    if (this.currentUser != undefined) {
      if (this.currentUser.id === id) {
        return of(this.currentUser);
      } else {
        //get user again.
        this._currentUserRequest = undefined;
      }
    } else if (this._currentUserRequest != undefined) { 
      return <Observable<UserWithPermissionsDto>>this._currentUserRequest;
    }
    if (id) {
      let url = `/user-with-permissions/${id}`;
      this._currentUserRequest = this.getResponse<UserWithPermissionsDto>(this.baseUrl, url)
      .pipe(map(res  => {
       
        if (res.data) {
          this.userInfo = instanceToInstance<UserWithPermissionsDto>(res.data);
        }
        
        if (this.userInfo) {
          this.userInfo?.permissionsList?.forEach(permission => {
            let permissions = this.userInfo?.permissions;
            if (permissions) {
              let key = EnumPermissionFor[permission.permissionFor];
              let permissionFor = permissions[key as keyof typeof EnumPermissionFor];
              permissionFor = permission; //TDOD need to check
            }
          });
        }

        if(this.userInfo){
          this.permissionService.setCurrentUser(this.userInfo);
        }
        this._currentUserRequest = undefined;
        return <UserWithPermissionsDto>this.userInfo;
      }),
      catchError(error => { 
        this._currentUserRequest = undefined;
        return throwError(() => error);
      })
      );
      return <Observable<UserWithPermissionsDto>>this._currentUserRequest;
    } else {
      this._currentUserRequest = undefined;
      return of(this.currentUser);
    }
  }

  /**
   * api to send invitation e-mail to user to set his first time password.
   * @param {ResetPasswordRequest} viewModel model for send set password request.
   */
  adminInviteUser(userId:number): Observable<ApiOkResponse<any>> {
    if (this.currentUser.id == userId) {
      let apiError = new ApiError();
      apiError.eventMessageId = "USER_SELF_INVITE_ERROR";
      apiError.statusCode = 200;
      apiError.statusText = "Bad Request";
      return throwError(apiError);
    }  
     const url = "/admin-invite-user";
     const authUrl = `${window.location.origin}${environment._environmentSetting?.rootURL}auth/set-password`;
     let viewModel: ResetPasswordRequest = new ResetPasswordRequest( userId, authUrl);
    return this.postResponse(this.baseUrl, url, viewModel);
  }

  /**
   * api to send e-mail to reset his password.
   * @param {ResetPasswordRequest} viewModel model for send set password request.
   */
  adminResetPassword(userId:number): Observable<ApiOkResponse<any>> {    
    const url = "/admin-reset-password";
    const authUrl = `${window.location.origin}${environment._environmentSetting?.rootURL}auth/set-password`;
    let viewModel: ResetPasswordRequest = new ResetPasswordRequest( userId, authUrl);    
    return this.postResponse(this.baseUrl, url, viewModel);
  }
  
/**
   * ChangePasswordRequest viewModel model for send set new password request.
   */
  userChangePassword(data: ChangePasswordDto): Observable<ApiOkResponse<ChangePasswordDto>> {
    let url = `${this.baseUrl}/change-password`;  
    return this._commonService.extractOkResponse(
      this._commonService.http.patch<ApiOkResponse<ChangePasswordDto>>(url, data)
    );
  }

  /**
   * Update profile details.
   */
  submitUserProfile(data: UserProfileDto): Observable<ApiOkResponse<UserProfileDto>> {
    let url = `${this.baseUrl}/user-profile`;  
    return this._commonService.extractOkResponse(
      this._commonService.http.patch<ApiOkResponse<UserProfileDto>>(url, data)
    );
  }

  /**
     * Get profile details.
     */
  getUserProfile(id: number): Observable<ApiOkResponse<UserProfileDto>> {
    let url = `${this.baseUrl}/user-profile/${id}`;
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<UserProfileDto>>(url)
    );
  }

  //#endregion entity specific apis end
 
}

