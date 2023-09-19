import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LicenceApplicationService, LicenceFormStepComponent, SwlTermCode } from '../licence-application.service';

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
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceTermComponent implements OnInit, LicenceFormStepComponent {
	termCodes = SwlTermCode;

	form: FormGroup = this.formBuilder.group({
		licenceTermCode: new FormControl(),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.form.patchValue({
			licenceTermCode: this.licenceApplicationService.licenceModel.licenceTermCode,
		});
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}
}
