import { createReducer, on } from "@ngrx/store";
import { TrialSiteState } from "./trialsite.state";
import { createTrialSite, createTrialSiteFailure, createTrialSiteSuccess, deleteTrialSite, deleteTrialSiteFailure, deleteTrialSiteSuccess, getTrialSites, getTrialSitesFailure, getTrialSitesSuccess, updateTrialSite, updateTrialSiteFailure, updateTrialSiteSuccess } from "./trialsite.actions";
import { ITrialSiteModel } from "../../modules/temp-examples/models/trial-site-dto";
import { DataStatusEnum } from "../../modules/shared/models/common-models";

const _trialsiteReducer = createReducer(
    TrialSiteState,

    // get trial sites
    on(getTrialSites, (state) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.Fetching
        };
    }),
    on(getTrialSitesSuccess, (state, action) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.DataAvailable,
            list: action.list,
            errorMessage: ''
        }
    }),
    on(getTrialSitesFailure, (state, action) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.Error,
            list: [],
            errorMessage: action.errorMessage
        }
    }),

    // create trial site
    on(createTrialSite, (state) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.Fetching
        };
    }),
    on(createTrialSiteSuccess, (state, { trialSite }) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.DataAvailable,
            list: [...state.list, trialSite],
            errorMessage: ''
        }
    }),
    on(createTrialSiteFailure, (state, action) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.Error,
            list: [],
            errorMessage: action.errorMessage
        }
    }),

    // update trial site
    on(updateTrialSite, (state) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.Fetching
        };
    }),
    on(updateTrialSiteSuccess, (state, { trialSite }) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.DataAvailable,
            list: state.list.map((e) => e.id === trialSite.id ? trialSite : e),
            errorMessage: ''
        }
    }),
    on(updateTrialSiteFailure, (state, action) => {
        return {
            ...state,
            dataStatus: DataStatusEnum.Error,
            list: [],
            errorMessage: action.errorMessage
        }
    }),

    // delete trial site
    on(deleteTrialSite, (state) => {
        return {
            ...state,
            // dataStatus: DataStatusEnum.Fetching
        };
    }),
    on(deleteTrialSiteSuccess, (state, { trialSite }) => {
        return {
            ...state,
            // dataStatus: DataStatusEnum.DataAvailable,
            list: state.list.filter((e) => e.id !== trialSite.id),
            errorMessage: ''
        }
    }),
    on(deleteTrialSiteFailure, (state, action) => {
        return {
            ...state,
            // dataStatus: DataStatusEnum.Error,
            errorMessage: action.errorMessage
        }
    })
)

export function TrialSiteReducer(state = TrialSiteState, action: any): ITrialSiteModel {
    return _trialsiteReducer(state, action)
}