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
				<div class="col-xl-7 col-lg-7 col-md-12 pb-2">
					<mat-form-field>
						<mat-label>Address Autocompleted by Canada Post</mat-label>
						<input
							matInput
							formControlName="addressComplete"
							type="search"
							(keyup.enter)="onSearchEnter($event)"
							[matAutocomplete]="auto"
						/>
						<mat-autocomplete #auto="matAutocomplete">
							<mat-option
								*ngFor="let field of addressAutocompleteFields"
								[value]="field.text"
								(click)="onAutocomplete(field)"
							>
								{{ field.text }} {{ field.description }}
								<span *ngIf="field.next == 'Find'">
									<mat-icon
										matTooltip="This option will return a list of addresses"
										style="color: var(--color-green);position: relative;top: 6px;"
									>
										filter_list
									</mat-icon>
								</span>
							</mat-option>
						</mat-autocomplete>
						<mat-icon matSuffix>search</mat-icon>
						<mat-hint> Start with unit number and street number. </mat-hint>
					</mat-form-field>
				</div>

				<div class="col-xl-5 col-lg-5 col-md-12 pb-2">
					<mat-form-field>
						<mat-label>Country</mat-label>
						<mat-select formControlName="country">
							<!-- <mat-option value="CAN">Canada</mat-option>
							<mat-option value="USA">United States</mat-option> -->
							<mat-option *ngFor="let ctry of countryList" [value]="ctry.code">
								<span [ngClass]="{ 'text-option fw-semibold': ctry.code == 'CAN' || ctry.code == 'USA' }">{{
									ctry.desc
								}}</span>
							</mat-option>
						</mat-select>
					</mat-form-field>
				</div>
				<div class="col-12">
					<ng-content></ng-content>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.text-option {
				color: var(--color-primary-light);
			}
		`,
	],
})
export class AddressAutocompleteComponent implements OnInit {
	@Output() autocompleteAddress: EventEmitter<Address> = new EventEmitter<Address>();

	form!: FormGroup;
	addressAutocompleteFields!: AddressFindResponse[];
	data: AddressRetrieveResponse[] = [];
	lastId = '';

	countryList = [
		{ desc: 'Canada', code: 'CAN' },
		{ desc: 'United States of America', code: 'USA' },
		{ desc: 'Afghanistan', code: 'AFG' },
		{ desc: 'Åland Islands', code: 'ALA' },
		{ desc: 'Albania', code: 'ALB' },
		{ desc: 'Algeria', code: 'DZA' },
		{ desc: 'American Samoa', code: 'ASM' },
		{ desc: 'Andorra', code: 'AND' },
		{ desc: 'Angola', code: 'AGO' },
		{ desc: 'Anguilla', code: 'AIA' },
		{ desc: 'Antarctica', code: 'ATA' },
		{ desc: 'Antigua and Barbuda', code: 'ATG' },
		{ desc: 'Argentina', code: 'ARG' },
		{ desc: 'Armenia', code: 'ARM' },
		{ desc: 'Aruba', code: 'ABW' },
		{ desc: 'Australia', code: 'AUS' },
		{ desc: 'Austria', code: 'AUT' },
		{ desc: 'Azerbaijan', code: 'AZE' },
		{ desc: 'Bahamas (the)', code: 'BHS' },
		{ desc: 'Bahrain', code: 'BHR' },
		{ desc: 'Bangladesh', code: 'BGD' },
		{ desc: 'Barbados', code: 'BRB' },
		{ desc: 'Belarus', code: 'BLR' },
		{ desc: 'Belgium', code: 'BEL' },
		{ desc: 'Belize', code: 'BLZ' },
		{ desc: 'Benin', code: 'BEN' },
		{ desc: 'Bermuda', code: 'BMU' },
		{ desc: 'Bhutan', code: 'BTN' },
		{ desc: 'Bolivia (Plurinational State of)', code: 'BOL' },
		{ desc: 'Bonaire, Sint Eustatius and Saba', code: 'BES' },
		{ desc: 'Bosnia and Herzegovina', code: 'BIH' },
		{ desc: 'Botswana', code: 'BWA' },
		{ desc: 'Bouvet Island', code: 'BVT' },
		{ desc: 'Brazil', code: 'BRA' },
		{ desc: 'British Indian Ocean Territory (the)', code: 'IOT' },
		{ desc: 'Brunei Darussalam', code: 'BRN' },
		{ desc: 'Bulgaria', code: 'BGR' },
		{ desc: 'Burkina Faso', code: 'BFA' },
		{ desc: 'Burundi', code: 'BDI' },
		{ desc: 'Cabo Verde', code: 'CPV' },
		{ desc: 'Cambodia', code: 'KHM' },
		{ desc: 'Cameroon', code: 'CMR' },
		{ desc: 'Cayman Islands (the)', code: 'CYM' },
		{ desc: 'Central African Republic (the)', code: 'CAF' },
		{ desc: 'Chad', code: 'TCD' },
		{ desc: 'Chile', code: 'CHL' },
		{ desc: 'China', code: 'CHN' },
		{ desc: 'Christmas Island', code: 'CXR' },
		{ desc: 'Cocos (Keeling) Islands (the)', code: 'CCK' },
		{ desc: 'Colombia', code: 'COL' },
		{ desc: 'Comoros (the)', code: 'COM' },
		{ desc: 'Congo (the Democratic Republic of the)', code: 'COD' },
		{ desc: 'Congo (the)', code: 'COG' },
		{ desc: 'Cook Islands (the)', code: 'COK' },
		{ desc: 'Costa Rica', code: 'CRI' },
		{ desc: "Côte d'Ivoire", code: 'CIV' },
		{ desc: 'Croatia', code: 'HRV' },
		{ desc: 'Cuba', code: 'CUB' },
		{ desc: 'Curaçao', code: 'CUW' },
		{ desc: 'Cyprus', code: 'CYP' },
		{ desc: 'Czechia', code: 'CZE' },
		{ desc: 'Denmark', code: 'DNK' },
		{ desc: 'Djibouti', code: 'DJI' },
		{ desc: 'Dominica', code: 'DMA' },
		{ desc: 'Dominican Republic (the)', code: 'DOM' },
		{ desc: 'Ecuador', code: 'ECU' },
		{ desc: 'Egypt', code: 'EGY' },
		{ desc: 'El Salvador', code: 'SLV' },
		{ desc: 'Equatorial Guinea', code: 'GNQ' },
		{ desc: 'Eritrea', code: 'ERI' },
		{ desc: 'Estonia', code: 'EST' },
		{ desc: 'Eswatini', code: 'SWZ' },
		{ desc: 'Ethiopia', code: 'ETH' },
		{ desc: 'Falkland Islands (the) [Malvinas]', code: 'FLK' },
		{ desc: 'Faroe Islands (the)', code: 'FRO' },
		{ desc: 'Fiji', code: 'FJI' },
		{ desc: 'Finland', code: 'FIN' },
		{ desc: 'France', code: 'FRA' },
		{ desc: 'French Guiana', code: 'GUF' },
		{ desc: 'French Polynesia', code: 'PYF' },
		{ desc: 'French Southern Territories (the)', code: 'ATF' },
		{ desc: 'Gabon', code: 'GAB' },
		{ desc: 'Gambia (the)', code: 'GMB' },
		{ desc: 'Georgia', code: 'GEO' },
		{ desc: 'Germany', code: 'DEU' },
		{ desc: 'Ghana', code: 'GHA' },
		{ desc: 'Gibraltar', code: 'GIB' },
		{ desc: 'Greece', code: 'GRC' },
		{ desc: 'Greenland', code: 'GRL' },
		{ desc: 'Grenada', code: 'GRD' },
		{ desc: 'Guadeloupe', code: 'GLP' },
		{ desc: 'Guam', code: 'GUM' },
		{ desc: 'Guatemala', code: 'GTM' },
		{ desc: 'Guernsey', code: 'GGY' },
		{ desc: 'Guinea', code: 'GIN' },
		{ desc: 'Guinea-Bissau', code: 'GNB' },
		{ desc: 'Guyana', code: 'GUY' },
		{ desc: 'Haiti', code: 'HTI' },
		{ desc: 'Heard Island and McDonald Islands', code: 'HMD' },
		{ desc: 'Holy See (the)', code: 'VAT' },
		{ desc: 'Honduras', code: 'HND' },
		{ desc: 'Hong Kong', code: 'HKG' },
		{ desc: 'Hungary', code: 'HUN' },
		{ desc: 'Iceland', code: 'ISL' },
		{ desc: 'India', code: 'IND' },
		{ desc: 'Indonesia', code: 'IDN' },
		{ desc: 'Iran (Islamic Republic of)', code: 'IRN' },
		{ desc: 'Iraq', code: 'IRQ' },
		{ desc: 'Ireland', code: 'IRL' },
		{ desc: 'Isle of Man', code: 'IMN' },
		{ desc: 'Israel', code: 'ISR' },
		{ desc: 'Italy', code: 'ITA' },
		{ desc: 'Jamaica', code: 'JAM' },
		{ desc: 'Japan', code: 'JPN' },
		{ desc: 'Jersey', code: 'JEY' },
		{ desc: 'Jordan', code: 'JOR' },
		{ desc: 'Kazakhstan', code: 'KAZ' },
		{ desc: 'Kenya', code: 'KEN' },
		{ desc: 'Kiribati', code: 'KIR' },
		{ desc: "Korea (the Democratic People's Republic of)", code: 'PRK' },
		{ desc: 'Korea (the Republic of)', code: 'KOR' },
		{ desc: 'Kuwait', code: 'KWT' },
		{ desc: 'Kyrgyzstan', code: 'KGZ' },
		{ desc: "Lao People's Democratic Republic (the)", code: 'LAO' },
		{ desc: 'Latvia', code: 'LVA' },
		{ desc: 'Lebanon', code: 'LBN' },
		{ desc: 'Lesotho', code: 'LSO' },
		{ desc: 'Liberia', code: 'LBR' },
		{ desc: 'Libya', code: 'LBY' },
		{ desc: 'Liechtenstein', code: 'LIE' },
		{ desc: 'Lithuania', code: 'LTU' },
		{ desc: 'Luxembourg', code: 'LUX' },
		{ desc: 'Macao', code: 'MAC' },
		{ desc: 'Madagascar', code: 'MDG' },
		{ desc: 'Malawi', code: 'MWI' },
		{ desc: 'Malaysia', code: 'MYS' },
		{ desc: 'Maldives', code: 'MDV' },
		{ desc: 'Mali', code: 'MLI' },
		{ desc: 'Malta', code: 'MLT' },
		{ desc: 'Marshall Islands (the)', code: 'MHL' },
		{ desc: 'Martinique', code: 'MTQ' },
		{ desc: 'Mauritania', code: 'MRT' },
		{ desc: 'Mauritius', code: 'MUS' },
		{ desc: 'Mayotte', code: 'MYT' },
		{ desc: 'Mexico', code: 'MEX' },
		{ desc: 'Micronesia (Federated States of)', code: 'FSM' },
		{ desc: 'Moldova (the Republic of)', code: 'MDA' },
		{ desc: 'Monaco', code: 'MCO' },
		{ desc: 'Mongolia', code: 'MNG' },
		{ desc: 'Montenegro', code: 'MNE' },
		{ desc: 'Montserrat', code: 'MSR' },
		{ desc: 'Morocco', code: 'MAR' },
		{ desc: 'Mozambique', code: 'MOZ' },
		{ desc: 'Myanmar', code: 'MMR' },
		{ desc: 'Namibia', code: 'NAM' },
		{ desc: 'Nauru', code: 'NRU' },
		{ desc: 'Nepal', code: 'NPL' },
		{ desc: 'Netherlands (the)', code: 'NLD' },
		{ desc: 'New Caledonia', code: 'NCL' },
		{ desc: 'New Zealand', code: 'NZL' },
		{ desc: 'Nicaragua', code: 'NIC' },
		{ desc: 'Niger (the)', code: 'NER' },
		{ desc: 'Nigeria', code: 'NGA' },
		{ desc: 'Niue', code: 'NIU' },
		{ desc: 'Norfolk Island', code: 'NFK' },
		{ desc: 'North Macedonia', code: 'MKD' },
		{ desc: 'Northern Mariana Islands (the)', code: 'MNP' },
		{ desc: 'Norway', code: 'NOR' },
		{ desc: 'Oman', code: 'OMN' },
		{ desc: 'Pakistan', code: 'PAK' },
		{ desc: 'Palau', code: 'PLW' },
		{ desc: 'Palestine, State of', code: 'PSE' },
		{ desc: 'Panama', code: 'PAN' },
		{ desc: 'Papua New Guinea', code: 'PNG' },
		{ desc: 'Paraguay', code: 'PRY' },
		{ desc: 'Peru', code: 'PER' },
		{ desc: 'Philippines (the)', code: 'PHL' },
		{ desc: 'Pitcairn', code: 'PCN' },
		{ desc: 'Poland', code: 'POL' },
		{ desc: 'Portugal', code: 'PRT' },
		{ desc: 'Puerto Rico', code: 'PRI' },
		{ desc: 'Qatar', code: 'QAT' },
		{ desc: 'Réunion', code: 'REU' },
		{ desc: 'Romania', code: 'ROU' },
		{ desc: 'Russian Federation (the)', code: 'RUS' },
		{ desc: 'Rwanda', code: 'RWA' },
		{ desc: 'Saint Barthélemy', code: 'BLM' },
		{ desc: 'Saint Helena, Ascension and Tristan da Cunha', code: 'SHN' },
		{ desc: 'Saint Kitts and Nevis', code: 'KNA' },
		{ desc: 'Saint Lucia', code: 'LCA' },
		{ desc: 'Saint Martin (French part)', code: 'MAF' },
		{ desc: 'Saint Pierre and Miquelon', code: 'SPM' },
		{ desc: 'Saint Vincent and the Grenadines', code: 'VCT' },
		{ desc: 'Samoa', code: 'WSM' },
		{ desc: 'San Marino', code: 'SMR' },
		{ desc: 'Sao Tome and Principe', code: 'STP' },
		{ desc: 'Saudi Arabia', code: 'SAU' },
		{ desc: 'Senegal', code: 'SEN' },
		{ desc: 'Serbia', code: 'SRB' },
		{ desc: 'Seychelles', code: 'SYC' },
		{ desc: 'Sierra Leone', code: 'SLE' },
		{ desc: 'Singapore', code: 'SGP' },
		{ desc: 'Sint Maarten (Dutch part)', code: 'SXM' },
		{ desc: 'Slovakia', code: 'SVK' },
		{ desc: 'Slovenia', code: 'SVN' },
		{ desc: 'Solomon Islands', code: 'SLB' },
		{ desc: 'Somalia', code: 'SOM' },
		{ desc: 'South Africa', code: 'ZAF' },
		{ desc: 'South Georgia and the South Sandwich Islands', code: 'SGS' },
		{ desc: 'South Sudan', code: 'SSD' },
		{ desc: 'Spain', code: 'ESP' },
		{ desc: 'Sri Lanka', code: 'LKA' },
		{ desc: 'Sudan (the)', code: 'SDN' },
		{ desc: 'Suriname', code: 'SUR' },
		{ desc: 'Svalbard and Jan Mayen', code: 'SJM' },
		{ desc: 'Sweden', code: 'SWE' },
		{ desc: 'Switzerland', code: 'CHE' },
		{ desc: 'Syrian Arab Republic (the)', code: 'SYR' },
		{ desc: 'Taiwan (Province of China)', code: 'TWN' },
		{ desc: 'Tajikistan', code: 'TJK' },
		{ desc: 'Tanzania, the United Republic of', code: 'TZA' },
		{ desc: 'Thailand', code: 'THA' },
		{ desc: 'Timor-Leste', code: 'TLS' },
		{ desc: 'Togo', code: 'TGO' },
		{ desc: 'Tokelau', code: 'TKL' },
		{ desc: 'Tonga', code: 'TON' },
		{ desc: 'Trinidad and Tobago', code: 'TTO' },
		{ desc: 'Tunisia', code: 'TUN' },
		{ desc: 'Türkiye', code: 'TUR' },
		{ desc: 'Turkmenistan', code: 'TKM' },
		{ desc: 'Turks and Caicos Islands (the)', code: 'TCA' },
		{ desc: 'Tuvalu', code: 'TUV' },
		{ desc: 'Uganda', code: 'UGA' },
		{ desc: 'Ukraine', code: 'UKR' },
		{ desc: 'United Arab Emirates (the)', code: 'ARE' },
		{ desc: 'United Kingdom of Great Britain and Northern Ireland (the)', code: 'GBR' },
		{ desc: 'United States Minor Outlying Islands (the)', code: 'UMI' },
		{ desc: 'Uruguay', code: 'URY' },
		{ desc: 'Uzbekistan', code: 'UZB' },
		{ desc: 'Vanuatu', code: 'VUT' },
		{ desc: 'Venezuela (Bolivarian Republic of)', code: 'VEN' },
		{ desc: 'Viet Nam', code: 'VNM' },
		{ desc: 'Virgin Islands (British)', code: 'VGB' },
		{ desc: 'Virgin Islands (U.S.)', code: 'VIR' },
		{ desc: 'Wallis and Futuna', code: 'WLF' },
		{ desc: 'Western Sahara*', code: 'ESH' },
		{ desc: 'Yemen', code: 'YEM' },
		{ desc: 'Zambia', code: 'ZMB' },
		{ desc: 'Zimbabwe', code: 'ZWE' },
	];

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

					// reset this value so that this lastId isn't used again
					const lastId = this.lastId;
					this.lastId = '';

					return value ? this.find(value, lastId) : EMPTY;
				})
			)
			.subscribe((response: AddressFindResponse[]) => {
				this.addressAutocompleteFields = response;
			});
	}

	public async onSearchEnter($event: any) {
		const found = this.addressAutocompleteFields.find((item) => item.text == this.addressComplete.value);
		if (found) {
			this.onAutocomplete(found);
		}
	}

	public get addressComplete(): FormControl {
		return this.form.get('addressComplete') as FormControl;
	}

	public get country(): FormControl {
		return this.form.get('country') as FormControl;
	}

	public find(searchTerm: string, lastId: string | undefined = undefined): Observable<AddressFindResponse[]> {
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
}
