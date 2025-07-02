import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceBasicResponse, LicenceStatusCode, WorkerCategoryTypeCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-swl',
	template: `
		<section class="step-section">
		  <div class="row">
		    <div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
		      <div class="row">
		        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
		          <h2 class="fs-3">Verify a Security Worker Licence</h2>
		        </div>
		
		        <div class="col-xl-4 col-lg-4 col-md-12 no-print">
		          <div class="d-flex justify-content-end">
		            <button
		              mat-stroked-button
		              color="primary"
		              class="large w-auto mb-3"
		              aria-label="Back to main page"
		              (click)="onBack()"
		              >
		              <mat-icon>arrow_back</mat-icon>Back
		            </button>
		          </div>
		        </div>
		
		        <mat-divider class="mat-divider-main mb-4"></mat-divider>
		
		        <div class="col-12 mb-3">
		          <app-alert type="info" icon="">
		            Enter a security worker <strong>licence number</strong>, or the <strong>full name</strong> as it appears
		            on the licence, below. Press 'Submit' and the results will confirm if the licence number is valid and
		            the name of the licensee.
		          </app-alert>
		        </div>
		      </div>
		
		      <form [formGroup]="form" novalidate>
		        <div class="row mb-2">
		          <div class="col-xl-4 col-lg-5 col-md-12">
		            <mat-form-field>
		              <mat-label>Worker Licence Number</mat-label>
		              <input
		                matInput
		                formControlName="workerLicenceNumber"
		                oninput="this.value = this.value.toUpperCase()"
		                placeholder="E123456"
		                [errorStateMatcher]="matcher"
		                maxlength="20"
		                />
		              </mat-form-field>
		            </div>
		
		            <div class="col-xl-1 col-lg-1 col-md-12 text-center">
		              <div class="text-minor-heading text-red my-3">OR</div>
		            </div>
		
		            <div class="col-xl-7 col-lg-6 col-md-12">
		              <div class="row">
		                @if (!isOneNameOnly.value) {
		                  <div class="col-xl-6 col-lg-12 col-md-12">
		                    <mat-form-field>
		                      <mat-label>First Name</mat-label>
		                      <input matInput formControlName="firstName" [errorStateMatcher]="matcher" maxlength="40" />
		                    </mat-form-field>
		                  </div>
		                }
		
		                <div class="col-xl-6 col-lg-12 col-md-12">
		                  <mat-form-field>
		                    <mat-label>{{ lastNameLabel }}</mat-label>
		                    <input matInput formControlName="lastName" [errorStateMatcher]="matcher" maxlength="40" />
		                  </mat-form-field>
		                </div>
		
		                <div class="col-xl-6 col-lg-12 col-md-12">
		                  <mat-checkbox formControlName="isOneNameOnly" (click)="onCheckboxChange()"
		                    >Licence holder has surname only</mat-checkbox
		                    >
		                  </div>
		                </div>
		              </div>
		            </div>
		
		            @if (showSearchDataError) {
		              <app-alert type="danger" icon="dangerous"> {{ searchDataError }} </app-alert>
		            }
		
		            <div class="row no-print my-2">
		              <div class="col-12 text-end">
		                <button mat-flat-button color="primary" class="large w-auto" (click)="onSubmit()">Submit</button>
		              </div>
		            </div>
		          </form>
		
		          @if (showSearchResults) {
		            @if (searchResults.length > 0) {
		              <div class="mb-3">
		                <mat-divider class="my-3"></mat-divider>
		                <div class="text-minor-heading my-3">Search Results</div>
		                @for (licence of searchResults; track licence; let i = $index) {
		                  <div
		                    class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
		                    >
		                    <div class="row">
		                      <div class="col-xl-2 col-lg-2">
		                        <div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
		                        <div class="text-minor-heading">
		                          {{ licence.licenceNumber }}
		                        </div>
		                      </div>
		                      <div class="col-xl-8 col-lg-8">
		                        <div class="row">
		                          <div class="col-xl-6 col-lg-6">
		                            <div class="d-block text-muted mt-2 mt-lg-0">Licence Holder Name</div>
		                            <div class="text-data fw-bold">{{ licence.licenceHolderName }}</div>
		                          </div>
		                          <div class="col-xl-6 col-lg-6">
		                            <div class="d-block text-muted mt-2 mt-lg-0">Licence Type(s)</div>
		                            <div class="text-data fw-bold">
		                              <ul class="m-0">
		                                @for (category of getSwlLicenceCategories(licence); track category; let i = $index) {
		                                  <li>{{ category }}</li>
		                                }
		                              </ul>
		                            </div>
		                          </div>
		                          @if (!isLicenceActive(licence.licenceStatusCode)) {
		                            <div class="mt-3">
		                              <app-alert type="warning" icon="warn">
		                                <strong>{{ licence.licenceNumber }} - {{ licence.licenceHolderName }}</strong> does not hold a
		                                valid licence. If you believe they are working in security in B.C., please consider submitting
		                                a
		                                <a aria-label="Navigate to SPD complaint site" [href]="spdComplaintUrl" target="_blank"
		                                  >complaint</a
		                                  >.
		                                </app-alert>
		                              </div>
		                            }
		                          </div>
		                        </div>
		                        <div class="col-xl-2 col-lg-2 text-end">
		                          <mat-chip-option
		                            [selectable]="false"
		                            class="appl-chip-option"
		                            [ngClass]="getLicenceStatusClass(licence.licenceStatusCode)"
		                            >
		                            <span class="appl-chip-option-item mx-2 fs-5">
		                              {{ getLicenceStatus(licence.licenceStatusCode) | default }}
		                            </span>
		                          </mat-chip-option>
		                        </div>
		                      </div>
		                    </div>
		                  }
		                </div>
		              } @else {
		                <div class="mt-3">
		                  @if (isWorkerLicenceNumberSearchError) {
		                    <app-alert type="danger" icon="dangerous">No results match your search.</app-alert>
		                  } @else {
		                    <app-alert type="danger" icon="dangerous">
		                      <strong>{{ searchResultsErrorName }}</strong> does not hold a valid licence. If you believe they are
		                      working in security in B.C., please consider submitting a
		                      <a aria-label="Navigate to SPD complaint site" [href]="spdComplaintUrl" target="_blank">complaint</a
		                        >.
		                      </app-alert>
		                    }
		                  </div>
		                }
		              }
		            </div>
		          </div>
		        </section>
		`,
	styles: [
		`
			.text-red {
				color: var(--color-red) !important;
			}
		`,
	],
	standalone: false,
})
export class SecurityLicenceStatusVerificationSwlComponent {
	spdComplaintUrl = SPD_CONSTANTS.urls.spdComplaintUrl;

	showSearchDataError = false;
	searchDataError = '';

	showSearchResults = false;
	isWorkerLicenceNumberSearchError = false;
	searchResultsErrorName = '';
	lastNameLabel = 'Last Name';

	searchResults: Array<any> = [];

	form = this.formBuilder.group({
		workerLicenceNumber: new FormControl(''),
		firstName: new FormControl(''),
		lastName: new FormControl(''),
		isOneNameOnly: new FormControl(false),
	});

	matcher = new FormErrorStateMatcher();

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private optionsPipe: OptionsPipe,
		private licenceService: LicenceService
	) {}

	onBack(): void {
		this.router.navigateByUrl(SecurityLicenceStatusVerificationRoutes.path());
	}

	onSubmit() {
		this.reset();

		this.form.markAllAsTouched();

		const formValue = this.form.value;

		const workerLicenceNumber = formValue.workerLicenceNumber?.trim();
		const firstName = formValue.firstName?.trim();
		const lastName = formValue.lastName?.trim();
		const isOneNameOnly = formValue.isOneNameOnly ?? false;

		let performSearch = true;
		if ((workerLicenceNumber && (firstName || lastName)) || (!workerLicenceNumber && !firstName && !lastName)) {
			performSearch = false;
		} else if (workerLicenceNumber && !workerLicenceNumber.startsWith('E')) {
			this.searchDataError = 'The security worker licence number must start with an "E".';
			performSearch = false;
		} else if (!workerLicenceNumber) {
			// must have both names
			if (!isOneNameOnly && (!firstName || !lastName)) {
				performSearch = false;
			}
			// must have last name
			if (isOneNameOnly && !lastName) {
				performSearch = false;
			}
		}
		if (!performSearch) {
			this.showSearchDataError = true;
			return;
		}

		this.performSearch(workerLicenceNumber, firstName, lastName, isOneNameOnly);
	}

	getLicenceStatusClass(licenceStatusCode: LicenceStatusCode | null | undefined): string {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'mat-chip-green' : 'mat-chip-red';
	}

	getLicenceStatus(licenceStatusCode: LicenceStatusCode | null | undefined): string | null | undefined {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'Active' : licenceStatusCode;
	}

	isLicenceActive(licenceStatusCode: LicenceStatusCode | null | undefined): boolean {
		return this.utilService.isLicenceActive(licenceStatusCode);
	}

	onCheckboxChange(): void {
		const data = this.form.value;
		if (data.isOneNameOnly) {
			this.form.controls['firstName'].setValue('');
			this.lastNameLabel = 'Name';
		} else {
			this.lastNameLabel = 'Last Name';
		}
	}

	getSwlLicenceCategories(licence: LicenceBasicResponse): Array<string> {
		const catList = licence.categoryCodes?.map((item: WorkerCategoryTypeCode) =>
			this.optionsPipe.transform(item, 'WorkerCategoryTypes')
		);
		if (licence.showSecurityGuardAST) {
			catList?.push('Security Guard - AST');
		}
		return catList?.sort() ?? [];
	}

	get firstName(): FormControl {
		return this.form.get('firstName') as FormControl;
	}

	get isOneNameOnly(): FormControl {
		return this.form.get('isOneNameOnly') as FormControl;
	}

	private reset(): void {
		this.searchResults = [];

		this.showSearchDataError = false;
		this.searchDataError =
			'Enter either a security worker licence number, OR the full name as it appears on the licence.';

		this.showSearchResults = false;
		this.searchResultsErrorName = '';
	}

	private performSearch(
		licenceNumber: string | undefined,
		firstName: string | undefined,
		lastName: string | undefined,
		isOneNameOnly: boolean
	): void {
		console.debug('licenceNumber', licenceNumber);
		console.debug('firstName', firstName);
		console.debug('lastName', lastName);
		console.debug('isOneNameOnly', isOneNameOnly);

		const searchFirstName = isOneNameOnly ? '' : firstName;

		this.licenceService
			.apiLicencesSecurityWorkerLicenceGet({
				licenceNumber,
				firstName: searchFirstName,
				lastName,
			})
			.subscribe((resps: Array<LicenceBasicResponse>) => {
				if (resps.length === 0) {
					this.searchResultsErrorName = this.utilService.getFullName(searchFirstName, lastName) ?? '';
					this.isWorkerLicenceNumberSearchError = !!licenceNumber;
				} else {
					const sortedResps = resps.sort((a, b) => {
						return this.utilService.sortByDirection(a.licenceNumber, b.licenceNumber);
					});

					this.searchResults = sortedResps;
				}

				this.showSearchResults = true;
			});
	}
}
