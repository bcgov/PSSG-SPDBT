/* tslint:disable */
/* eslint-disable */
import { LicenceFeeResponse } from '../models/licence-fee-response';
import { OidcConfiguration } from '../models/oidc-configuration';
import { RecaptchaConfiguration } from '../models/recaptcha-configuration';
import { WorkerCategoryTypeCode } from '../models/worker-category-type-code';
export interface ConfigurationResponse {
  bcscConfiguration?: OidcConfiguration;
  invalidWorkerLicenceCategoryMatrixConfiguration?: ({
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
}) | null;
  licenceFees?: Array<LicenceFeeResponse> | null;
  oidcConfiguration?: OidcConfiguration;
  recaptchaConfiguration?: RecaptchaConfiguration;
  replacementProcessingTime?: string | null;
}
