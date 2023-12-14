/* tslint:disable */
/* eslint-disable */
import { LicenceAppDocumentResponse } from './licence-app-document-response';
import { LicenceDocumentTypeCode } from './licence-document-type-code';
export interface FingerprintProofDocument {
  documentResponses?: null | Array<LicenceAppDocumentResponse>;
  expiryDate?: null | string;
  licenceDocumentTypeCode?: LicenceDocumentTypeCode;
}
