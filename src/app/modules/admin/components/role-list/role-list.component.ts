import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../shared/components/base-list/base-list.component';
import { RoleListDto } from '../../models/role-dto';
import { RoleService } from '../../../auth/services/role.service';
import { EnumPermissionFor } from '../../../shared/models/common-enums';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SourceInfo } from '../../../shared/models/table-conf';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';
import { ColumnSorterComponent } from '../../../shared/components/column-sorter/column-sorter.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [TranslateModule, LoadingComponent, FormsModule, NgbPaginationModule,NgbTooltip,SvgIconDirective, ColumnSorterComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent extends BaseListComponent<RoleListDto> implements OnInit, OnDestroy {

  nameField: string = 'name';
  nameSearchTxt: string = '';

  constructor(
    private _roleService: RoleService
  ) {
    super(_roleService);
    this.allowMultipleSelect = true;
    this.requiredPermissionType = EnumPermissionFor.ROLE;
  }

  //#region search filter starts

  override setFilterValuesToModel(sourceInfo: SourceInfo) {
    let isExistNameField = sourceInfo.filters.find(e => e.filterName === this.nameField);
    if (isExistNameField) {
      this.nameSearchTxt = isExistNameField.filterVal;
    }
  }

  onNameSearch() {
    super.onFilter(this.nameField, this.nameSearchTxt);
  }

  //#endregion search filter ends


  //#region override methods starts

  override onClearFilter() {
    this.nameSearchTxt = '';
    super.onClearFilter();
  }

  //#endregion override methods ends

}
