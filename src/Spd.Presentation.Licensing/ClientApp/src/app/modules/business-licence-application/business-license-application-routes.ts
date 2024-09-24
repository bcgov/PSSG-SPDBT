
export class BusinessLicenceApplicationRoutes {
	public static readonly BUSINESS_LICENCE_APPLICATION = 'business-licence';

	public static readonly BUSINESS_FIRST_TIME_USER_TERMS = 'terms-and-conditions';

	public static readonly BUSINESS_NEW_SOLE_PROPRIETOR = 'business-licence-new-sp'; // should contain url parameters for licenceAppId & isSoleProprietorSWLAnonymous

	public static readonly BUSINESS_LICENCE_UPDATE_TERMS = 'business-licence-update-terms';
	public static readonly BUSINESS_LICENCE_APP_PROFILE = 'app-profile';
	public static readonly BUSINESS_NEW = 'new';
	public static readonly BUSINESS_RENEWAL = 'renewal';
	public static readonly BUSINESS_UPDATE = 'update';
	public static readonly BUSINESS_REPLACEMENT = 'replacement';
	public static readonly BUSINESS_PROFILE = 'business-profile';
	public static readonly BUSINESS_MANAGERS = 'business-managers';
	public static readonly BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES = 'controlling-members-and-employees';
	public static readonly BUSINESS_UPDATE_SUCCESS = 'business-update-success';

	public static readonly BUSINESS_MANAGER_INVITATION = 'invitation';

	// PAYMENT
	public static readonly PAYMENT_SUCCESS = 'payment-success';
	public static readonly PAYMENT_FAIL = 'payment-fail';
	public static readonly PAYMENT_CANCEL = 'payment-cancel';
	public static readonly PAYMENT_ERROR = 'payment-error';

	public static readonly MODULE_PATH = BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route
			? `/${BusinessLicenceApplicationRoutes.MODULE_PATH}/${route}`
			: `/${BusinessLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathBusinessLicence(route: string | null = null): string {
		return route
			? `/${BusinessLicenceApplicationRoutes.MODULE_PATH}/${route}`
			: `/${BusinessLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathBusinessApplications(): string {
		return `/${BusinessLicenceApplicationRoutes.MODULE_PATH}`;
	}
}
