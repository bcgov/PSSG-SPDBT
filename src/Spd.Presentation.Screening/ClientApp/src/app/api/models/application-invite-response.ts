/* tslint:disable */
/* eslint-disable */
import { PayeePreferenceTypeCode } from './payee-preference-type-code';
export interface ApplicationInviteResponse {
  createdOn?: string;
  email?: null | string;
  errorMsg?: null | string;
  firstName?: null | string;
  id?: string;
  jobTitle?: null | string;
  lastName?: null | string;
  payeeType?: PayeePreferenceTypeCode;
  status?: null | string;
}
