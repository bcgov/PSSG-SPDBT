import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HeightUnitCode, WeightUnitCode } from '@app/api/models';
import {
	EyeColourTypes,
	HairColourTypes,
	HeightUnitTypes,
	WeightUnitTypes,
} from '@app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-physical-characteristics',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div [ngClass]="isWizardStep ? 'col-md-8 col-sm-12 mx-auto' : 'col-12'">
					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Hair Colour</mat-label>
								<mat-select formControlName="hairColourCode" [errorStateMatcher]="matcher">
									@for (item of hairColourTypes; track item; let i = $index) {
										<mat-option [value]="item.code">{{ item.desc }}</mat-option>
									}
								</mat-select>
								@if (form.get('hairColourCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Eye Colour</mat-label>
								<mat-select formControlName="eyeColourCode" [errorStateMatcher]="matcher">
									@for (item of eyeColourTypes; track item; let i = $index) {
										<mat-option [value]="item.code">{{ item.desc }}</mat-option>
									}
								</mat-select>
								@if (form.get('eyeColourCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="text-primary-color fs-6 mb-1">Height</div>
						<div
							class="col-lg-6 col-md-12 col-sm-12"
							[ngClass]="heightUnitCode.value === heightUnitCodes.Inches ? 'col-xl-3' : 'col-xl-6'"
						>
							<mat-form-field>
								<mat-label>
									@if (heightUnitCode.value === heightUnitCodes.Centimeters) {
										<span>Cm</span>
									}
									@if (heightUnitCode.value === heightUnitCodes.Inches) {
										<span>Ft</span>
									}
								</mat-label>
								<input matInput formControlName="height" [errorStateMatcher]="matcher" mask="099" />
								@if (form.get('height')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
								@if (form.get('height')?.hasError('mask')) {
									<mat-error>This must be a 1 to 3 digit whole number</mat-error>
								}
							</mat-form-field>
						</div>
						@if (heightUnitCode.value === heightUnitCodes.Inches) {
							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>In</mat-label>
									<input matInput formControlName="heightInches" [errorStateMatcher]="matcher" mask="09" />
									@if (form.get('heightInches')?.hasError('max')) {
										<mat-error>This must be less than 12</mat-error>
									}
									@if (form.get('heightInches')?.hasError('mask')) {
										<mat-error>This must be a 1 or 2 digit whole number</mat-error>
									}
								</mat-form-field>
							</div>
						}
						<div
							class="col-xl-6 col-md-12 col-sm-12"
							[ngClass]="heightUnitCode.value === heightUnitCodes.Inches ? 'col-lg-12' : 'col-lg-6'"
						>
							<mat-form-field>
								<mat-label>Units</mat-label>
								<mat-select formControlName="heightUnitCode" [errorStateMatcher]="matcher">
									@for (item of heightUnitTypes; track item; let i = $index) {
										<mat-option [value]="item.code">{{ item.desc }}</mat-option>
									}
								</mat-select>
								@if (form.get('heightUnitCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="text-primary-color fs-6 mb-1">Weight</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>
									@if (weightUnitCode.value === weightUnitCodes.Kilograms) {
										<span>Kg</span>
									}
									@if (weightUnitCode.value === weightUnitCodes.Pounds) {
										<span>Lbs</span>
									}
								</mat-label>
								<input matInput formControlName="weight" [errorStateMatcher]="matcher" mask="009" />
								@if (form.get('weight')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
								@if (form.get('weight')?.hasError('mask')) {
									<mat-error>This must be a 2 or 3 digit whole number</mat-error>
								}
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Units</mat-label>
								<mat-select formControlName="weightUnitCode" [errorStateMatcher]="matcher">
									@for (item of weightUnitTypes; track item; let i = $index) {
										<mat-option [value]="item.code">{{ item.desc }}</mat-option>
									}
								</mat-select>
								@if (form.get('weightUnitCode')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class FormPhysicalCharacteristicsComponent implements OnInit {
	hairColourTypes = HairColourTypes;
	eyeColourTypes = EyeColourTypes;
	heightUnitTypes = HeightUnitTypes;
	weightUnitTypes = WeightUnitTypes;
	weightUnitCodes = WeightUnitCode;
	heightUnitCodes = HeightUnitCode;

	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadonly = false;

	ngOnInit(): void {
		if (this.isReadonly) {
			this.hairColourCode.disable({ emitEvent: false });
			this.eyeColourCode.disable({ emitEvent: false });
			this.height.disable({ emitEvent: false });
			this.heightUnitCode.disable({ emitEvent: false });
			this.heightInches.disable({ emitEvent: false });
			this.weight.disable({ emitEvent: false });
			this.weightUnitCode.disable({ emitEvent: false });
		} else {
			this.hairColourCode.enable();
			this.eyeColourCode.enable();
			this.height.enable();
			this.heightUnitCode.enable();
			this.heightInches.enable();
			this.weight.enable();
			this.weightUnitCode.enable();
		}
	}

	isFormValid(): boolean {
		if (this.isReadonly) {
			return true;
		}

		this.form.markAllAsTouched();
		const isValid1 = this.form.valid;

		console.debug('[FormPhysicalCharacteristicsComponent] isFormValid', isValid1);

		return isValid1;
	}

	get hairColourCode(): FormControl {
		return this.form.get('hairColourCode') as FormControl;
	}
	get eyeColourCode(): FormControl {
		return this.form.get('eyeColourCode') as FormControl;
	}
	get height(): FormControl {
		return this.form.get('height') as FormControl;
	}
	get heightUnitCode(): FormControl {
		return this.form.get('heightUnitCode') as FormControl;
	}
	get heightInches(): FormControl {
		return this.form.get('heightInches') as FormControl;
	}
	get weight(): FormControl {
		return this.form.get('weight') as FormControl;
	}
	get weightUnitCode(): FormControl {
		return this.form.get('weightUnitCode') as FormControl;
	}
}
