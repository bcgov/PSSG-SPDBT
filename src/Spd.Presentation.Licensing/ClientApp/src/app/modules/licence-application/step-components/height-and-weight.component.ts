import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
	EyeColourTypes,
	HairColourTypes,
	HeightUnitTypes,
	WeightUnitTypes,
} from 'src/app/core/code-types/model-desc.models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import {
	LicenceApplicationService,
	LicenceFormStepComponent,
	LicenceModelSubject,
} from '../licence-application.service';

@Component({
	selector: 'app-height-and-weight',
	template: `
		<section class="step-section p-3">
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
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Height</mat-label>
										<input matInput formControlName="height" mask="009" />
										<mat-error *ngIf="form.get('height')?.hasError('required')"> This is required </mat-error>
										<mat-error *ngIf="form.get('height')?.hasError('mask')">
											This must be a 2 or 3 digit whole number
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Height Units</mat-label>
										<mat-select formControlName="heightUnitCode">
											<mat-option *ngFor="let item of heightUnitTypes" [value]="item.code">
												{{ item.desc }}
											</mat-option>
										</mat-select>
										<mat-error *ngIf="form.get('heightUnitCode')?.hasError('required')"> This is required </mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Weight</mat-label>
										<input matInput formControlName="weight" [errorStateMatcher]="matcher" mask="009" />
										<mat-error *ngIf="form.get('weight')?.hasError('required')"> This is required </mat-error>
										<mat-error *ngIf="form.get('weight')?.hasError('mask')">
											This must be a 2 or 3 digit whole number
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-xl-6 col-lg-6 col-md-12">
									<mat-form-field>
										<mat-label>Weight Units</mat-label>
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
export class HeightAndWeightComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	private licenceModelLoadedSubscription!: Subscription;

	hairColourTypes = HairColourTypes;
	eyeColourTypes = EyeColourTypes;
	heightUnitTypes = HeightUnitTypes;
	weightUnitTypes = WeightUnitTypes;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		hairColourCode: new FormControl(null, [FormControlValidators.required]),
		eyeColourCode: new FormControl(null, [FormControlValidators.required]),
		height: new FormControl(null, [FormControlValidators.required]),
		heightUnitCode: new FormControl(null, [FormControlValidators.required]),
		weight: new FormControl(null, [FormControlValidators.required]),
		weightUnitCode: new FormControl(null, [FormControlValidators.required]),
	});

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.licenceModelLoadedSubscription = this.licenceApplicationService.licenceModelLoaded$.subscribe({
			next: (loaded: LicenceModelSubject) => {
				if (loaded.isLoaded) {
					this.form.patchValue({
						hairColourCode: this.licenceApplicationService.licenceModel.hairColourCode,
						eyeColourCode: this.licenceApplicationService.licenceModel.eyeColourCode,
						height: this.licenceApplicationService.licenceModel.height,
						heightUnitCode: this.licenceApplicationService.licenceModel.heightUnitCode,
						weight: this.licenceApplicationService.licenceModel.weight,
						weightUnitCode: this.licenceApplicationService.licenceModel.weightUnitCode,
					});
				}
			},
		});
	}

	ngOnDestroy() {
		this.licenceModelLoadedSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getDataToSave(): any {
		return this.form.value;
	}
}
