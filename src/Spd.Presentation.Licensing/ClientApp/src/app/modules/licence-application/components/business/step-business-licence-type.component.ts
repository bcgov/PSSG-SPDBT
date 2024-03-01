import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BusinessTypeCode } from '@app/api/models';
import { BusinessTypes, SelectOptions } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-type',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="What is the type of business or company?"
					subtitle="Check your <a class='large' href='https://www.account.bcregistry.gov.bc.ca/decide-business' target='_blank'>BC Registries account</a> if you're not sure. "
				></app-step-title>

				<div class="row">
					<div class="col-xxl-4 col-xl-4 col-lg-5 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="businessTypeCode">
								<ng-container *ngFor="let item of businessTypeCodes; let i = index">
									<mat-radio-button class="radio-label" [value]="item.code">{{ item.desc }}</mat-radio-button>
								</ng-container>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('businessTypeCode')?.dirty || form.get('businessTypeCode')?.touched) &&
									form.get('businessTypeCode')?.invalid &&
									form.get('businessTypeCode')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceTypeComponent implements OnInit, LicenceChildStepperStepComponent {
	businessTypeCodes: SelectOptions[] = [];
	form: FormGroup = this.businessApplicationService.businessTypeFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		this.businessTypeCodes = BusinessTypes.filter((item: SelectOptions) => item.code != BusinessTypeCode.None);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
