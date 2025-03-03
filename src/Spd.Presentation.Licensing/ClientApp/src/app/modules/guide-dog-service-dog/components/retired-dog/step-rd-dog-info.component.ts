import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-rd-dog-info',
	template: `
		<app-step-section [title]="title">
			<app-form-gdsd-dog-info [form]="form" [applicationTypeCode]="applicationTypeCode"></app-form-gdsd-dog-info>

			<form [formGroup]="retiredDogForm" novalidate>
				<div class="row">
					<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<mat-divider class="mb-2 mt-4 mat-divider-primary"></mat-divider>
						<div class="row">
							<div class="col-xl-6 col-lg-12 col-md-12">
								<div class="fs-5 lh-base mt-3 mb-2">When was your dog retired from service?</div>

								<div class="col-xxl-8 col-xl-12 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Date of Retirement</mat-label>
										<input
											matInput
											[matDatepicker]="picker"
											formControlName="dateOfRetirement"
											[max]="maxToday"
											[min]="minDate"
											[errorStateMatcher]="matcher"
										/>
										<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
										<mat-datepicker #picker startView="multi-year"></mat-datepicker>
										<mat-error *ngIf="retiredDogForm.get('dateOfRetirement')?.hasError('required')"
											>This is required</mat-error
										>
										<mat-error *ngIf="retiredDogForm.get('dateOfRetirement')?.hasError('matDatepickerMin')">
											Invalid date of retirement
										</mat-error>
										<mat-error *ngIf="retiredDogForm.get('dateOfRetirement')?.hasError('matDatepickerMax')">
											This must be on or before {{ maxToday | formatDate }}
										</mat-error>
									</mat-form-field>
								</div>
							</div>

							<div class="col-xl-6 col-lg-12 col-md-12">
								<div class="fs-5 lh-base mt-3 mb-2">Will your dog continue to live with you in his/her retirement?</div>

								<mat-radio-group aria-label="Select an option" formControlName="isContinueToLiveWithDog">
									<div class="d-flex justify-content-start">
										<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.Yes"> Yes </mat-radio-button>
										<mat-radio-button class="radio-label w-auto" [value]="booleanTypeCodes.No"> No </mat-radio-button>
									</div>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(retiredDogForm.get('isContinueToLiveWithDog')?.dirty ||
											retiredDogForm.get('isContinueToLiveWithDog')?.touched) &&
										retiredDogForm.get('isContinueToLiveWithDog')?.invalid &&
										retiredDogForm.get('isContinueToLiveWithDog')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdDogInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	booleanTypeCodes = BooleanTypeCode;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.retiredDogApplicationService.dogInfoFormGroup;
	retiredDogForm: FormGroup = this.retiredDogApplicationService.retiredDogForm;

	maxToday = this.utilService.getToday();
	minDate = this.utilService.getDogDateMin();

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(
		private utilService: UtilService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isNew ? 'Your retired dog information' : 'Confirm your retired dog information';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		this.retiredDogForm.markAllAsTouched();

		return this.form.valid && this.retiredDogForm.valid;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
