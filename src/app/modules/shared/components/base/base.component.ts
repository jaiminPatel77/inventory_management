import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription, } from 'rxjs';
import { ApiError } from '../../models/api-response';
import { EvaluatedPermission } from '../../models/base-model';
import { EnumPermissionFor, EnumUserType } from '../../models/common-enums';
import { DataStatusEnum } from '../../models/common-models';
import { BaseService } from '../../services/base.service';
import { UserPermissionService } from '../../services/user-permission.service';
import { PermissionDto } from '../../../admin/models/role-dto';
import { UserWithPermissionsDto } from '../../../admin/models/user-dto';
import { DateTimeHelper } from '../../models/date-time-helper';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit, OnDestroy  {

  dataStatus: DataStatusEnum;
  dataStatusEnum = DataStatusEnum;
  apiError?: ApiError;
  baseService: BaseService<any>;
  currentUser?: UserWithPermissionsDto;
  requiredPermissionType?: EnumPermissionFor;
  evaluatedPermission: EvaluatedPermission; 
  permissionService: UserPermissionService;

  dateFormat = DateTimeHelper.dateFormat;
  timeFormat = DateTimeHelper.timeFormat;
  enumUserType = EnumUserType;

  private _currentUserSubscription?: Subscription;

  constructor(baseService: BaseService<any>) {
    this.baseService = baseService;
    this.dataStatus = DataStatusEnum.None;
    this.permissionService = this.baseService.permissionService;
    this.evaluatedPermission = this.permissionService.AllAllowedPermission; //by default all allowed!
  }
  
  ngOnInit() {
    //Handle current user change event to load correct permission
    this._currentUserSubscription = this.permissionService.currentUserChanged.subscribe(
      user => {
        this.currentUser = user;
        if(this.requiredPermissionType) {
          let associatedPermission = this.currentUser.permissions ? this.currentUser.permissions[EnumPermissionFor[this.requiredPermissionType] as any] : undefined;
          let permissionDto:PermissionDto | undefined= undefined;
          if(associatedPermission) {
            permissionDto = associatedPermission;
          } else {
            permissionDto = new PermissionDto();
          }
          this.evaluatedPermission = this.permissionService.getEvaluatedPermission(permissionDto);
        }        
      }
    );
  }

  ngOnDestroy(): void {
    if(this._currentUserSubscription) {
      this._currentUserSubscription.unsubscribe();
      this._currentUserSubscription = undefined;
    }
  }

  /**
   * Override it to return true if data is changed otherwise return false.
   * If model is not changed then it will not ask for navigation confirmation.
   */
  get isModelChanged(): boolean {    
    return false;
  }

  
  
  /**
   * return true if control is dirty or touched and it's status is invalid.
   * @param {AbstractControl} control any form control object
   */
  isInvalid(control: AbstractControl | null | undefined): boolean {
    
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  /**
     * Mark all control of a given FormGroup as Touched or dirty so that form will show appropriate error
     * @param {FormGroup} formGroup formgroup object
     */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }  

}
