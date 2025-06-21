import { provideToastr } from 'ngx-toastr';

export const toasterModule = provideToastr(
    {
        timeOut: 5000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: true
    }
)