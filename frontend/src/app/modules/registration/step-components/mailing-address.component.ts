import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { RegistrationFormStepComponent } from '../registration.component';

export class MailingAddressModel {
	mailingAddressLine1: string = '';
	mailingAddressLine2: string = '';
	mailingCity: string = '';
	mailingPostalCode: string = '';
	mailingProvince: string = '';
	mailingCountry: string = '';
}

export interface AddressAutocompleteFindResponse {
	id: string;
	text: string;
	highlight: string;
	cursor: number;
	description: string;
	next: string;
}

export interface AddressAutocompleteRetrieveResponse {
	id: string;
	domesticId: string;
	language: string;
	languageAlternatives: string;
	department: string;
	company: string;
	subBuilding: string;
	buildingNumber: string;
	buildingName: string;
	secondaryStreet: string;
	street: string;
	block: string;
	neighbourhood: string;
	district: string;
	mailingCity: string;
	line1: string;
	line2: string;
	line3: string;
	line4: string;
	line5: string;
	adminAreaName: string;
	adminAreaCode: string;
	mailingProvince: string;
	provinceName: string;
	provinceCode: string;
	mailingPostalCode: string;
	countryName: string;
	countryIso2: string;
	countryIso3: string;
	countryIsoNumber: number;
	sortingNumber1: string;
	sortingNumber2: string;
	barcode: string;
	poBoxNumber: string;
	label: string;
	dataLevel: string;
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-mailing-address',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">What is your organization's mailing address?</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12 mb-4">
						<!-- <mat-form-field>
							<mat-label>Street Address 1</mat-label>
							<input matInput formControlName="mailingAddressLine1" />
							<mat-hint>
								Start with unit number and street number. Address autocompleted by
								<a href="https://www.canadapost.ca/pca" target="_blank">Canada Post</a>.
							</mat-hint>
						</mat-form-field> -->

						<mat-form-field>
							<mat-label>Street Address 1</mat-label>
							<input
								matInput
								formControlName="mailingAddressLine1"
								[matAutocomplete]="auto"
								[errorStateMatcher]="matcher"
							/>
							<mat-autocomplete #auto="matAutocomplete">
								<mat-option
									*ngFor="let field of addressAutocompleteFields"
									[value]="field.text"
									(click)="onAutocomplete(field.id)"
								>
									{{ field.text }} {{ field.description }}
								</mat-option>
							</mat-autocomplete>
							<mat-hint>
								Start with unit number and street number. Address autocompleted by
								<a href="https://www.canadapost.ca/pca" target="_blank">Canada Post</a>.
							</mat-hint>
							<mat-error *ngIf="form.get('mailingAddressLine1')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>

				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-form-field>
							<mat-label>Street Address 2</mat-label>
							<input matInput formControlName="mailingAddressLine2" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-6 col-sm-12">
						<mat-form-field>
							<mat-label>City</mat-label>
							<input matInput formControlName="mailingCity" maxlength="30" />
						</mat-form-field>
					</div>
					<div class="col-md-2 col-sm-12">
						<mat-form-field>
							<mat-label>Postal Code</mat-label>
							<input matInput formControlName="mailingPostalCode" />
						</mat-form-field>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Province</mat-label>
							<input matInput formControlName="mailingProvince" />
						</mat-form-field>
					</div>
					<div class="col-md-4 col-sm-12">
						<mat-form-field>
							<mat-label>Country</mat-label>
							<input matInput formControlName="mailingCountry" />
						</mat-form-field>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class MailingAddressComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;
	addressAutocompleteFields: AddressAutocompleteFindResponse[] = [];
	matcher = new FormErrorStateMatcher();

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			mailingAddressLine1: new FormControl('', [Validators.required]),
			mailingAddressLine2: new FormControl(''),
			mailingCity: new FormControl(''),
			mailingPostalCode: new FormControl(''),
			mailingProvince: new FormControl(''),
			mailingCountry: new FormControl(''),
		});

		// this.autocomplete.valueChanges
		//   .pipe(
		//     debounceTime(400),
		//     switchMap((value: string) => {
		//       this.addressAutocompleteFields = [];
		//       return (value)
		//         ? this.addressAutocompleteResource.find(value)
		//         : EMPTY;
		//     })
		//   )
		//   .subscribe((response: AddressAutocompleteFindResponse[]) =>
		//     this.addressAutocompleteFields = response
		//   );
	}

	public onAutocomplete(id: string) {
		// this.addressAutocompleteResource.retrieve(id)
		//   .subscribe((results: AddressAutocompleteRetrieveResponse[]) => {
		//     const addressRetrieved = results.find(result => result.language === 'ENG') ?? null;
		//     if (addressRetrieved) {
		//       const address = new Address(
		//         addressRetrieved.countryIso2,
		//         addressRetrieved.provinceCode,
		//         addressRetrieved.line1,
		//         addressRetrieved.line2,
		//         addressRetrieved.mailingCity,
		//         addressRetrieved.mailingPostalCode
		//       );
		//       (!this.inBc || address.provinceCode === 'BC')
		//         ? this.autocompleteAddress.emit(address)
		//         : this.toastService.openErrorToast('Address must be located in BC');
		//     } else {
		//       this.toastService.openErrorToast('Address could not be retrieved');
		//     }
		//   });
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}

	get autocomplete(): FormControl {
		return this.form.get('mailingAddressLine1') as FormControl;
	}
}
