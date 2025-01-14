import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { MetalDealersApplicationHelper } from './metal-dealers-application.helper';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class MetalDealersApplicationService extends MetalDealersApplicationHelper {
	modelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	modelFormGroup: FormGroup = this.formBuilder.group({
		registerData: this.registerFormGroup,
		businessOwnerData: this.businessOwnerFormGroup,
		businessManagerData: this.businessManagerFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		businessMailingAddressData: this.businessMailingAddressFormGroup,
		branchesData: this.branchesFormGroup,
		consentAndDeclarationData: this.consentAndDeclarationFormGroup,
	});

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepRegistrationInformationComplete(): boolean {
		// return this.registerFormGroup.valid;
		return true;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBusinessInformationComplete(): boolean {
		// return this.businessOwnerFormGroup.valid && this.businessManagerFormGroup.valid;
		return true;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBusinessAddressesComplete(): boolean {
		// return this.businessAddressFormGroup.valid;
		return true;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBranchOfficesComplete(): boolean {
		// return this.branchesFormGroup.valid;
		return true;
	}

	/**
	 * Create an empty registration
	 * @returns
	 */
	createNewRegistration(): Observable<any> {
		this.reset();

		// this.modelFormGroup.patchValue(
		// 	{
		// 		serviceTypeData: { serviceTypeCode: serviceTypeCode },
		// 		profileConfirmationData: { isProfileUpToDate: true },
		// 		mentalHealthConditionsData: { hasNewMentalHealthCondition: BooleanTypeCode.Yes },
		// 		characteristicsData,
		// 	},
		// 	{
		// 		emitEvent: false,
		// 	}
		// );
		this.initialized = true;

		return of(this.modelFormGroup.value);

		// return this.getLicenceEmptyAnonymous(serviceTypeCode).pipe(
		// 	tap((_resp: any) => {
		// 		this.initialized = true;

		// 		this.commonApplicationService.setApplicationTitle(serviceTypeCode);
		// 	})
		// );
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.modelFormGroup.reset();

		// clear the branches data - this does not seem to get reset during a formgroup reset
		const branchesArray = this.modelFormGroup.get('branchesData.branches') as FormArray;
		while (branchesArray.length) {
			branchesArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.modelFormGroup.value);
	}
}
