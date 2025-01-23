import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BehaviorSubject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { GdsdApplicationHelper } from './gdsd-application.helper';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class GdsdApplicationService extends GdsdApplicationHelper {
	gdsdModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	gdsdModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),
		applicantId: new FormControl(), // when authenticated, the applicant id
		caseNumber: new FormControl(), // placeholder to save info for display purposes
		termsAndConditionsData: this.termsAndConditionsFormGroup,
		personalInformationData: this.gdsdPersonalInformationFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		dogTrainingInformationData: this.dogTrainingInformationFormGroup,
		dogInformationData: this.dogInformationFormGroup,
		accreditedGraduationData: this.accreditedGraduationFormGroup,
	});

	gdsdModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.gdsdModelChangedSubscription = this.gdsdModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				// if (this.initialized) {
				const step1Complete = this.isStepSelectionComplete();
				const step2Complete = this.isStepPersonalInformationComplete();
				const step3Complete = this.isStepDogInformationComplete();
				const step4Complete = this.isStepTrainingInformationComplete();
				const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

				console.debug(
					'gdsdModelFormGroup CHANGED',
					// 	step1Complete,
					// 	step2Complete,
					// 	step3Complete,
					this.gdsdModelFormGroup.getRawValue()
				);
				this.updateModelChangeFlags();
				this.gdsdModelValueChanges$.next(isValid);
				// }
			});
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isAutoSave(): boolean {
		if (!this.isSaveAndExit()) {
			return false;
		}

		return this.hasValueChanged;
	}

	/**
	 * Determine if the Save & Exit process can occur
	 * @returns
	 */
	isSaveAndExit(): boolean {
		if (this.applicationTypeFormGroup.get('applicationTypeCode')?.value != ApplicationTypeCode.New) {
			return false;
		}

		return true;
	}

	isStepSelectionComplete(): boolean {
		return this.termsAndConditionsFormGroup.valid;
	}

	isStepPersonalInformationComplete(): boolean {
		return (
			this.gdsdPersonalInformationFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.governmentPhotoIdFormGroup.valid &&
			this.mailingAddressFormGroup.valid
		);
	}

	isStepDogInformationComplete(): boolean {
		return (
			this.dogTrainingInformationFormGroup.valid &&
			this.dogInformationFormGroup.valid &&
			this.accreditedGraduationFormGroup.valid
		);
	}

	isStepTrainingInformationComplete(): boolean {
		return false;
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.gdsdModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const aliasesArray = this.gdsdModelFormGroup.get('aliasesData.aliases') as FormArray;
		while (aliasesArray.length) {
			aliasesArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.gdsdModelFormGroup.value);
	}
}
