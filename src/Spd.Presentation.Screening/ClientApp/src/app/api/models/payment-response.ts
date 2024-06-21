/* tslint:disable */
/* eslint-disable */
import { ApplicationTypeCode } from '../models/application-type-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { PaymentStatusCode } from '../models/payment-status-code';
import { PaymentTypeCode } from '../models/payment-type-code';
import { ServiceTypeCode } from '../models/service-type-code';
export interface PaymentResponse {
  applicationId?: string;
  applicationTypeCode?: ApplicationTypeCode;
  caseNumber?: string | null;
  email?: string | null;
  licenceTermCode?: LicenceTermCode;
  message?: string | null;
  paidSuccess?: boolean;
  paymentId?: string;
  paymentStatus?: PaymentStatusCode;
  paymentType?: PaymentTypeCode;
  serviceTypeCode?: ServiceTypeCode;
  transAmount?: number;
  transDateTime?: string;
  transOrderId?: string | null;
}
