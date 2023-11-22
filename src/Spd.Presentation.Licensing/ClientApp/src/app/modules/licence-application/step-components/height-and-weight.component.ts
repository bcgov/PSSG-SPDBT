import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HeightUnitCode } from 'src/app/api/models';
import {
	EyeColourTypes,
	HairColourTypes,
	HeightUnitTypes,
	WeightUnitTypes,
} from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-height-and-weight',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Provide identifying information"></app-step-title>
				<div class="step-container row">
					<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<div class="row">
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Hair Colour</mat-label>
										<mat-select formControlName="hairColourCode">
											<mat-option *ngFor="let item of hairColourTypes" [value]="item.code">
												{{ item.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="form.get('hairColourCode')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Eye Colour</mat-label>
										<mat-select formControlName="eyeColourCode">
											<mat-option *ngFor="let item of eyeColourTypes" [value]="item.code">
												{{ item.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="form.get('eyeColourCode')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
							</div>
							<div class="row">
								<div class="text-minor-heading mb-2">Height</div>
								<div
									class="col-lg-6 col-md-12 col-sm-12"
									[ngClass]="heightUnitCode.value == heightUnitCodes.Inches ? 'col-xl-4' : 'col-xl-6'"
								>
									<mat-form-field>
										<mat-label>
											Number
											<span *ngIf="heightUnitCode.value == heightUnitCodes.Inches"> of Feet</span>
										</mat-label>
										<input matInput formControlName="height" mask="099" />
										<mat-error *ngIf="form.get('height')?.hasError('required')"> This is required </mat-error>
										<mat-error *ngIf="form.get('height')?.hasError('mask')">
											This must be a 1 to 3 digit whole number
										</mat-error>
									</mat-form-field>
								</div>
								<div
									class="col-lg-6 col-md-12 col-sm-12"
									[ngClass]="heightUnitCode.value == heightUnitCodes.Inches ? 'col-xl-4' : 'col-xl-6'"
								>
									<mat-form-field>
										<mat-label>Units</mat-label>
										<mat-select formControlName="heightUnitCode">
											<mat-option *ngFor="let item of heightUnitTypes" [value]="item.code">
												{{ item.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="form.get('heightUnitCode')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-4 col-lg-6 col-md-12" *ngIf="heightUnitCode.value == heightUnitCodes.Inches">
									<mat-form-field>
										<mat-label>Number of Inches</mat-label>
										<input matInput formControlName="heightInches" mask="09" />
										<!-- <mat-error *ngIf="form.get('heightInches')?.hasError('required')"> This is required </mat-error> -->
										<mat-error *ngIf="form.get('heightInches')?.hasError('mask')">
											This must be a 1 or 2 digit whole number
										</mat-error>
									</mat-form-field>
								</div>
							</div>
							<div class="row">
								<div class="text-minor-heading mb-2">Weight</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Number</mat-label>
										<input matInput formControlName="weight" [errorStateMatcher]="matcher" mask="009" />
										<mat-error *ngIf="form.get('weight')?.hasError('required')"> This is required </mat-error>
										<mat-error *ngIf="form.get('weight')?.hasError('mask')">
											This must be a 2 or 3 digit whole number
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Units</mat-label>
										<mat-select formControlName="weightUnitCode">
											<mat-option *ngFor="let item of weightUnitTypes" [value]="item.code">
												{{ item.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="form.get('weightUnitCode')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class HeightAndWeightComponent implements LicenceChildStepperStepComponent {
	hairColourTypes = HairColourTypes;
	eyeColourTypes = EyeColourTypes;
	heightUnitTypes = HeightUnitTypes;
	weightUnitTypes = WeightUnitTypes;
	heightUnitCodes = HeightUnitCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.characteristicsFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get heightUnitCode(): FormControl {
		return this.form.get('heightUnitCode') as FormControl;
	}
}
