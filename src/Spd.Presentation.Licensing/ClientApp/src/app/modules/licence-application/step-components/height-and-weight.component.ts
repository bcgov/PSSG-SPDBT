import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-height-and-weight',
	template: `
		<div class="step">
			<app-step-title title="Provide identifying information"></app-step-title>
			<div class="step-container row">
				<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Hair Colour</mat-label>
									<input matInput formControlName="hairColour" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('hairColour')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Eye Colour</mat-label>
									<input matInput formControlName="eyeColour" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Height (cm)</mat-label>
									<input matInput formControlName="height" maxlength="40" />
								</mat-form-field>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Weight (kg)</mat-label>
									<input matInput formControlName="weight" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('weight')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class HeightAndWeightComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		hairColour: new FormControl(''),
		eyeColour: new FormControl(''),
		height: new FormControl(''),
		weight: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
