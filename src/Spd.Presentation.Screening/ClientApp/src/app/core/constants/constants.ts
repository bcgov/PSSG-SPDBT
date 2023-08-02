export const SPD_CONSTANTS = {
	list: {
		defaultPageSize: 10,
	},
	date: {
		birthDateStartAtYears: 25,
		birthDateMinAgeYears: 12,
		dateFormat: 'yyyy-MM-dd',
		formalDateFormat: 'MMM dd, yyyy',
		formalDateTimeFormat: 'MMM dd, yyyy HH:mm',
		monthYearFormat: 'MMM yyyy',
		dateTimeFormat: 'yyyy-MM-dd HH:mm',
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
};
