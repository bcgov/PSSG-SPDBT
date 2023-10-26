import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { WorkerCategoryTypeCode } from 'src/app/api/models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-armoured-car-guard',
	template: `
		<div class="text-minor-heading mb-2">Authorization to Carry Certificate required</div>
		<div class="alert alert-category d-flex" role="alert">
			<div>
				Armoured car guards carry firearms, which requires a firearm licence and an Authorization to Carry (ATC)
				certificate. You must get this licence and ATC before you can apply to be an armoured car guard. More
				information is available from the
				<a href="https://www.rcmp-grc.gc.ca/en/firearms/authorization-carry" target="_blank">RCMP</a>.
			</div>
		</div>

		<form [formGroup]="form" novalidate>
			<div class="fs-6 fw-bold">Upload your valid Authorization to Carry certificate:</div>
			<div class="my-2">
				<app-file-upload [maxNumberOfFiles]="10" [control]="attachments" [files]="attachments.value"></app-file-upload>
				<mat-error
					class="mat-option-error"
					*ngIf="
						(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
						form.get('attachments')?.invalid &&
						form.get('attachments')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>

			<div class="row">
				<div class="col-lg-4 col-md-12 col-sm-12">
					<mat-form-field>
						<mat-label>Document Expiry Date</mat-label>
						<input
							matInput
							[matDatepicker]="picker"
							formControlName="documentExpiryDate"
							[errorStateMatcher]="matcher"
						/>
						<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
						<mat-datepicker #picker startView="multi-year"></mat-datepicker>
						<mat-error *ngIf="form.get('documentExpiryDate')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class LicenceCategoryArmouredCarGuardComponent implements OnInit, LicenceChildStepperStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryArmouredCarGuardFormGroup;
	title = '';

	matcher = new FormErrorStateMatcher();

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.ArmouredCarGuard, 'WorkerCategoryTypes');
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
