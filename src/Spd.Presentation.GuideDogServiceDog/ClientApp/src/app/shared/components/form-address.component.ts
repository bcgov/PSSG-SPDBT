import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-form-address',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div [ngClass]="isWideView ? 'col-md-6 col-sm-12' : 'col-12'">
					<mat-form-field>
						<mat-label>Street Address 1</mat-label>
						<input matInput formControlName="addressLine1" [errorStateMatcher]="matcher" maxlength="100" />
						<mat-error *ngIf="form.get('addressLine1')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>

				<div [ngClass]="isWideView ? 'col-md-6 col-sm-12' : 'col-12'">
					<mat-form-field>
						<mat-label>Street Address 2 <span class="optional-label">(optional)</span></mat-label>
						<input matInput formControlName="addressLine2" maxlength="100" />
					</mat-form-field>
				</div>
				<div class="col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>City</mat-label>
						<input matInput formControlName="city" maxlength="100" />
						<mat-error *ngIf="form.get('city')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
				<div class="col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Postal/Zip Code</mat-label>
						<input
							matInput
							formControlName="postalCode"
							oninput="this.value = this.value.toUpperCase()"
							maxlength="20"
						/>
						<mat-error *ngIf="form.get('postalCode')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
				<div class="col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Province/State</mat-label>
						<input matInput formControlName="province" maxlength="100" />
						<mat-error *ngIf="form.get('province')?.hasError('required')">This is required</mat-error>
						<mat-error *ngIf="form.get('province')?.hasError('requiredValue')"
							>This must be '{{ provinceOfBC }}' or '{{ provinceBritishColumbia }}'</mat-error
						>
					</mat-form-field>
				</div>
				<div class="col-md-6 col-sm-12">
					<mat-form-field>
						<mat-label>Country</mat-label>
						<input matInput formControlName="country" maxlength="100" />
						<mat-error *ngIf="form.get('country')?.hasError('required')">This is required</mat-error>
						<mat-error *ngIf="form.get('country')?.hasError('requiredValue')"
							>This must be '{{ countryCA }}' or '{{ countryCanada }}'</mat-error
						>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class FormAddressComponent implements OnInit {
	matcher = new FormErrorStateMatcher();

	provinceOfBC = SPD_CONSTANTS.address.provinceBC;
	provinceBritishColumbia = SPD_CONSTANTS.address.provinceBritishColumbia;
	countryCA = SPD_CONSTANTS.address.countryCA;
	countryCanada = SPD_CONSTANTS.address.countryCanada;

	@Input() form!: FormGroup;
	@Input() isWideView = false;
	@Input() isReadonly = false;

	ngOnInit(): void {
		if (this.isReadonly) {
			this.addressLine1.disable({ emitEvent: false });
			this.addressLine2.disable({ emitEvent: false });
			this.city.disable({ emitEvent: false });
			this.postalCode.disable({ emitEvent: false });
			this.province.disable({ emitEvent: false });
			this.country.disable({ emitEvent: false });
		} else {
			this.addressLine1.enable();
			this.addressLine2.enable();
			this.city.enable();
			this.postalCode.enable();
			this.province.enable();
			this.country.enable();
		}
	}

	get addressLine1(): FormControl {
		return this.form.get('addressLine1') as FormControl;
	}
	get addressLine2(): FormControl {
		return this.form.get('addressLine2') as FormControl;
	}
	get city(): FormControl {
		return this.form.get('city') as FormControl;
	}
	get postalCode(): FormControl {
		return this.form.get('postalCode') as FormControl;
	}
	get province(): FormControl {
		return this.form.get('province') as FormControl;
	}
	get country(): FormControl {
		return this.form.get('country') as FormControl;
	}
}
