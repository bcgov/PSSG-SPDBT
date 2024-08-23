import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode, PoliceOfficerRoleCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { BehaviorSubject } from 'rxjs';

export abstract class ApplicationHelper {
	private _waitUntilInitialized$ = new BehaviorSubject<boolean>(false);
	waitUntilInitialized$ = this._waitUntilInitialized$.asObservable();

	initialized = false;
	hasValueChanged = false;
	isLoading = true;

	photographOfYourself: string | ArrayBuffer | null = null;

	booleanTypeCodes = BooleanTypeCode;

	workerLicenceTypeFormGroup: FormGroup = this.formBuilder.group({
		workerLicenceTypeCode: new FormControl('', [Validators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [Validators.required]),
	});

	accessCodeFormGroup: FormGroup = this.formBuilder.group({
		licenceNumber: new FormControl('', [FormControlValidators.required]),
		accessCode: new FormControl('', [FormControlValidators.required]),
		linkedLicenceId: new FormControl(null, [FormControlValidators.required]),
		linkedLicenceAppId: new FormControl(null),
		linkedLicenceTermCode: new FormControl(null),
		linkedExpiryDate: new FormControl(null),
		linkedCardHolderName: new FormControl(null),
		linkedLicenceHolderName: new FormControl(null),
		linkedLicenceHolderId: new FormControl(null),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', FormControlValidators.required),
		}),
	});

	originalLicenceFormGroup: FormGroup = this.formBuilder.group({
		originalApplicationId: new FormControl(null),
		originalLicenceId: new FormControl(null),
		originalLicenceNumber: new FormControl(null),
		originalExpiryDate: new FormControl(null),
		originalLicenceTermCode: new FormControl(null),
		originalBizTypeCode: new FormControl(null),
		originalPhotoOfYourselfExpired: new FormControl(false),
		originalDogAuthorizationExists: new FormControl(false),
	});

	linkAccountCodeFormGroup: FormGroup = this.formBuilder.group({
		licenceNumber: new FormControl('', [FormControlValidators.required]),
		accessCode: new FormControl('', [FormControlValidators.required]),
	});

	fingerprintProofFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]),
	});

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			expiredLicenceId: new FormControl(''),
			expiredLicenceHolderName: new FormControl(''),
			expiredLicenceNumber: new FormControl(''),
			expiredLicenceExpiryDate: new FormControl(''),
			expiredLicenceStatusCode: new FormControl(''),
			captchaFormGroup: new FormGroup(
				{
					displayCaptcha: new FormControl(false),
					token: new FormControl(''),
				},
				{
					validators: [
						FormGroupValidators.conditionalRequiredValidator(
							'token',
							(form) => form.get('displayCaptcha')?.value == true
						),
					],
				}
			),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiredLicenceId',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	licenceTermFormGroup: FormGroup = this.formBuilder.group({
		licenceTermCode: new FormControl('', [FormControlValidators.required]),
	});

	criminalHistoryFormGroup: FormGroup = this.formBuilder.group(
		{
			hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
			criminalChargeDescription: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'criminalChargeDescription',
					(_form) =>
						_form.get('hasCriminalHistory')?.value == BooleanTypeCode.Yes &&
						this.applicationTypeFormGroup.get('applicationTypeCode')?.value == ApplicationTypeCode.Update
				),
			],
		}
	);

	policeBackgroundFormGroup: FormGroup = this.formBuilder.group(
		{
			isPoliceOrPeaceOfficer: new FormControl('', [FormControlValidators.required]),
			policeOfficerRoleCode: new FormControl(''),
			otherOfficerRole: new FormControl(''),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'policeOfficerRoleCode',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.nopoliceofficerValidator('policeOfficerRoleCode', 'isPoliceOrPeaceOfficer'),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'otherOfficerRole',
					(form) => form.get('policeOfficerRoleCode')?.value == PoliceOfficerRoleCode.Other
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	mentalHealthConditionsFormGroup: FormGroup = this.formBuilder.group(
		{
			isTreatedForMHC: new FormControl('', [FormControlValidators.required]),
			attachments: new FormControl(''),
			hasPreviousMhcFormUpload: new FormControl(''), // used to determine label to display
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isTreatedForMHC')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	bcDriversLicenceFormGroup: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl('', [FormControlValidators.required]),
		bcDriversLicenceNumber: new FormControl(),
	});

	photographOfYourselfFormGroup: FormGroup = this.formBuilder.group(
		{
			updatePhoto: new FormControl(''), // used by update/renewal
			uploadedDateTime: new FormControl(''), // used in Renewal to determine if a new photo is mandatory
			attachments: new FormControl([], [FormControlValidators.required]),
			updateAttachments: new FormControl([]), // used by update/renewal
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'updateAttachments',
					(form) =>
						form.get('updatePhoto')?.value == this.booleanTypeCodes.Yes &&
						this.applicationTypeFormGroup.get('applicationTypeCode')?.value !== ApplicationTypeCode.New
				),
				FormGroupValidators.conditionalRequiredValidator(
					'updatePhoto',
					(_form) => this.applicationTypeFormGroup.get('applicationTypeCode')?.value !== ApplicationTypeCode.New
				),
			],
		}
	);

	characteristicsFormGroup: FormGroup = this.formBuilder.group({
		hairColourCode: new FormControl('', [FormControlValidators.required]),
		eyeColourCode: new FormControl('', [FormControlValidators.required]),
		height: new FormControl('', [FormControlValidators.required]),
		heightUnitCode: new FormControl('', [FormControlValidators.required]),
		heightInches: new FormControl(''),
		weight: new FormControl('', [FormControlValidators.required]),
		weightUnitCode: new FormControl('', [FormControlValidators.required]),
	});

	personalInformationFormGroup: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			genderCode: new FormControl('', [FormControlValidators.required]),
			dateOfBirth: new FormControl('', [Validators.required]),
			hasLegalNameChanged: new FormControl(false),
			hasBcscNameChanged: new FormControl(),
			origGivenName: new FormControl(''),
			origMiddleName1: new FormControl(''),
			origMiddleName2: new FormControl(''),
			origSurname: new FormControl(''),
			origGenderCode: new FormControl(''),
			origDateOfBirth: new FormControl(''),
			hasGenderChanged: new FormControl(false),
			attachments: new FormControl([]),
			cardHolderName: new FormControl(), // placeholder for data to display in Update process
			licenceHolderName: new FormControl(), // placeholder for data to display in Update process
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => !!form.get('hasLegalNameChanged')?.value
				),
			],
		}
	);

	aliasesFormGroup: FormGroup = this.formBuilder.group({
		previousNameFlag: new FormControl(null, [FormControlValidators.required]),
		aliases: this.formBuilder.array([]),
	});

	contactInformationFormGroup: FormGroup = this.formBuilder.group({
		emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		phoneNumber: new FormControl('', [Validators.required]),
	});

	residentialAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
	});

	mailingAddressFormGroup: FormGroup = this.formBuilder.group(
		{
			addressSelected: new FormControl(false),
			addressLine1: new FormControl(''),
			addressLine2: new FormControl(''),
			city: new FormControl(''),
			postalCode: new FormControl(''),
			province: new FormControl(''),
			country: new FormControl(''),
			isAddressTheSame: new FormControl(false),
			captchaFormGroup: new FormGroup(
				{
					displayCaptcha: new FormControl(false),
					token: new FormControl(''),
				},
				{
					validators: [
						FormGroupValidators.conditionalRequiredValidator(
							'token',
							(form) => form.get('displayCaptcha')?.value == true
						),
					],
				}
			),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredTrueValidator(
					'addressSelected',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'addressLine1',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'city',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'postalCode',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'province',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'country',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
			],
		}
	);

	profileConfirmationFormGroup: FormGroup = this.formBuilder.group({
		isProfileUpToDate: new FormControl('', [Validators.requiredTrue]),
	});

	termsAndConditionsFormGroup: FormGroup = this.formBuilder.group({
		agreeToTermsAndConditions: new FormControl('', [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }, [Validators.requiredTrue]),
	});

	constructor(protected formBuilder: FormBuilder) {}

	clearExpiredLicenceModelData(): void {
		// clear out any old data
		this.expiredLicenceFormGroup.patchValue({
			expiredLicenceId: null,
			expiredLicenceHolderName: null,
			expiredLicenceNumber: null,
			expiredLicenceExpiryDate: null,
			expiredLicenceStatusCode: null,
		});
	}

	resetCommon(): void {
		this.photographOfYourself = null;
		this.termsAndConditionsFormGroup.reset();
		this.accessCodeFormGroup.reset();
	}

	updateModelChangeFlags(): void {
		if (this.isLoading) {
			this.isLoading = false;
		} else {
			this.hasValueChanged = true;
		}
	}

	resetModelChangeFlags(): void {
		this.hasValueChanged = false;
	}

	resetModelFlags(): void {
		this.initialized = false;
		this.isLoading = true;
		this.hasValueChanged = false;

		this._waitUntilInitialized$.next(false);
	}

	setAsInitialized(): void {
		this.initialized = true;

		this._waitUntilInitialized$.next(true);
	}

	/**
	 * Set the current photo of yourself
	 * @returns
	 */
	setPhotographOfYourself(image: Blob | null): void {
		if (!image || image.size == 0) {
			this.photographOfYourself = null;
			return;
		}

		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (_event) => {
			this.photographOfYourself = reader.result;
		};
	}

	/**
	 * When removing a file, set the value as changed
	 * @returns
	 */
	fileRemoved(): void {
		this.hasValueChanged = true;
	}

	/**
	 * Get the title for the PoliceBackground page
	 * @returns
	 */
	getPoliceBackgroundTitle(applicationTypeCode: ApplicationTypeCode | null): string {
		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			return 'Do you now hold any Police Officer or Peace Officer roles?';
		} else {
			return 'Are you currently a Police Officer or Peace Officer?';
		}
	}

	/**
	 * Get the title for the MentalHealthConditions page
	 * @returns
	 */
	getMentalHealthConditionsTitle(
		applicationTypeCode: ApplicationTypeCode | null,
		hasPreviousMhcFormUpload: boolean
	): [string, string] {
		let title = '';
		let subtitle = '';

		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			if (hasPreviousMhcFormUpload) {
				// If they uploaded a MHC form during the previous application
				title = 'Has your mental health condition changed since you last submitted a mental health condition form?';
			} else {
				// If they have never uploaded a MHC form before, show this
				title = 'Have you been treated for a mental health condition in the last 3 years?';
			}
		} else {
			title = 'Have you been treated for any mental health conditions?';
			subtitle =
				'An individual applying for a security worker licence must provide particulars of any mental health condition for which the individual has received treatment';
		}

		return [title, subtitle];
	}
}
