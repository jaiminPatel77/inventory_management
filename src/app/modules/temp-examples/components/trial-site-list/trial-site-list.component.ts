import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../shared/components/base-list/base-list.component';
import { TrialSiteListDto } from '../../models/trial-site-dto';
import { TrialSiteService } from '../../services/trial-site.service';
import { EnumPermissionFor } from '../../../shared/models/common-enums';
import { SourceInfo } from '../../../shared/models/table-conf';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';
import { ColumnSorterComponent } from '../../../shared/components/column-sorter/column-sorter.component';

@Component({
  selector: 'app-trial-site-list',
  standalone: true,
  imports: [TranslateModule, LoadingComponent, FormsModule, NgbPaginationModule, NgbTooltip, SvgIconDirective, ColumnSorterComponent],
  templateUrl: './trial-site-list.component.html',
  styleUrl: './trial-site-list.component.scss'
})
export class TrialSiteListComponent extends BaseListComponent<TrialSiteListDto> implements OnInit, OnDestroy {

  nameField: string = 'name';
  nameSearchTxt: string = '';

  constructor(
    private _trialSiteService: TrialSiteService
  ) {
    super(_trialSiteService);
    this.allowMultipleSelect = true;
    this.requiredPermissionType = EnumPermissionFor.TrialSite;
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

}
