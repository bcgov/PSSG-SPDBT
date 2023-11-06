/* tslint:disable */
/* eslint-disable */
import { LicenceAppDocumentResponse } from './licence-app-document-response';
import { LicenceDocumentTypeCode } from './licence-document-type-code';
export interface MentalHealthDocument {
  documentResponses?: null | Array<LicenceAppDocumentResponse>;
  licenceDocumentTypeCode?: LicenceDocumentTypeCode;
}
