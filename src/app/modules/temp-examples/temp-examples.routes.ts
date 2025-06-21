import { Routes } from '@angular/router';
import { authGuard } from '../../models/route-gaurds/auth.guard';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { EnumPermissionFor, EnumPermissions } from '../shared/models/common-enums';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { TrialSiteListComponent } from './components/trial-site-list/trial-site-list.component';
import { TrialSiteDetailComponent } from './components/trial-site-detail/trial-site-detail.component';
import { TrialSiteListStoreComponent } from './components/trial-site-list-store/trial-site-list-store.component';

export const tempExamplesRoutes: Routes = [
    {
        path: 'patients',
        //canActivate: [authGuard],
        component: PatientListComponent,
        data: {
            permission: EnumPermissions.ViewAccess,
            permissionFor: EnumPermissionFor.Patient
        }
    },
    {
        path: 'patients/:id',
        //canActivate: [authGuard],
        component: PatientDetailComponent,
        data: {
            permission: EnumPermissions.ViewAccess,
            permissionFor: EnumPermissionFor.Patient
        }
    },
    {
        path: 'trial-sites-store',
        //canActivate: [authGuard],
        component: TrialSiteListStoreComponent,
        data: {
            permission: EnumPermissions.ViewAccess,
            permissionFor: EnumPermissionFor.TrialSite
        }
    },
    {
        path: 'trial-sites',
        //canActivate: [authGuard],
        component: TrialSiteListComponent,
        data: {
            permission: EnumPermissions.ViewAccess,
            permissionFor: EnumPermissionFor.TrialSite
        }
    },
    {
        path: 'trial-sites/:id',
        //canActivate: [authGuard],
        component: TrialSiteDetailComponent,
        data: {
            permission: EnumPermissions.ViewAccess,
            permissionFor: EnumPermissionFor.TrialSite
        }
    }
]