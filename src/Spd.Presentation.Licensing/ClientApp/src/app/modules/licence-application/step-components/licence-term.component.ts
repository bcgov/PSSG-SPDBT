import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-licence-term',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Select your licence term"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="licenceTerm">
								<mat-radio-button class="radio-label" value="90">90 Days ($60)</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" value="1">1 Year ($120)</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" value="2">2 Years ($180)</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" value="3">3 Years ($240)</mat-radio-button>
							</mat-radio-group>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class LicenceTermComponent {
	form: FormGroup = this.formBuilder.group({
		licenceTerm: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
