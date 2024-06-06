import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';

import { AddressFindResponse, AddressRetrieveResponse } from '@app/api/models';
import { EMPTY } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AddressAutoCompleteService } from 'src/app/api/services';
import { CountryTypes } from 'src/app/core/code-types/model-desc.models';
import { AddressDialogData, ModalAddressComponent } from './modal-address.component';

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
				<div [ngClass]="isWizardStep ? 'col-xl-7 col-lg-12 col-md-12' : 'col-12'">
					<mat-form-field>
						<mat-label>Address by Canada Post</mat-label>
						<input matInput formControlName="addressComplete" type="search" [matAutocomplete]="auto" />
						<mat-autocomplete #auto="matAutocomplete">
							<mat-option
								class="address-option"
								*ngFor="let field of addressAutocompleteFields; let i = index"
								[value]="field.text"
								(click)="onAutocomplete(field)"
							>
								{{ field.text }} {{ field.description }}
							</mat-option>
						</mat-autocomplete>
						<mat-icon style="padding: 16px 8px 0 0;" matSuffix>search</mat-icon>
						<mat-hint> Start typing a street address or postal code </mat-hint>
					</mat-form-field>

					<button
						mat-button
						type="button"
						color="primary"
						class="w-auto mt-2 mt-md-0"
						[disabled]="showAddressFields"
						(click)="onShowManualAddress()"
					>
						<mat-icon>add</mat-icon>
						Add address manually
					</button>
				</div>

				<div [ngClass]="isWizardStep ? 'col-xl-5 col-lg-5 col-md-12' : 'col-12'">
					<mat-form-field>
						<mat-label>Country</mat-label>
						<mat-select formControlName="country">
							<mat-option *ngFor="let ctry of countryList; let i = index" [value]="ctry.code">
								<span [ngClass]="{ 'text-option fw-semibold': ctry.code === 'CAN' || ctry.code === 'USA' }">{{
									ctry.desc
								}}</span>
							</mat-option>
						</mat-select>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.text-option {
				color: var(--color-primary-light);
			}

			.address-option {
				padding-bottom: 12px;
			}
		`,
	],
})
export class AddressAutocompleteComponent implements OnInit {
	@Output() autocompleteAddress: EventEmitter<Address> = new EventEmitter<Address>();
	@Output() enterAddressManually: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() isWizardStep = true;

	form!: FormGroup;
	addressAutocompleteFields!: AddressFindResponse[];
	data: AddressRetrieveResponse[] = [];
	lastId = '';
	countryList = CountryTypes;
	showAddressFields = false;

	constructor(
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private addressAutoCompleteService: AddressAutoCompleteService
	) {
		this.autocompleteAddress = new EventEmitter<Address>();
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			addressComplete: [null],
			country: new FormControl('CAN'),
		});

		let lastIdExists = false;

		this.addressComplete.valueChanges
			.pipe(
				debounceTime(400),
				switchMap((value: string) => {
					this.addressAutocompleteFields = [];

					lastIdExists = this.lastId ? true : false;

					// reset this value so that this lastId isn't used again
					const lastId = this.lastId;
					this.lastId = '';

					if (!value || value.trim().length == 0) return EMPTY;

					return value ? this.find(value, lastId) : EMPTY;
				})
			)
			.subscribe((response: AddressFindResponse[]) => {
				if (lastIdExists) {
					const dialogOptions: AddressDialogData = {
						addressAutocompleteFields: response,
					};

					this.addressDialog(dialogOptions);
					lastIdExists = false;
				} else {
					this.addressAutocompleteFields = response;
				}
			});
	}

	public onClearData(): void {
		this.form.reset();
	}

	private addressDialog(dialogOptions: AddressDialogData): void {
		this.dialog
			.open(ModalAddressComponent, {
				width: '600px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((res) => {
				if (res) {
					this.onAutocomplete(res.data);

					if (this.lastId) {
						const lastId = this.lastId;
						this.lastId = '';

						this.find(res.data.text, lastId)
							.pipe()
							.subscribe((addrResp) => {
								const dialogOptions: AddressDialogData = {
									addressAutocompleteFields: addrResp,
								};

								this.addressDialog(dialogOptions);
							});
					}
				}
			});
	}

	public get addressComplete(): FormControl {
		return this.form.get('addressComplete') as FormControl;
	}

	public get country(): FormControl {
		return this.form.get('country') as FormControl;
	}

	public find(searchTerm: string, lastId: string | undefined = undefined): Observable<AddressFindResponse[]> {
		if (!searchTerm || searchTerm.trim().length == 0) return of([]);

		return this.addressAutoCompleteService
			.apiMetadataAddressGet({
				search: searchTerm,
				country: this.country.value,
				lastId,
			})
			.pipe();
	}

	public onAutocomplete(field: AddressFindResponse) {
		if (field.next == 'Find') {
			this.lastId = field.id!;

			// remove any current address
			this.autocompleteAddress.emit(undefined);
		} else {
			// next == 'Retrieve'
			this.lastId = '';
			this.addressAutoCompleteService
				.apiMetadataAddressIdGet({ id: field.id! })
				.pipe()
				.subscribe((results: AddressRetrieveResponse[]) => {
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
		}
	}

	public onShowManualAddress(): void {
		this.showAddressFields = true;
		this.enterAddressManually.emit(true);
	}
}
