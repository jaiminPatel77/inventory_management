export class Environment {
    production: boolean = true;;
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
            apiServiceUrl: 'http://localhost:8080/api',
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

export const environment = new Environment();