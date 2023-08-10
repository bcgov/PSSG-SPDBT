import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-dogs-or-restraints',
	template: `
		<div class="step">
			<app-step-title title="Do you want to request authorization to use dogs or restraints?"></app-step-title>
			<div class="step-container">
				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="useDogsOrRestraints">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
						</div>
					</div>

					<div class="row mt-4" *ngIf="useDogsOrRestraints.value == booleanTypeCodes.Yes">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="mb-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
							<ng-container>
								<div class="row mt-2">
									<div class="col-12">
										<mat-label class="fw-semibold">I request authorization to use dogs for the purpose of</mat-label>
										<mat-checkbox formControlName="isDogsPurposeProtection"> Protection </mat-checkbox>
										<mat-checkbox formControlName="isDogsPurposeDetectionDrugs"> Detection - Drugs </mat-checkbox>
										<mat-checkbox formControlName="isDogsPurposeDetectionExplosives">
											Detection - Explosives
										</mat-checkbox>
									</div>
								</div>
								<mat-divider class="my-2"></mat-divider>
								<div class="row">
									<div class="col-12">
										<mat-label class="fw-semibold">I request authorization to carry and use restraints</mat-label>
										<mat-radio-group aria-label="Select an option" formControlName="carryAndUseRetraints">
											<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
											<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
										</mat-radio-group>
									</div>
								</div>
							</ng-container>
						</div>
					</div>
				</form>
			</div>
		</div>
	`,
	styles: [],
})
export class DogsOrRestraintsComponent {
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		useDogsOrRestraints: new FormControl(''),
		isDogsPurposeProtection: new FormControl(''),
		isDogsPurposeDetectionDrugs: new FormControl(''),
		isDogsPurposeDetectionExplosives: new FormControl(''),
		carryAndUseRetraints: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}

	get useDogsOrRestraints(): FormControl {
		return this.form.get('useDogsOrRestraints') as FormControl;
	}
}
