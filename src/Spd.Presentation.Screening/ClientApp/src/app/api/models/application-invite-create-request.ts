/* tslint:disable */
/* eslint-disable */
import { PayerPreferenceTypeCode } from './payer-preference-type-code';
import { ScreenTypeCode } from './screen-type-code';
import { ServiceTypeCode } from './service-type-code';
export interface ApplicationInviteCreateRequest {
  email?: null | string;
  firstName?: null | string;
  jobTitle?: null | string;
  lastName?: null | string;
  payeeType?: PayerPreferenceTypeCode;
  screenType?: ScreenTypeCode;
  serviceType?: ServiceTypeCode;
}
