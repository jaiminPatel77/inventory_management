import { DataStatusEnum } from "../../modules/shared/models/common-models";
import { ITrialSiteModel } from "../../modules/temp-examples/models/trial-site-dto";

export const TrialSiteState: ITrialSiteModel = {
    list: [],
    errorMessage: '',
    dataStatus: DataStatusEnum.None
}