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
	phone: {
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
	sessionStorage: {
		organizationRegStateKey: 'state',
		crrpaPortalStateKey: 'crrpa-state',
		pssoaPortalStateKey: 'pssoa-state',
		bannerMessageKey: 'banner-message',
	},
	payment: {
		maxNumberOfAttempts: 3,
	},
	maxNumberOfAliases: 3,
	files: {
		pssoTerms: './assets/files/Psso-terms-and-conditions.pdf',
		pssoFirstTimeTerms: './assets/files/Psso-pe-crc-org-terms-and-conditions.pdf',
		peCrcOrPeCrcVsTerms: './assets/files/Pe-crc-terms-and-conditions.pdf',
		crrpTerms: './assets/files/Crrp-terms-and-conditions.pdf',
	},
	closeRedirects: {
		crrpApplication:
			'https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check/applicants/process',
		peCrcApplication: 'https://www2.gov.bc.ca/gov/content/home',
		mcfdApplication:
			'https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/children-and-family-development',
		pssoCheck:
			'https://www2.gov.bc.ca/gov/content/careers-myhr/hiring-managers/process/extend-offer/security-screening/about',
	},
	message: {
		pssoVsWarning: 'I confirm I am submitting a combined check on behalf of the Centralized Services Hub (CSH) team.',
	},
};
