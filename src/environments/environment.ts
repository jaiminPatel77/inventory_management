export class CSEnvironment {
    production: boolean = false;;
    _environmentSetting?: IEnvironmentSetting;

    get Setting(): IEnvironmentSetting {

        if (!this._environmentSetting) {
            this._environmentSetting = this.getSettings();
        }
        return this._environmentSetting;
    }

    getSettings(): IEnvironmentSetting {

        const setting = {
            rootURL: '/',
            apiServiceUrl: 'http://localhost:51390',
            captchaKey: '6LeMWhMaAAAAAIdY1BDd2CRx9Q_m0LYZ8_-qCeGV',
        }
        return setting;
    }

}
export interface IEnvironmentSetting {
    rootURL: string;
    apiServiceUrl: string;
    captchaKey: string;
}

export const environment = new CSEnvironment();