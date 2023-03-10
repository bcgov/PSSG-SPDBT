import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { EMPTY } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AddressFindResponse, AddressRetrieveResponse } from 'src/app/api/models';
import { AddressAutoCompleteService } from 'src/app/api/services';

export class Address {
	id?: string;
	line1: string;
	line2?: string | null = null;
	city: string;
	provinceCode: string;
	countryCode: string;
	postalCode: string;

	constructor(
		countryCode: string,
		provinceCode: string,
		line1: string,
		line2: string | null,
		city: string,
		postalCode: string,
		id: string
	) {
		this.line1 = line1;
		this.line2 = line2;
		this.city = city;
		this.provinceCode = provinceCode;
		this.countryCode = countryCode;
		this.postalCode = postalCode;
		this.id = id;
	}
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-address-form-autocomplete',
	template: `
		<form [formGroup]="form">
			<div class="row">
				<div class="col-xl-9 col-lg-9 col-md-9 pb-2">
					<mat-form-field>
						<mat-label>Address Autocompleted by Canada Post</mat-label>
						<input
							matInput
							formControlName="addressComplete"
							type="search"
							(keyup.enter)="onSearchEnter($event)"
							[matAutocomplete]="auto"
						/>
						<!--  [displayWith]="displayFn"
					 (optionSelected)="onChange($event)"
					 -->
						<mat-autocomplete #auto="matAutocomplete">
							<mat-option
								*ngFor="let field of addressAutocompleteFields"
								[value]="field.text"
								(click)="onAutocomplete(field)"
							>
								{{ field.text }} {{ field.description }}
							</mat-option>
						</mat-autocomplete>
						<mat-icon matSuffix>search</mat-icon>
						<mat-hint> Start with unit number and street number. </mat-hint>
					</mat-form-field>
				</div>

				<div class="col-xl-3 col-lg-3 col-md-3 pb-2">
					<mat-form-field>
						<mat-label>Country</mat-label>
						<mat-select formControlName="country">
							<mat-option value="CAN">Canada</mat-option>
							<mat-option value="USA">United States</mat-option>
							<!-- <mat-option *ngFor="let topping of toppingList" [value]="topping">{{topping}}</mat-option> -->
						</mat-select>
					</mat-form-field>
				</div>
				<div class="col-12">
					<ng-content></ng-content>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class AddressAutocompleteComponent implements OnInit {
	@Output() autocompleteAddress: EventEmitter<Address> = new EventEmitter<Address>();

	form!: FormGroup;
	addressAutocompleteFields!: AddressFindResponse[];
	data: AddressRetrieveResponse[] = [];

	constructor(private formBuilder: FormBuilder, private addressAutoCompleteService: AddressAutoCompleteService) {
		this.autocompleteAddress = new EventEmitter<Address>();
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			addressComplete: [null],
			country: new FormControl('CAN'),
		});

		this.addressComplete.valueChanges
			.pipe(
				debounceTime(400),
				switchMap((value: string) => {
					this.addressAutocompleteFields = [];
					return value ? this.find(value) : EMPTY;
				})
			)
			.subscribe((response: AddressFindResponse[]) => (this.addressAutocompleteFields = response));
	}

	// public displayFn(addr: any) {
	// 	console.log('displayFn', addr);
	// 	if (addr) {
	// 		return addr.text as string;
	// 	}
	// 	return '';
	// }

	onChange($event: any) {
		console.log('onChange', $event);
	}
	public async onSearchEnter($event: any) {
		console.log('onSearchEnter', this.form.getRawValue());
		// console.log('onSearchEnter', this.addressAutocompleteFields);
		// const selectedAddress = this.addressComplete.value as AddressRetrieveResponse;
		// this.onAutocomplete(selectedAddress.id as string);
	}

	public get addressComplete(): FormControl {
		return this.form.get('addressComplete') as FormControl;
	}

	public get country(): FormControl {
		return this.form.get('country') as FormControl;
	}

	public find(searchTerm: string): Observable<AddressFindResponse[]> {
		return this.addressAutoCompleteService
			.apiMetadataAddressGet({
				search: searchTerm,
				country: this.country.value,
			})
			.pipe();
	}

	public onAutocomplete(field: AddressFindResponse) {
		//} id: string) {
		console.log('1onAutocomplete', field);
		// if (field.next == 'Find') {
		// 	this.addressAutocompleteFields = [];
		// 	this.find(field.text!)
		// 		.pipe()
		// 		.subscribe((response: AddressFindResponse[]) => {
		// 			console.log('response', response);
		// 			this.addressAutocompleteFields = response;
		// 		});
		// } else {
		this.addressAutoCompleteService
			.apiMetadataAddressIdGet({ id: field.id! })
			.pipe()
			.subscribe((results: AddressRetrieveResponse[]) => {
				console.log('results', results);
				const addressRetrieved = results.find((result) => result.language == 'ENG') ?? null;

				if (addressRetrieved) {
					const address = new Address(
						addressRetrieved.countryName!,
						addressRetrieved.provinceName!,
						addressRetrieved.line1!,
						addressRetrieved.line2!,
						addressRetrieved.city!,
						addressRetrieved.postalCode!,
						addressRetrieved.id!
					);
					this.autocompleteAddress.emit(address);
				}
			});
		// }
	}
}
