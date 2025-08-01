import { MenuItem } from "./menu";

export class MenuHelper {

    /**
     * Define default menu relation for application.
     */
    public static readonly menus: MenuItem[] = [
        new MenuItem('dashboard', 'SIDE_BAR_DASHBOARD', '/dashboard', 'fa fa-home', false, []),
        new MenuItem('inventory', 'SIDE_BAR_LIST', '/inventory', 'fa fa-boxes', false, []),
        new MenuItem('billing', 'SIDE_BAR_BILL', '/billing', 'fa fa-file-invoice', false, []),
        new MenuItem('history', 'SIDE_BAR_HISTORY', '/history', 'fa fa-book-medical', false, []),
        // new MenuItem('admin', 'SIDE_BAR_ADMIN', '/admin', 'cs_icon', false, [
        //     new MenuItem('roles', 'SIDE_BAR_ROLES', '/admin/roles', 'cs_icon', false, []),
        //     new MenuItem('users', 'SIDE_BAR_USERS', '/admin/users', 'cs_icon', false, []),
        //     new MenuItem('mail-setting', 'SIDE_BAR_MAIL_SETTING', '/admin/mail-setting', 'cs_icon', false, [])
        // ], false),
        // new MenuItem('temp-examples', 'SIDE_BAR_TEMP_EXAMPLES', '/temp-examples', 'cs_icon', false, [
        //     new MenuItem('trialsites', 'SIDE_BAR_TRIAL_SITES', '/temp-examples/trial-sites', 'cs_icon', false, []),
        //     new MenuItem('trialsites-store', 'SIDE_BAR_TRIAL_SITES_STORE', '/temp-examples/trial-sites-store', 'cs_icon', false, []),
        //     new MenuItem('patients', 'SIDE_BAR_PATIENTS', '/temp-examples/patients', 'cs_icon', false, [])
        // ], false)
    ];

    /**
     * Url Path helper
     */
    public static isUrlPathEqual(path: string, link: string) {
        const locationPath = MenuHelper.getPathPartOfUrl(path);
        return link === locationPath;
    }

    public static isUrlPathContain(path: string, link: string) {
        const locationPath = MenuHelper.getPathPartOfUrl(path);
        const endOfUrlSegmentRegExp = /\/|^$/;
        return locationPath.startsWith(link) &&
            locationPath.slice(link.length).charAt(0).search(endOfUrlSegmentRegExp) !== -1;
    }

    public static getPathPartOfUrl(url: string): string {
        const matchedUrl = /.*?(?=[?;#]|$)/.exec(url);
        return matchedUrl?.[0] ?? '';
    }

    public static getFragmentPartOfUrl(url: string): string {
        const matched = /#(.+)/.exec(url);
        return matched ? matched[1] : '';
    }

}