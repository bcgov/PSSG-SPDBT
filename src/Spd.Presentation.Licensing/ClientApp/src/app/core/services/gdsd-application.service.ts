import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
				if (this.initialized) {
					// const step1Complete = this.isStepLicenceSelectionComplete();
					// const step2Complete = this.isStepBackgroundComplete();
					// const step3Complete = this.isStepIdentificationComplete();
					// const isValid = step1Complete && step2Complete && step3Complete;
					// console.debug(
					// 	'gdsdModelFormGroup CHANGED',
					// 	step1Complete,
					// 	step2Complete,
					// 	step3Complete,
					// 	this.gdsdModelFormGroup.getRawValue()
					// );
					// this.updateModelChangeFlags();
					// this.gdsdModelValueChanges$.next(isValid);
				}
			});
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
