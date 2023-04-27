export const SPD_CONSTANTS = {
	list: {
		defaultPageSize: 10,
	},
	date: {
		birthDateStartAt: new Date(2000, 0, 1),
		dateFormat: 'yyyy-MM-dd',
		monthYearFormat: 'MMM yyyy',
		dateTimeFormat: 'yyyy-MM-dd HH:mm',
	},
	phone: {
		displayMask: '(000) 000-0000',
		backendMask: '000-000-0000',
	},
	sessionStorage: {
		organizationRegStateKey: 'state',
	},
};

export interface TableConfig {
	paginator: {
		pageIndex: number;
		pageSize: number;
		length: number;
	};
}
