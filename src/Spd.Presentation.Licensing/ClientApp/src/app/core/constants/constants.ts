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
	payment: {
		maxNumberOfAttempts: 3,
	},
	maxNumberOfAliases: 3,
	// sessionStorage: {
	// 	organizationRegStateKey: 'state',
	// 	crcPortalStateKey: 'crc-state',
	// 	bannerMessageKey: 'banner-message',
	// },
	urls: {
		requestReplacementUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/security-programs-division#contact',
		contactSpdUrl:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/about/security-programs-division#contact',
		setupAccountUrl: 'https://id.gov.bc.ca/account/',
		addressChangeUrl: 'https://www.addresschange.gov.bc.ca/',
		permitBodyAmourViewExemptions:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/body-armour/possessing',
		permitArmouredVehicleViewExemptions:
			'https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/armoured-vehicles/who-not-require-permit',
	},
};
