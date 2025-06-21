import { Pipe, PipeTransform, inject } from '@angular/core';
import { CommonService } from '../services/common.service';
import { EnumAllocationGroup } from '../../temp-examples/models/patient-dto';

@Pipe({
  name: 'allocationGroup',
  standalone: true
})
export class AllocationGroupPipe implements PipeTransform {

  // inject services
  protected _commonService = inject(CommonService);

  transform(value: EnumAllocationGroup, ...args: unknown[]): unknown {
    switch (value) {
      case EnumAllocationGroup.Case:
        return this._commonService.translateService.instant('Case');
      case EnumAllocationGroup.Control:
        return this._commonService.translateService.instant('Control');
      default:
        break;
    }
    return undefined;
  }

}
