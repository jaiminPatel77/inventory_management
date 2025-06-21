import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserPermissionService } from './user-permission.service';
import { Observable, map } from 'rxjs';
import { ApiCreatedResponse, ApiError, ApiOkResponse } from '../models/api-response';
import { CommonService } from './common.service';
import { IndividualConfig } from 'ngx-toastr';
import { DataQueryResult } from '../models/data-query-helper';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<A> {

  /**
   * refer to  API version 1 base url.
   */
  public static API_V1: string = `${environment.Setting.apiServiceUrl}/api/v1`;

  /**
   * all services url path define by this object!
   */
  public static readonly ApiUrls = {
    Auth: `${BaseService.API_V1}/Auth`,
    Account: `${BaseService.API_V1}/Account`,
    ExternalAuth: `${BaseService.API_V1}/ExternalAuth`,
    Role: `${BaseService.API_V1}/Role`,
    User: `${BaseService.API_V1}/User`,
    Setting: `${BaseService.API_V1}/Setting`,
    TrialSite: `${BaseService.API_V1}/TrialSite`,
    Patient: `${BaseService.API_V1}/Patient`
  };

  /**
   * common service instance.
   */
  public _commonService = inject(CommonService);
  /**
   * @param baseUrl :  base url path for a given entity type <A>
   */
  constructor(
    @Inject('baseUrl') public baseUrl: string
  ) { 
  }

  //#region wrapper for allow access to public for all common services

  /**
   * return HttpClient service instance.
   */
  public get http(): HttpClient {
    return this._commonService.http;
  }
  /**
   * return NgbModal service instance.
   */
  public get modal(): NgbModal {
    return this._commonService.modalService;
  }

  /**
   * common service to check the current user permission.
   */
  public get permissionService(): UserPermissionService {
    return this._commonService.permissionService;
  }

  //#endregion 

  //#region Generic wrappers for actual HTTP get/put/post/Path call

  /**
   * Make actual HTTP GET call and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   */
  getResponse<T>(baseUrl: string, subUrl: string): Observable<ApiOkResponse<T>> {
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<T>>(baseUrl + subUrl)
    );
  }

  /**
   * Make actual HTTP POST call and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  postResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiOkResponse<U>> {
    return this._commonService.extractCreateResponse(
      this._commonService.http.post<ApiOkResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP POST call for creating new record and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  createResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiCreatedResponse<U>> {
    return this._commonService.extractCreateResponse(
      this._commonService.http.post<ApiCreatedResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP PUT call and return success/error response of given type.
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  putResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiOkResponse<U>> {
    return this._commonService.extractOkResponse(
      this._commonService.http.put<ApiOkResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP PATCH call and return success/error response of given type.
   * Used for patch update!
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   * @param {T} data object to post to server
   */
  patchResponse<T, U>(baseUrl: string, subUrl: string, data: T): Observable<ApiOkResponse<U>> {
    return this._commonService.extractOkResponse(
      this._commonService.http.patch<ApiOkResponse<U>>(baseUrl + subUrl, data)
    );
  }

  /**
   * Make actual HTTP DELETE call and return success/error response
   * @param {string} baseUrl for api
   * @param {string} subUrl sub path for api
   */
  deleteResponse(baseUrl: string, subUrl: string): Observable<any> {
    return this._commonService.extractOkResponse(
      this._commonService.http.delete<ApiOkResponse<any>>(baseUrl + subUrl)
    );
  }

  //#endregion

  //#region CURD operation for given entity type for which service is created!

  /**
 * Make actual HTTP GET call to get record from server, and return success/error response of given type.
 * @param {string} id record id
 */
  getRecord(id: number): Observable<ApiOkResponse<A>> {
    let url = `${this.baseUrl}/${id}`;
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<A>>(url)
    );
  }

  /**
     * Make actual HTTP POST to create the record if id is zero otherwise make HTTP PUT call to update
     * existing record.
     * @param {string} id record to be updated.
     * @param data object to post to server
     */
  updateRecord<U>(id: number | undefined, record: A): Observable<ApiOkResponse<U>> {
    if (!id) {
      //Create the record if id is zero.
      return this.createResponse(this.baseUrl, "", record);
    } else {
      const url = `/${id}`;
      return this.putResponse(this.baseUrl, url, record);
    }
  }

  /**
   * Make actual HTTP DELETE call and return success/error response
   * @param {number} id id of record which is is to be deleted.
   */
  deleteRecord(id: number): Observable<any> {
    let url = `${this.baseUrl}/${id}`;
    return this._commonService.extractOkResponse(
      this._commonService.http.delete<ApiOkResponse<any>>(url)
    );
  }

  /**
   * Make actual HTTP POST call and return success/error response.
   * Make any record enable/un-archive or disable/archive.
   * @param {number} id id of record which is is to be Enable/disable.
   * @param {boolean} isDisable  of record which is is to be disable/enable.
   */
  enableDisableRecord(id: number, isDisable: boolean): Observable<any> {
    let url = `${this.baseUrl}/enable-disable/${id}/${isDisable}`;
    return this._commonService.extractOkResponse(
      this._commonService.http.post<ApiOkResponse<any>>(url, {})
    );
  }

  getList<T>(): Observable<T[]> {
    let url = `${this.baseUrl}`;
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<DataQueryResult<T>>>(url)
    ).pipe(map(res => {
      return res.data?.items || [];
    }));
  }

  /**
   * Make actual http get call for 'lookup-list' endpoint.
   * Will return all records from database!
   */
  lookUpList<T>(): Observable<T[]> {
    let url = `${this.baseUrl}/lookup-list`;
    return this._commonService.extractOkResponse(
      this._commonService.http.get<ApiOkResponse<DataQueryResult<T>>>(url)
    ).pipe(map(res => {
      return res.data?.items || [];
    }));
  }
  //#endregion

  //#region common toast functions!

  /**
   * Translate the title and display success message.
   * @param {string} titleTextId resource id for success message.
   * @param {string} body more detail about success message.
   */
  showSuccessIdToast(titleTextId: string, body?: string) {
    let title = this._commonService.translateService.instant(titleTextId);
    this.showSuccessToast(title, body);
  }

  /**
   * show the success toast for given title and body.
   * @param {string} title
   * @param {string} body
   */
  showSuccessToast(title: string, body?: string) {
    const toast: Partial<IndividualConfig> = {
      enableHtml: true
    };
    this._commonService.toastrService.success(body, title, toast);
  }

  /**
   * display the toast error message based on information in ApiError.
   * @param {ApiError} apiError api error detail object.
   */
  showApiErrorToast(apiError: ApiError) {
    let errorTitle: string;
    let errorDetail = apiError.errorDetail;
    if (apiError.eventMessageId) {
      errorTitle = this._commonService.translateService.instant(apiError.eventMessageId);
    } else if (apiError.errorMessage) {
      errorTitle = apiError.errorMessage;
    } else if (apiError.statusCode === 404) {
      errorTitle = this._commonService.translateService.instant('SERVICE_NOT_AVAILABLE_ERROR');
    } else if (apiError.statusCode === 401) {
      errorTitle = this._commonService.translateService.instant('USER_NOT_AUTHORIZED_ERROR');
    } else {
      errorTitle = this._commonService.translateService.instant('API_SERVICE_RETURN_UNKNOWN_ERROR');
    }

    this.showErrorToast(errorTitle, errorDetail);
  }
  /**
   * show the error toast for given title and body.
   * @param {string} title
   * @param {string} body
   */
  showErrorToast(title: string, body?: string) {
    const toast: Partial<IndividualConfig> = {
      enableHtml: true
    };
    this._commonService.toastrService.error(body, title, toast);
  }

  //#endregion
}
