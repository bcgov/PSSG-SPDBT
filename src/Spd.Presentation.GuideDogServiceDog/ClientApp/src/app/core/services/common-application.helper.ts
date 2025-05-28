import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { BehaviorSubject, Observable, of, Subscriber } from 'rxjs';

export abstract class CommonApplicationHelper {
	private _waitUntilInitialized$ = new BehaviorSubject<boolean>(false);
	waitUntilInitialized$ = this._waitUntilInitialized$.asObservable();

	initialized = false;
	hasValueChanged = false;
	isLoading = true;

	photographOfYourself: string | ArrayBuffer | null = null;

	booleanTypeCodes = BooleanTypeCode;

	serviceTypeFormGroup: FormGroup = this.formBuilder.group({
		serviceTypeCode: new FormControl('', [FormControlValidators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [FormControlValidators.required]),
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
		originalPhotoOfYourselfExpired: new FormControl(false), // not used for Business Licence
	});

	photographOfYourselfFormGroup: FormGroup = this.formBuilder.group(
		{
			updatePhoto: new FormControl(''), // used by update/renewal
			uploadedDateTime: new FormControl(''), // used in Renewal to determine if a new photo is mandatory
			attachments: new FormControl([]),
			updateAttachments: new FormControl([]), // used by update/renewal
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'attachments',
					(_form) => this.applicationTypeFormGroup.get('applicationTypeCode')?.value == ApplicationTypeCode.New
				),
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

	contactInformationFormGroup: FormGroup = this.formBuilder.group({
		emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
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

	isPhotographOfYourselfEmpty(image: Blob | null): boolean {
		if (!image || image.size == 0) {
			return false;
		}

		return true;
	}

	/**
	 * Set the current photo of yourself
	 * @returns
	 */
	setPhotographOfYourself(image: Blob | null): Observable<boolean> {
		if (!image || image.size == 0) {
			this.photographOfYourself = null;
			return of(false);
		}

		return new Observable<boolean>((observer: Subscriber<boolean>) => {
			const reader = new FileReader();

			// if success
			reader.onload = (_ev: ProgressEvent): void => {
				this.photographOfYourself = reader.result;
				observer.next(true);
			};
			// if failed
			reader.onerror = (_ev: any): void => {
				observer.error(false);
			};
			reader.readAsDataURL(image);
		});
	}

	/**
	 * When removing a file, set the value as changed
	 * @returns
	 */
	fileRemoved(): void {
		this.hasValueChanged = true;
	}
}
