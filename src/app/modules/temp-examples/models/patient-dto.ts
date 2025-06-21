import { BaseDtoWithCommonFields, BaseLookUpDto } from "../../shared/models/base-model";

export enum EnumAllocationGroup {
    Case = 1,
    Control = 2
}

export enum EnumVisitType {
    ScreeningVisit = 100,
    BaseLineVisit = 200,
    WK2 = 300,
    WK4 = 400,
    WK8 = 500,
    WK12_V2 = 600,
    WK20 = 700,
    WK24_V3 = 800,
    WK32 = 900,
    WK40 = 1000,
    WK48 = 1100,
    WK52_V4 = 1200,
    WK60 = 1300,
    WK68 = 1400,
    WK76 = 1500,
    WK84 = 1600,
    WK92 = 1700,
    WK100 = 1800,
    WK104_V5 = 1900,
    SAEAdverseEventVisit = 2000,
    EndOfTrialWithdrawalVisit = 2100,
}

export enum EnumPatientStatus {
    New = 0,
    ScreeningPending = 1,
    ScreeningFail = 2,
    ScreeningCompleted = 3,
    BaseLinePending = 4,
    BaseLineFail = 5,
    BaseLineCompleted = 6,
    Randomizied = 7,
    Visit2 = 8,
    Visit3 = 9,
    Visit4 = 10,
    Visit5 = 11,
    WK2 = 12,
    WK4 = 13,
    WK8 = 14,
    WK20 = 15,
    WK32 = 16,
    WK40 = 17,
    WK48 = 18,
    WK60 = 19,
    WK68 = 20,
    WK76 = 21,
    WK84 = 22,
    WK92 = 23,
    WK100 = 24,
    SAEAdverseEventVisit = 25,
    EndOfTrialWithdrawalVisit = 26
}

export class PatientLookUpDto extends BaseLookUpDto {
    public patientId?: string;
    public trialSiteId?: number;
    public enumAllocatedGroup?: EnumAllocationGroup;
}

export class PatientListDto extends BaseDtoWithCommonFields {
    public firstName?: string;
    public middleName?: string;
    public lastName?: string;
    public trialSiteId?: number;
    public trialSiteName?: string;
    public trialSiteCode?: string;
    public hospitalName?: string;
    public patientNumber?: number;
    public randomSequence?: number;
    public randomGroup?: number;
    public enumPatientStatus?: EnumPatientStatus;
    public locked?: boolean;
    public patientIdPart1?: string;
    public patientIdPart2?: string;
    public patientId?: string;
    public enumAllocatedGroup?: EnumAllocationGroup;
    public email?: string;
    public phone?: string;
    public mobile?: string;
    public notes?: string;
    public startDate?: Date;
    public isDeviceRegister: boolean = false;
    public dailyCigarettesCount?: number;
    public isLoggedIn?: boolean;
    public lastStudyVisit?: EnumVisitType;
    public lastStudyVisitDate?: Date;
    public nextStudyVisitDate?: Date;
    public isAppointment?: boolean;
    public appointmentDate?: Date;
    public appointmentId?: number;
    public nextStudyVisit?: EnumVisitType;
    public endOfTrialDate?: Date;
}

export class PatientDto extends BaseDtoWithCommonFields {
    public firstName?: string;
    public middleName?: string;
    public lastName?: string;
    public trialSiteId?: number;
    public patientNumber?: number;
    public randomSequence?: number;
    public randomGroup?: number;
    public enumPatientStatus: EnumPatientStatus = EnumPatientStatus.ScreeningPending;
    public locked?: boolean;
    public patientIdPart1?: string;
    public patientIdPart2?: string;
    public patientId?: string;
    public enumAllocatedGroup?: EnumAllocationGroup;
    public email?: string;
    public phone?: string;
    public mobile?: string;
    public notes?: string;
    public startDate?: Date;
    public endOfTrialDate?: Date;
    public isDeviceRegister?: boolean;
    public dailyCigarettesCount: number = 0;
    public isLoggedIn?: boolean;
}
