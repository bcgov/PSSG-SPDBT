import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HeightUnitCode } from '@app/api/models';
import {
	EyeColourTypes,
	HairColourTypes,
	HeightUnitTypes,
	WeightUnitTypes,
} from '@app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-common-physical-characteristics',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Hair Colour</mat-label>
								<mat-select formControlName="hairColourCode" [errorStateMatcher]="matcher">
									<mat-option *ngFor="let item of hairColourTypes; let i = index" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('hairColourCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-6 col-lg-6 col-md-12">
							<mat-form-field>
								<mat-label>Eye Colour</mat-label>
								<mat-select formControlName="eyeColourCode" [errorStateMatcher]="matcher">
									<mat-option *ngFor="let item of eyeColourTypes; let i = index" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('eyeColourCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="text-primary-color fs-6 mb-1">Height</div>
						<div
							class="col-lg-6 col-md-12 col-sm-12"
							[ngClass]="heightUnitCode.value === heightUnitCodes.Inches ? 'col-xl-4' : 'col-xl-6'"
						>
							<mat-form-field>
								<mat-label>
									Number
									<span *ngIf="heightUnitCode.value === heightUnitCodes.Inches"> of Feet</span>
								</mat-label>
								<input matInput formControlName="height" [errorStateMatcher]="matcher" mask="099" />
								<mat-error *ngIf="form.get('height')?.hasError('required')"> This is required </mat-error>
								<mat-error *ngIf="form.get('height')?.hasError('mask')">
									This must be a 1 to 3 digit whole number
								</mat-error>
							</mat-form-field>
						</div>
						<div
							class="col-lg-6 col-md-12 col-sm-12"
							[ngClass]="heightUnitCode.value === heightUnitCodes.Inches ? 'col-xl-4' : 'col-xl-6'"
						>
							<mat-form-field>
								<mat-label>Units</mat-label>
								<mat-select formControlName="heightUnitCode" [errorStateMatcher]="matcher">
									<mat-option *ngFor="let item of heightUnitTypes; let i = index" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('heightUnitCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12" *ngIf="heightUnitCode.value === heightUnitCodes.Inches">
							<mat-form-field>
								<mat-label>Number of Inches</mat-label>
								<input matInput formControlName="heightInches" [errorStateMatcher]="matcher" mask="09" />
								<!-- <mat-error *ngIf="form.get('heightInches')?.hasError('required')"> This is required </mat-error> -->
								<mat-error *ngIf="form.get('heightInches')?.hasError('mask')">
									This must be a 1 or 2 digit whole number
								</mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row">
						<div class="text-primary-color fs-6 mb-1">Weight</div>
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
								<mat-select formControlName="weightUnitCode" [errorStateMatcher]="matcher">
									<mat-option *ngFor="let item of weightUnitTypes; let i = index" [value]="item.code">
										{{ item.desc }}
									</mat-option>
								</mat-select>
								<mat-error *ngIf="form.get('weightUnitCode')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CommonPhysicalCharacteristicsComponent {
	hairColourTypes = HairColourTypes;
	eyeColourTypes = EyeColourTypes;
	heightUnitTypes = HeightUnitTypes;
	weightUnitTypes = WeightUnitTypes;
	heightUnitCodes = HeightUnitCode;

	matcher = new FormErrorStateMatcher();

	@Input() form!: FormGroup;

	get heightUnitCode(): FormControl {
		return this.form.get('heightUnitCode') as FormControl;
	}
}
