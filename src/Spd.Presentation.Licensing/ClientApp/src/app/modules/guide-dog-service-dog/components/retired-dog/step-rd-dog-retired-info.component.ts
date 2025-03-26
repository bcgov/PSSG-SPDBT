import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-rd-dog-retired-info',
	template: `
		<app-step-section [title]="title">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-5 col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
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
							<mat-error *ngIf="form.get('dateOfRetirement')?.hasError('required')">This is required</mat-error>
							<mat-error *ngIf="form.get('dateOfRetirement')?.hasError('matDatepickerMin')">
								Invalid date of retirement
							</mat-error>
							<mat-error *ngIf="form.get('dateOfRetirement')?.hasError('matDatepickerMax')">
								This must be on or before {{ maxToday | formatDate }}
							</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepRdDogRetiredInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	booleanTypeCodes = BooleanTypeCode;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.retiredDogApplicationService.dogRetiredForm;

	maxToday = this.utilService.getToday();
	minDate = this.utilService.getDogDateMin();

	@Input() applicationTypeCode!: ApplicationTypeCode;

	constructor(
		private utilService: UtilService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {}

	ngOnInit(): void {
		this.title = this.isNew
			? 'When was your dog retired from service?'
			: 'Confirm when was your dog retired from service';
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
