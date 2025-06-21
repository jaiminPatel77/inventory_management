import { Pipe, PipeTransform, inject } from '@angular/core';
import { CommonService } from '../services/common.service';
import { EnumPatientStatus } from '../../temp-examples/models/patient-dto';

@Pipe({
  name: 'patientStatus',
  standalone: true
})
export class PatientStatusPipe implements PipeTransform {

  // inject services
  protected _commonService = inject(CommonService);

  transform(value: EnumPatientStatus, ...args: unknown[]): unknown {
    switch (value) {
      case EnumPatientStatus.New:
        return this._commonService.translateService.instant('New');
      case EnumPatientStatus.ScreeningPending:
        return this._commonService.translateService.instant('ScreeningPending');
      case EnumPatientStatus.ScreeningFail:
        return this._commonService.translateService.instant('ScreeningFail');
      case EnumPatientStatus.ScreeningCompleted:
        return this._commonService.translateService.instant('ScreeningCompleted');
      case EnumPatientStatus.Randomizied:
        return this._commonService.translateService.instant('Randomizied');
      case EnumPatientStatus.BaseLinePending:
        return this._commonService.translateService.instant('BaseLinePending');
      case EnumPatientStatus.BaseLineFail:
        return this._commonService.translateService.instant('BaseLineFail');
      case EnumPatientStatus.BaseLineCompleted:
        return this._commonService.translateService.instant('BaseLineCompleted');
      case EnumPatientStatus.Visit2:
        return this._commonService.translateService.instant('Visit2');
      case EnumPatientStatus.Visit3:
        return this._commonService.translateService.instant('Visit3');
      case EnumPatientStatus.Visit4:
        return this._commonService.translateService.instant('Visit4');
      case EnumPatientStatus.Visit5:
        return this._commonService.translateService.instant('Visit5');
      case EnumPatientStatus.WK2:
        return this._commonService.translateService.instant('WK2');
      case EnumPatientStatus.WK4:
        return this._commonService.translateService.instant('WK4');
      case EnumPatientStatus.WK8:
        return this._commonService.translateService.instant('WK8');
      case EnumPatientStatus.WK20:
        return this._commonService.translateService.instant('WK20');
      case EnumPatientStatus.WK32:
        return this._commonService.translateService.instant('WK32');
      case EnumPatientStatus.WK40:
        return this._commonService.translateService.instant('WK40');
      case EnumPatientStatus.WK48:
        return this._commonService.translateService.instant('WK48');
      case EnumPatientStatus.WK60:
        return this._commonService.translateService.instant('WK60');
      case EnumPatientStatus.WK68:
        return this._commonService.translateService.instant('WK68');
      case EnumPatientStatus.WK76:
        return this._commonService.translateService.instant('WK76');
      case EnumPatientStatus.WK84:
        return this._commonService.translateService.instant('WK84');
      case EnumPatientStatus.WK92:
        return this._commonService.translateService.instant('WK92');
      case EnumPatientStatus.WK100:
        return this._commonService.translateService.instant('WK100');
      case EnumPatientStatus.SAEAdverseEventVisit:
        return this._commonService.translateService.instant('SAEAdverseEventVisit');
      case EnumPatientStatus.EndOfTrialWithdrawalVisit:
        return this._commonService.translateService.instant('EndOfTrialWithdrawalVisit');
      default:
        break;
    }
    return undefined;
  }

}
