/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpContext } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Alias } from '../models/alias';
import { ApplicationTypeCode } from '../models/application-type-code';
import { DocumentTypeCode } from '../models/document-type-code';
import { EyeColourCode } from '../models/eye-colour-code';
import { GenderCode } from '../models/gender-code';
import { HairColourCode } from '../models/hair-colour-code';
import { HeightUnitCode } from '../models/height-unit-code';
import { LicenceTermCode } from '../models/licence-term-code';
import { PoliceOfficerRoleCode } from '../models/police-officer-role-code';
import { WeightUnitCode } from '../models/weight-unit-code';
import { WorkerLicenceCategoryData } from '../models/worker-licence-category-data';
import { WorkerLicenceCreateResponse } from '../models/worker-licence-create-response';
import { WorkerLicenceTypeCode } from '../models/worker-licence-type-code';

@Injectable({
  providedIn: 'root',
})
export class WorkerLicensingService extends BaseService {
  constructor(
    config: ApiConfiguration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Path part for operation apiWorkerLicensesPost
   */
  static readonly ApiWorkerLicensesPostPath = '/api/worker-licenses';

  /**
   * Create Security Worker Licence.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiWorkerLicensesPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicensesPost$Response(params?: {
    body?: {
'LicenceId'?: string;
'LicenceTypeData.WorkerLicenceTypeCode'?: WorkerLicenceTypeCode;
'ApplicationTypeData.ApplicationTypeCode'?: ApplicationTypeCode;
'SoleProprietorData.isSoleProprietor'?: boolean;
'PersonalInformationData.GivenName'?: string;
'PersonalInformationData.MiddleName1'?: string;
'PersonalInformationData.MiddleName2'?: string;
'PersonalInformationData.Surname'?: string;
'PersonalInformationData.DateOfBirth'?: string;
'PersonalInformationData.GenderCode'?: GenderCode;
'PersonalInformationData.OneLegalName'?: boolean;
'ExpiredLicenceData.ExpiredLicenceNumber'?: string;
'ExpiredLicenceData.ExpiryDate'?: string;
'ExpiredLicenceData.HasExpiredLicence'?: boolean;
'DogsAuthorizationData.UseDogs'?: boolean;
'DogsAuthorizationData.IsDogsPurposeProtection'?: boolean;
'DogsAuthorizationData.IsDogsPurposeDetectionDrugs'?: boolean;
'DogsAuthorizationData.IsDogsPurposeDetectionExplosives'?: boolean;
'DogsAuthorizationData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'DogsAuthorizationData.Documents.Attachments'?: Array<Blob>;
'DogsAuthorizationData.Documents.ExpiredDate'?: string;
'RestraintsAuthorizationData.CarryAndUseRetraints'?: boolean;
'RestraintsAuthorizationData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'RestraintsAuthorizationData.Documents.Attachments'?: Array<Blob>;
'RestraintsAuthorizationData.Documents.ExpiredDate'?: string;
'licenceTermData.LicenceTermCode'?: LicenceTermCode;
'PoliceBackgroundData.IsPoliceOrPeaceOfficer'?: boolean;
'PoliceBackgroundData.PoliceOfficerRoleCode'?: PoliceOfficerRoleCode;
'PoliceBackgroundData.OtherOfficerRole'?: string;
'PoliceBackgroundData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'PoliceBackgroundData.Documents.Attachments'?: Array<Blob>;
'PoliceBackgroundData.Documents.ExpiredDate'?: string;
'MentalHealthConditionsData.IsTreatedForMHC'?: boolean;
'MentalHealthConditionsData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'MentalHealthConditionsData.Documents.Attachments'?: Array<Blob>;
'MentalHealthConditionsData.Documents.ExpiredDate'?: string;
'CriminalHistoryData.HasCriminalHistory'?: boolean;
'ProofOfFingerprintData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'ProofOfFingerprintData.Documents.Attachments'?: Array<Blob>;
'ProofOfFingerprintData.Documents.ExpiredDate'?: string;
'AliasesData.HasPreviousName'?: boolean;
'AliasesData.Aliases'?: Array<Alias>;
'CitizenshipData.IsBornInCanada'?: boolean;
'CitizenshipData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'CitizenshipData.Documents.Attachments'?: Array<Blob>;
'CitizenshipData.Documents.ExpiredDate'?: string;
'GovIssuedIdData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'GovIssuedIdData.Documents.Attachments'?: Array<Blob>;
'GovIssuedIdData.Documents.ExpiredDate'?: string;
'BcDriversLicenceData.HasBcDriversLicence'?: boolean;
'BcDriversLicenceData.BcDriversLicenceNumber'?: string;
'CharacteristicsData.HairColourCode'?: HairColourCode;
'CharacteristicsData.EyeColourCode'?: EyeColourCode;
'CharacteristicsData.Height'?: number;
'CharacteristicsData.HeightUnitCode'?: HeightUnitCode;
'CharacteristicsData.Weight'?: number;
'CharacteristicsData.WeightUnitCode'?: WeightUnitCode;
'PhotographOfYourselfData.UseBcServicesCardPhoto'?: boolean;
'PhotographOfYourselfData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'PhotographOfYourselfData.Documents.Attachments'?: Array<Blob>;
'PhotographOfYourselfData.Documents.ExpiredDate'?: string;
'ContactInformationData.ContactEmailAddress'?: string;
'ContactInformationData.ContactPhoneNumber'?: string;
'ResidentialAddressData.IsMailingTheSameAsResidential'?: boolean;
'ResidentialAddressData.AddressSelected'?: boolean;
'ResidentialAddressData.AddressLine1'?: string;
'ResidentialAddressData.AddressLine2'?: string;
'ResidentialAddressData.City'?: string;
'ResidentialAddressData.Country'?: string;
'ResidentialAddressData.PostalCode'?: string;
'ResidentialAddressData.Province'?: string;
'MailingAddressData.AddressSelected'?: boolean;
'MailingAddressData.AddressLine1'?: string;
'MailingAddressData.AddressLine2'?: string;
'MailingAddressData.City'?: string;
'MailingAddressData.Country'?: string;
'MailingAddressData.PostalCode'?: string;
'MailingAddressData.Province'?: string;
'CategoriesData'?: Array<WorkerLicenceCategoryData>;
}
  },
  context?: HttpContext

): Observable<StrictHttpResponse<WorkerLicenceCreateResponse>> {

    const rb = new RequestBuilder(this.rootUrl, WorkerLicensingService.ApiWorkerLicensesPostPath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http.request(rb.build({
      responseType: 'json',
      accept: 'application/json',
      context: context
    })).pipe(
      filter((r: any) => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<WorkerLicenceCreateResponse>;
      })
    );
  }

  /**
   * Create Security Worker Licence.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiWorkerLicensesPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  apiWorkerLicensesPost(params?: {
    body?: {
'LicenceId'?: string;
'LicenceTypeData.WorkerLicenceTypeCode'?: WorkerLicenceTypeCode;
'ApplicationTypeData.ApplicationTypeCode'?: ApplicationTypeCode;
'SoleProprietorData.isSoleProprietor'?: boolean;
'PersonalInformationData.GivenName'?: string;
'PersonalInformationData.MiddleName1'?: string;
'PersonalInformationData.MiddleName2'?: string;
'PersonalInformationData.Surname'?: string;
'PersonalInformationData.DateOfBirth'?: string;
'PersonalInformationData.GenderCode'?: GenderCode;
'PersonalInformationData.OneLegalName'?: boolean;
'ExpiredLicenceData.ExpiredLicenceNumber'?: string;
'ExpiredLicenceData.ExpiryDate'?: string;
'ExpiredLicenceData.HasExpiredLicence'?: boolean;
'DogsAuthorizationData.UseDogs'?: boolean;
'DogsAuthorizationData.IsDogsPurposeProtection'?: boolean;
'DogsAuthorizationData.IsDogsPurposeDetectionDrugs'?: boolean;
'DogsAuthorizationData.IsDogsPurposeDetectionExplosives'?: boolean;
'DogsAuthorizationData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'DogsAuthorizationData.Documents.Attachments'?: Array<Blob>;
'DogsAuthorizationData.Documents.ExpiredDate'?: string;
'RestraintsAuthorizationData.CarryAndUseRetraints'?: boolean;
'RestraintsAuthorizationData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'RestraintsAuthorizationData.Documents.Attachments'?: Array<Blob>;
'RestraintsAuthorizationData.Documents.ExpiredDate'?: string;
'licenceTermData.LicenceTermCode'?: LicenceTermCode;
'PoliceBackgroundData.IsPoliceOrPeaceOfficer'?: boolean;
'PoliceBackgroundData.PoliceOfficerRoleCode'?: PoliceOfficerRoleCode;
'PoliceBackgroundData.OtherOfficerRole'?: string;
'PoliceBackgroundData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'PoliceBackgroundData.Documents.Attachments'?: Array<Blob>;
'PoliceBackgroundData.Documents.ExpiredDate'?: string;
'MentalHealthConditionsData.IsTreatedForMHC'?: boolean;
'MentalHealthConditionsData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'MentalHealthConditionsData.Documents.Attachments'?: Array<Blob>;
'MentalHealthConditionsData.Documents.ExpiredDate'?: string;
'CriminalHistoryData.HasCriminalHistory'?: boolean;
'ProofOfFingerprintData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'ProofOfFingerprintData.Documents.Attachments'?: Array<Blob>;
'ProofOfFingerprintData.Documents.ExpiredDate'?: string;
'AliasesData.HasPreviousName'?: boolean;
'AliasesData.Aliases'?: Array<Alias>;
'CitizenshipData.IsBornInCanada'?: boolean;
'CitizenshipData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'CitizenshipData.Documents.Attachments'?: Array<Blob>;
'CitizenshipData.Documents.ExpiredDate'?: string;
'GovIssuedIdData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'GovIssuedIdData.Documents.Attachments'?: Array<Blob>;
'GovIssuedIdData.Documents.ExpiredDate'?: string;
'BcDriversLicenceData.HasBcDriversLicence'?: boolean;
'BcDriversLicenceData.BcDriversLicenceNumber'?: string;
'CharacteristicsData.HairColourCode'?: HairColourCode;
'CharacteristicsData.EyeColourCode'?: EyeColourCode;
'CharacteristicsData.Height'?: number;
'CharacteristicsData.HeightUnitCode'?: HeightUnitCode;
'CharacteristicsData.Weight'?: number;
'CharacteristicsData.WeightUnitCode'?: WeightUnitCode;
'PhotographOfYourselfData.UseBcServicesCardPhoto'?: boolean;
'PhotographOfYourselfData.Documents.DocumentTypeCode'?: DocumentTypeCode;
'PhotographOfYourselfData.Documents.Attachments'?: Array<Blob>;
'PhotographOfYourselfData.Documents.ExpiredDate'?: string;
'ContactInformationData.ContactEmailAddress'?: string;
'ContactInformationData.ContactPhoneNumber'?: string;
'ResidentialAddressData.IsMailingTheSameAsResidential'?: boolean;
'ResidentialAddressData.AddressSelected'?: boolean;
'ResidentialAddressData.AddressLine1'?: string;
'ResidentialAddressData.AddressLine2'?: string;
'ResidentialAddressData.City'?: string;
'ResidentialAddressData.Country'?: string;
'ResidentialAddressData.PostalCode'?: string;
'ResidentialAddressData.Province'?: string;
'MailingAddressData.AddressSelected'?: boolean;
'MailingAddressData.AddressLine1'?: string;
'MailingAddressData.AddressLine2'?: string;
'MailingAddressData.City'?: string;
'MailingAddressData.Country'?: string;
'MailingAddressData.PostalCode'?: string;
'MailingAddressData.Province'?: string;
'CategoriesData'?: Array<WorkerLicenceCategoryData>;
}
  },
  context?: HttpContext

): Observable<WorkerLicenceCreateResponse> {

    return this.apiWorkerLicensesPost$Response(params,context).pipe(
      map((r: StrictHttpResponse<WorkerLicenceCreateResponse>) => r.body as WorkerLicenceCreateResponse)
    );
  }

}
