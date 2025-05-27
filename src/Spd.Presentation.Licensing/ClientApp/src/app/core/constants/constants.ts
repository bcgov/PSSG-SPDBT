export const SPD_CONSTANTS = {
	list: {
		defaultPageSize: 10,
	},
	date: {
		birthDateStartAtYears: 25,
		birthDateMinAgeYears: 12,
		dateFormat: 'YYYY-MM-DD',
		formalDateFormat: 'MMM DD, YYYY',
		formalDateTimeFormat: 'MMM DD, YYYY HH:mm',
		monthYearFormat: 'MMM yyyy',
		dateTimeFormat: 'YYYY-MM-DD HH:mm',
		backendDateFormat: 'YYYY-MM-DD',
	},
	periods: {
		applicationNotSubmittedWarningDays: 14, // show warning 14 days before the 30 day mark
		applicationNotSubmittedErrorDays: 7, // show error 7 days before the 30 day mark
		applicationNotSubmittedValidDays: 30, // user has 30 days to submit the application, otherwise dynamics deletes it
		licenceReplacementPeriodPreventionDays: 14, // cannot replace within 14 days of expiry
		licenceUpdatePeriodPreventionDays: 14, // cannot update within 14 days of expiry
		licenceRenewPeriodDays: 90, // can only renew only if current licence term is 1,2,3 or 5 years and expiry date is in 90 days or less
		licenceRenewPeriodDaysNinetyDayTerm: 60, // can only renew only if current licence term is 90 days and expiry date is in 60 days or less
	},
	phone: {
		spdPhoneNumber: '1-855-587-0185',
		displayMask: '(000) 000-0000',
		backendMask: '000-000-0000',
	},
	document: {
		maxFileSize: 26214400, // bytes
		maxFileSizeInMb: 25,
		maxNumberOfFiles: 10,
		acceptedFileTypes: [
			'.docx',
			'.doc',
			'.bmp',
			'.jpeg',
			'.jpg',
			'.tif',
			'.tiff',
			'.png',
			'.gif',
			'.pdf',
			'.html',
			'.htm',
		],
	},
	api: {
		debounceTime: 500, // milliseconds
	},
	sessionStorage: {
		cmCrcStateKey: 'cm-crc-state',
	},
	payment: {
		maxNumberOfAttempts: 10,
	},
	maxCount: {
		aliases: 10,
		controllingMembersAndBusinessManagers: 20,
		employees: 20,
	},
	urls: {
		addressChangeUrl: 'https://www.addresschange.gov.bc.ca/',
		bcCorporateRegistriesUrl: 'https://www.bcregistry.gov.bc.ca/',
		bceidUrl: 'https://www.bceid.ca',
		bceidBluePagesUrl: 'https://www.bceid.ca/directories/bluepages/',
		bceidGettingStartedUrl: 'https://www.bceid.ca/register/business/getting_started/getting_started.aspx',
		bcGovPrivacyUrl: 'https://www2.gov.bc.ca/gov/content/home/privacy',
		bcGovDisclaimerUrl: 'https://www2.gov.bc.ca/gov/content/home/disclaimer',
		bcGovAccessibilityUrl: 'https://www2.gov.bc.ca/gov/content/home/accessibility',
		bcGovCopyrightUrl: 'https://www2.gov.bc.ca/gov/content/home/copyright',
		bcGovContactUrl: 'https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services',
		bcRegistriesAccountUrl: 'https://www.account.bcregistry.gov.bc.ca/decide-business',
		bcServicesCardUrl: 'https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card',
		canadianPassportPhotoUrl:
			'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html',
		changeNameOrAddressUrl: 'https://www.icbc.com/driver-licensing/getting-licensed/Change-your-name-or-address',
		aboutSpdUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/security-programs-division',
		contactSpdUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/security-programs-division#contact',
		controllingMemberChecklistUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/apply',
		swlLearnMoreUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/workers/training',
		swlAcceptedIdUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/workers/apply',
		mentalHealthConditionsFormUrl:
			'https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/forms/spd0511-mentalcondition.pdf',
		proofOfInsuranceUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/apply',
		rcmpUrl: 'https://www.rcmp-grc.gc.ca/en/firearms/authorization-carry',
		setupAccountUrl: 'https://id.gov.bc.ca/account/',
		safetyCertificateChecklistUrl:
			'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/10_207_2008#section4',
		securityIndustryLicensingUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing',
		securityIndustryLicensingCmUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/apply',
		securityLicensingProcessAndLicenceConditionsPoliciesUrl:
			'https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf',
		securityServicesActUrl: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/07030_01',
		spdComplaintUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/enforcement#complaints',
	},
	files: {
		businessMemberAuthConsentManualForm: './assets/files/Business Member Auth Consent.pdf',
		guideDogServiceDogTerms: './assets/files/Guide Dog Service Dog Applicant Terms of Use.pdf',
		securityServicesApplicantTerms: './assets/files/Security Services Applicant Terms of Use.pdf',
		securityServicesApplicantUpdateTerms: './assets/files/Security Services Applicant Update Terms of Use.pdf',
		securityServicesBusinessApplicantTerms: './assets/files/Security Services Business Applicant Terms of Use.pdf',
		securityServicesBusinessApplicantUpdateTerms:
			'./assets/files/Security Services Business Applicant Update Terms of Use.pdf',
		requestForFingerprintingForm: './assets/files/SPD Request for Fingerprinting Form.pdf',
	},
	address: {
		provinceBC: 'BC',
		provinceBritishColumbia: 'British Columbia',
		countryCA: 'CA',
		countryCanada: 'Canada',
	},
};
