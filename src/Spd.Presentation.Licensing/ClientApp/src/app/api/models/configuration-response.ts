/* tslint:disable */
/* eslint-disable */
import { LicenceFeeResponse } from './licence-fee-response';
import { OidcConfiguration } from './oidc-configuration';
import { RecaptchaConfiguration } from './recaptcha-configuration';
import { WorkerCategoryTypeCode } from './worker-category-type-code';
export interface ConfigurationResponse {
  bcscConfiguration?: OidcConfiguration;
  invalidWorkerLicenceCategoryMatrixConfiguration?: null | {
'ArmouredCarGuard'?: Array<WorkerCategoryTypeCode>;
'BodyArmourSales'?: Array<WorkerCategoryTypeCode>;
'ClosedCircuitTelevisionInstaller'?: Array<WorkerCategoryTypeCode>;
'ElectronicLockingDeviceInstaller'?: Array<WorkerCategoryTypeCode>;
'FireInvestigator'?: Array<WorkerCategoryTypeCode>;
'Locksmith'?: Array<WorkerCategoryTypeCode>;
'LocksmithUnderSupervision'?: Array<WorkerCategoryTypeCode>;
'PrivateInvestigator'?: Array<WorkerCategoryTypeCode>;
'PrivateInvestigatorUnderSupervision'?: Array<WorkerCategoryTypeCode>;
'SecurityGuard'?: Array<WorkerCategoryTypeCode>;
'SecurityGuardUnderSupervision'?: Array<WorkerCategoryTypeCode>;
'SecurityAlarmInstallerUnderSupervision'?: Array<WorkerCategoryTypeCode>;
'SecurityAlarmInstaller'?: Array<WorkerCategoryTypeCode>;
'SecurityAlarmMonitor'?: Array<WorkerCategoryTypeCode>;
'SecurityAlarmResponse'?: Array<WorkerCategoryTypeCode>;
'SecurityAlarmSales'?: Array<WorkerCategoryTypeCode>;
'SecurityConsultant'?: Array<WorkerCategoryTypeCode>;
};
  licenceFees?: null | Array<LicenceFeeResponse>;
  oidcConfiguration?: OidcConfiguration;
  recaptchaConfiguration?: RecaptchaConfiguration;
  replacementProcessingTime?: null | string;
}
