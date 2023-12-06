import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-term',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Select your licence term"></app-step-title>
				<div class="step-container">
					<div class="row">
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<form [formGroup]="form" novalidate>
								<mat-radio-group aria-label="Select an option" formControlName="licenceTermCode">
									<ng-container *ngFor="let term of termCodes; let i = index; let last = last">
										<mat-radio-button class="radio-label" [value]="term.licenceTermCode">
											{{ term.licenceTermCode | options : 'LicenceTermTypes' }} ({{
												term.amount | currency : 'CAD' : 'symbol-narrow' : '1.0'
											}})
										</mat-radio-button>
										<mat-divider *ngIf="!last" class="my-2"></mat-divider>
									</ng-container>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('licenceTermCode')?.dirty || form.get('licenceTermCode')?.touched) &&
										form.get('licenceTermCode')?.invalid &&
										form.get('licenceTermCode')?.hasError('required')
									"
									>This is required</mat-error
								>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceTermComponent implements LicenceChildStepperStepComponent {
	termCodes = this.licenceApplicationService.licenceFeeTermCodes;

	form: FormGroup = this.licenceApplicationService.licenceTermFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
