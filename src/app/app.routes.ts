import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { authGuard } from './models/route-gaurds/auth.guard';
import { DashboardComponent } from './modules/master/components/dashboard/dashboard.component';
import { HomeComponent } from './modules/master/components/home/home.component';
import { ProfileComponent } from './modules/master/components/profile/profile.component';
import { InventoryListComponent } from './modules/master/components/inventory-list/inventory-list.component';

export const routes: Routes = [
    // {
    //     path: '',
    //     component: LoginComponent
    // },
    // {
    //     path: 'auth',
    //     loadChildren: () => import('../app/modules/auth/auth.routes').then(r => r.authRoutes)
    // },
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'dashboard',
                data: { preload: true },
                // canActivate: [authGuard],
                component: DashboardComponent
            },
            // {
            //     path: 'profile',
            //     data: { preload: true },
            //     // canActivate: [authGuard],
            //     component: ProfileComponent
            // },
            // {
            //     path: 'admin',
            //     // canActivate: [authGuard],
            //     loadChildren: () => import('../app/modules/admin/admin.routes').then(r => r.adminRoutes)
            // },
            // {
            //     path: 'temp-examples',
            //     // canActivate: [authGuard],
            //     loadChildren: () => import('../app/modules/temp-examples/temp-examples.routes').then(r => r.tempExamplesRoutes)
            // },
            {
                path: 'inventory',
                 data: { preload: true },
                // canActivate: [authGuard],
                component: InventoryListComponent
            }
        ]
    }
];
