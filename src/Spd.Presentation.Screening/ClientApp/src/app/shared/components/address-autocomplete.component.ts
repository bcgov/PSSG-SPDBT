import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import {
	Address,
	AddressAutocompleteFindResponse,
	AddressAutocompleteRetrieveResponse,
} from './address-autocomplete.model';

import { EMPTY } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'app-address-form-autocomplete',
	template: `
		<form [formGroup]="form">
			<div class="row">
				<div class="col-xl-9 col-lg-9 col-md-9 pb-2">
					<mat-form-field>
						<mat-label>Address Autocompleted by Canada Post</mat-label>
						<input matInput formControlName="autocomplete" type="search" [matAutocomplete]="auto" />
						<mat-autocomplete #auto="matAutocomplete">
							<mat-option
								*ngFor="let field of addressAutocompleteFields"
								[value]="field.text"
								(click)="onAutocomplete(field.id)"
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
	@Input() inBc: boolean;
	@Output() autocompleteAddress: EventEmitter<Address> = new EventEmitter<Address>();
	@Output() selectAddress: EventEmitter<boolean> = new EventEmitter<boolean>();

	form!: FormGroup;
	addressAutocompleteFields!: any[];

	data: any[] = [
		{
			id: '1',
			text: '100 Inverness Rd Victoria BC V8X 2S1',
			highlight: '',
			cursor: 1,
			description: '',
			next: '',
			line1: '100 Inverness Rd',
			line2: '',
			city: 'Victoria',
			provinceCode: 'BC',
			provinceName: 'British Columbia',
			postalCode: 'V8X 2H1',
			countryName: 'Canada',
			countryIso3: 'CAN',
			language: 'ENG',
		},
		{
			id: '2',
			text: '1006 Tolmie Ave Victoria BC V8X 2H1',
			highlight: '',
			cursor: 2,
			description: '',
			next: '',
			line1: '1006 Tolmie Ave',
			line2: '',
			city: 'Victoria',
			provinceCode: 'BC',
			provinceName: 'British Columbia',
			postalCode: 'V8X 2H1',
			countryName: 'Canada',
			countryIso3: 'CAN',
			language: 'ENG',
		},
		{
			id: '3',
			text: '1001 Cloverdale Ave Victoria BC V8X 4C9',
			highlight: '',
			cursor: 3,
			description: '',
			next: '',
			line1: '1001 Valewood Trail',
			line2: '',
			city: 'Victoria',
			provinceCode: 'BC',
			provinceName: 'British Columbia',
			postalCode: 'V8X 5G7',
			countryName: 'Canada',
			countryIso3: 'CAN',
			language: 'ENG',
		},
		{
			id: '4',
			text: '1004 Valewood Trail Victoria BC V8X 5G7',
			highlight: '',
			cursor: 4,
			description: '',
			next: '',
			line1: '1004 Valewood Trail',
			line2: '',
			city: 'Victoria',
			provinceCode: 'BC',
			provinceName: 'British Columbia',
			postalCode: 'V8X 5G7',
			countryName: 'Canada',
			countryIso3: 'CAN',
			language: 'ENG',
		},
		{
			id: '5',
			text: '1005 Valewood Trail Victoria BC V8X 5G7',
			highlight: '',
			cursor: 5,
			description: '',
			next: '',
			line1: '1005 Valewood Trail',
			line2: '',
			city: 'Victoria',
			provinceCode: 'BC',
			provinceName: 'British Columbia',
			postalCode: 'V8X 5G7',
			countryName: 'Canada',
			countryIso3: 'CAN',
			language: 'ENG',
		},
		{
			id: '6',
			text: '1008 Valewood Trail Victoria BC V8X 5G7',
			highlight: '',
			cursor: 6,
			description: '',
			next: '',
			line1: '1008 Valewood Trail',
			line2: '',
			city: 'Victoria',
			provinceCode: 'BC',
			provinceName: 'British Columbia',
			postalCode: 'V8X 5G7',
			countryName: 'Canada',
			countryIso3: 'CAN',
			language: 'ENG',
		},
		{
			id: '7',
			text: '200-4420 Chatterton Way Victoria BC V8X 5J2',
			highlight: '',
			cursor: 7,
			description: '',
			next: '',
			line1: '4420 Chatterton Way',
			line2: 'Suite 200',
			city: 'Victoria',
			provinceCode: 'BC',
			provinceName: 'British Columbia',
			postalCode: 'V8X 5J2',
			countryName: 'Canada',
			countryIso3: 'CAN',
			language: 'ENG',
		},
	];

	constructor(private fb: FormBuilder) {
		this.autocompleteAddress = new EventEmitter<Address>();
		this.inBc = false;
	}

	public ngOnInit(): void {
		this.form = this.fb.group({
			autocomplete: [''],
			country: new FormControl('CAN'),
		});

		this.autocomplete.valueChanges
			.pipe(
				debounceTime(400),
				switchMap((value: string) => {
					this.addressAutocompleteFields = [];
					return value ? this.find(value) : EMPTY;
				})
			)
			.subscribe((response: AddressAutocompleteFindResponse[]) => (this.addressAutocompleteFields = response));
	}

	public get autocomplete(): FormControl {
		return this.form.get('autocomplete') as FormControl;
	}

	public find(searchTerm: string): Observable<AddressAutocompleteFindResponse[]> {
		// return this.apiResource.get<AddressAutocompleteFindResponse[]>(`AddressAutocomplete/find?searchTerm=${searchTerm}`)
		//   .pipe(
		//     map((response: ApiHttpResponse<AddressAutocompleteFindResponse[]>) => response.result),
		//     tap((response: AddressAutocompleteFindResponse[]) => this.logger.info('AUTOCOMPLETE_FIND', response)),
		//     catchError((error: any) => {
		//       this.toastService.openErrorToast('Autocomplete could not be retrieved');
		//       this.logger.error('[Shared] AddressAutocompleteResource::find error has occurred: ', error);

		//       throw error;
		//     })
		//   );

		return of(
			this.data.filter((item) => {
				console.log(item, searchTerm);
				return item.text?.includes(searchTerm);
			})
		);
	}

	public retrieve(id: string): Observable<AddressAutocompleteRetrieveResponse[]> {
		// return this.apiResource.get<AddressAutocompleteRetrieveResponse[]>(`AddressAutocomplete/retrieve?id=${id}`)
		//   .pipe(
		//     map((response: ApiHttpResponse<AddressAutocompleteRetrieveResponse[]>) => response.result),
		//     tap((response: AddressAutocompleteRetrieveResponse[]) => this.logger.info('AUTOCOMPLETE_RETRIEVE', response)),
		//     catchError((error: any) => {
		//       this.toastService.openErrorToast('Autocomplete could not be retrieved');
		//       this.logger.error('[Shared] AddressAutocompleteResource::find error has occurred: ', error);

		//       throw error;
		//     })
		//   );

		const data = this.data.filter((item) => item.id == id);
		this.selectAddress.emit(true);
		return of(data);
	}

	public onAutocomplete(id: string) {
		this.retrieve(id).subscribe((results: AddressAutocompleteRetrieveResponse[]) => {
			const addressRetrieved = results.find((result) => result.language === 'ENG') ?? null;

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
				// !this.inBc || address.provinceCode === 'BC'
				// 	? this.autocompleteAddress.emit(address)
				// 	: this.toastService.openErrorToast('Address must be located in BC');
				// } else {
				// 	this.toastService.openErrorToast('Address could not be retrieved');
			}
		});
	}
}
