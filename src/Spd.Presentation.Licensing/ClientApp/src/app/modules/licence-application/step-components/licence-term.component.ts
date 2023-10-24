import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LicenceTermCode } from 'src/app/api/models';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-term',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Select your licence term"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="licenceTermCode">
								<mat-radio-button class="radio-label" [value]="termCodes.NintyDays">90 Days ($60)</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="termCodes.OneYear">1 Year ($120)</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="termCodes.TwoYears">2 Years ($180)</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="termCodes.ThreeYears">3 Years ($240)</mat-radio-button>
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
		</section>
	`,
	styles: [],
})
export class LicenceTermComponent implements LicenceFormStepComponent {
	termCodes = LicenceTermCode;

	form: FormGroup = this.licenceApplicationService.licenceTermFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
