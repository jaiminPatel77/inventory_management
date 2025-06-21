import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BaseDto } from '../../models/base-model';
import { BaseComponent } from '../base/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BaseService } from '../../services/base.service';
import { DataStatusEnum } from '../../models/common-models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiError, ApiOkResponse } from '../../models/api-response';
import { plainToClassFromExist } from 'class-transformer';
import { deepCompare } from '../../models/helper';

@Component({
  selector: 'app-base-detail-popup',
  standalone: true,
  imports: [],
  templateUrl: './base-detail-popup.component.html',
  styleUrl: './base-detail-popup.component.scss'
})
export class BaseDetailPopupComponent<T extends BaseDto> extends BaseComponent implements OnInit, OnDestroy {
  submitted: boolean = false;
  model?: T;
  detailForm?: FormGroup;
  protected destroy$ = new Subject<boolean>();
  recordId: number;
  isNew: boolean = true;

  // inject services
  protected _formBuilder = inject(FormBuilder);
  protected activeModal = inject(NgbActiveModal);

  constructor(
    baseService: BaseService<any>
  ) {
    super(baseService);
    this.recordId = 0;
  }

  //#region Init and destroy methods

  override ngOnInit() {
    super.ngOnInit();
    this.dataStatus = DataStatusEnum.Fetching;
    this.createForm();
    if (this.recordId) {
      this.isNew = false;
    }
    this.setValueChangeEvent();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.destroy$) {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
  }

  //#endregion Init and destroy methods


  //#region Must override methods

  createNewModelObject(): T {
    throw new Error('createNewModelObject must be override');
  }

  /**
   * prefer model object from value input in form controls 
   */
  transferDetailFormValuesToModel(model: T) {
    //Must override it!      
  }

  /**
   * Create detail form group!
   * Must override in detail component.
   */
  createForm() {
    //Must override it!
  }

  /**
   * One time value change event subscribe to form control events!
   */
  setValueChangeEvent() {
    //Must override it!
  }

  //#endregion Must override methods end


  //#region can override methods

  /**
   * perform save data to server if all inputs are valid!
   */
  onSubmit(): void {
    if (this.model && this.validateDetailFormBeforeSubmit()) {
      this.submitted = true;
      this.transferDetailFormValuesToModel(this.model);
      this.baseService.updateRecord(this.model.id, this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<any>) => {
            let message = result.eventMessageId || '';
            this.baseService.showSuccessIdToast(message);
            this.activeModal.close(true);
          },
          error: (error: ApiError) => {
            this.submitted = false;
            this.baseService.showApiErrorToast(error);
          }
        });
    }
  }

  /**
   * close the active popup
   */
  onCancel() {
    this.activeModal.dismiss();
  }

  /**
   * validate form controls before submit data to server!
   * by default only validate the detailForm .. in case if any custom validation needed override it.
   */
  validateDetailFormBeforeSubmit(): boolean {
    if (this.detailForm) {
      this.validateAllFormFields(this.detailForm);
      return this.detailForm.valid;
    }
    return false;
  }

  /**
   * Override it to return true if data is changed otherwise return false.
   * If model is not changed then it will not ask for navigation confirmation.
   */
  override get isModelChanged(): boolean {
    if (!this.submitted) {
      let defaultModel = this.createNewModelObject();
      let currentModel = plainToClassFromExist(defaultModel, this.model);
      this.transferDetailFormValuesToModel(currentModel);
      return !deepCompare(currentModel, this.model);
    } else {
      return false;
    }
  }

  //#endregion can override methods end  
}
