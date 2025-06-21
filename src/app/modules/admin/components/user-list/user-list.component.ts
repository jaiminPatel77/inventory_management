import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BaseListComponent } from '../../../shared/components/base-list/base-list.component';
import { UserListDto } from '../../models/user-dto';
import { UserService } from '../../../auth/services/user.service';
import { EnumPermissionFor, EnumUserStatus } from '../../../shared/models/common-enums';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs';
import { ApiError, ApiOkResponse } from '../../../shared/models/api-response';
import { SvgIconDirective } from '../../../shared/directives/svg-icon.directive';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TranslateModule, LoadingComponent, FormsModule, NgbPaginationModule,NgbTooltip,SvgIconDirective],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent extends BaseListComponent<UserListDto> implements OnInit, OnDestroy {

  enumUserStatus = EnumUserStatus;

  constructor(
    private _userService: UserService
  ) {
    super(_userService);
    this.allowMultipleSelect = true;
    this.requiredPermissionType = EnumPermissionFor.USER;
  }

  //#region invite user starts

  onInviteUser(record: UserListDto) {
    if (record?.id) {
      record.$inviteUserLoading = true;
      this._userService.adminInviteUser(record.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: ApiOkResponse<any>) => {
            (<UserListDto[]>this.sourceInfo.list).forEach(element => {
              if (element.id === record.id) {
                element.status = EnumUserStatus.Invited;
              }
            });
            record.$inviteUserLoading = false;
            if (result.eventMessageId) {
              this._userService.showSuccessIdToast(result.eventMessageId);
            }
          },
          error: (error: ApiError) => {
            this._userService.showApiErrorToast(error);
            record.$inviteUserLoading = false;
          }
        }
        );
    }
  }

  //#endregion invite user ends

}
