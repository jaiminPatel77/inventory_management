import { BaseDtoWithCommonFields, BaseLookUpDto } from "../../shared/models/base-model";
import { DataStatusEnum } from "../../shared/models/common-models";

export class TrialSiteListDto extends BaseDtoWithCommonFields {
    public name?: string;
    public code?: string;
    public email?: string;
    public phone?: string;
    public mobile?: string;
    public notes?: string;
    public hospitalName?: string;
}

export class TrialSiteDto extends BaseDtoWithCommonFields {
    public name?: string;
    public code?: string;
    public email?: string;
    public phone?: string;
    public mobile?: string;
    public notes?: string;
    public hospitalName?: string;
}

export class TrialSiteLookUpDto extends BaseLookUpDto {
    public code?: string;
    public $displayName?: string;
}

export interface ITrialSiteModel {
    list: TrialSiteDto[],
    errorMessage: any,
    dataStatus: DataStatusEnum
}
