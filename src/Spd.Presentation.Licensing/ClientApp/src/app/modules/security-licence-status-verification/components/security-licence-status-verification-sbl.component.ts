import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceBasicResponse, LicenceStatusCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-sbl',
	template: `
		<section class="step-section">
		  <div class="row">
		    <div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
		      <div class="row">
		        <div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
		          <h2 class="fs-3">Verify a Security Business Licence</h2>
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
		            Enter a security business <strong>licence number</strong> or at least the
		            <strong>first three (3)</strong> letters of the name of a security business below. The results will
		            display the Legal Business Name, the Trade Name, the Licence Number, the Licence Status (valid, not
		            valid), and the Licence Type of any businesses matching the search criteria.
		          </app-alert>
		        </div>
		      </div>
		
		      <form [formGroup]="form" novalidate>
		        <div class="row mb-2">
		          <div class="col-xl-5 col-lg-5 col-md-12">
		            <mat-form-field>
		              <mat-label>Business Licence Number</mat-label>
		              <input
		                matInput
		                formControlName="businessLicenceNumber"
		                oninput="this.value = this.value.toUpperCase()"
		                placeholder="B123456"
		                [errorStateMatcher]="matcher"
		                maxlength="20"
		                />
		              </mat-form-field>
		            </div>
		
		            <div class="col-xl-1 col-lg-1 col-md-12 text-center">
		              <div class="text-minor-heading text-red my-3">OR</div>
		            </div>
		
		            <div class="col-xl-6 col-lg-6 col-md-12">
		              <mat-form-field>
		                <mat-label>Business Name</mat-label>
		                <input matInput formControlName="businessName" [errorStateMatcher]="matcher" maxlength="40" />
		              </mat-form-field>
		            </div>
		          </div>
		
		          @if (showSearchDataError) {
		            <app-alert type="danger" icon="dangerous">
		              {{ searchDataError }}
		            </app-alert>
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
		                      <div class="fs-5" style="color: var(--color-primary);">
		                        {{ licence.licenceNumber }}
		                      </div>
		                    </div>
		                    <div class="col-xl-8 col-lg-8">
		                      <div class="row">
		                        <div class="col-xl-6 col-lg-6">
		                          <div class="d-block text-muted mt-2 mt-lg-0">Legal Business Name</div>
		                          <div class="text-data fw-bold">{{ licence.bizLegalName }}</div>
		                        </div>
		                        <div class="col-xl-6 col-lg-6">
		                          <div class="d-block text-muted mt-2 mt-lg-0">Trade Name</div>
		                          <div class="text-data fw-bold">{{ licence.licenceHolderName }}</div>
		                        </div>
		                        <div class="col-xl-12 col-lg-6">
		                          <div class="d-block text-muted mt-2">Licence Type(s)</div>
		                          <div class="text-data fw-bold">
		                            <ul class="m-0">
		                              @for (category of licence.categoryCodes?.sort(); track category; let i = $index) {
		                                <li>{{ category | options: 'WorkerCategoryTypes' }}</li>
		                              }
		                            </ul>
		                          </div>
		                        </div>
		                      </div>
		                    </div>
		                    <div class="col-xl-2 col-lg-2 text-end">
		                      <mat-chip-option
		                        [selectable]="false"
		                        class="appl-chip-option"
		                        [ngClass]="getLicenceStatusClass(licence.licenceStatusCode)"
		                        >
		                        <span class="appl-chip-option-item mx-2 fs-5">{{
		                          getLicenceStatus(licence.licenceStatusCode)
		                        }}</span>
		                      </mat-chip-option>
		                    </div>
		                  </div>
		                </div>
		              }
		            </div>
		          } @else {
		            <div class="mt-3">
		              <app-alert type="danger" icon="dangerous"> No results match your search. </app-alert>
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
export class SecurityLicenceStatusVerificationSblComponent {
	showSearchDataError = false;
	searchDataError = '';

	showSearchResults = false;

	searchResults: Array<any> = [{ licenceNumber: 'B1073' }, { licenceNumber: 'B1043' }, { licenceNumber: 'B9833' }];

	form = this.formBuilder.group({
		businessLicenceNumber: new FormControl(''),
		businessName: new FormControl(''),
	});

	matcher = new FormErrorStateMatcher();

	constructor(
		private router: Router,
		private utilService: UtilService,
		private formBuilder: FormBuilder,
		private licenceService: LicenceService
	) {}

	onBack(): void {
		this.router.navigateByUrl(SecurityLicenceStatusVerificationRoutes.path());
	}

	onSubmit() {
		this.reset();

		this.form.markAllAsTouched();

		const formValue = this.form.value;

		const businessLicenceNumber = formValue.businessLicenceNumber?.trim();
		const businessName = formValue.businessName?.trim();

		let performSearch = true;
		if ((businessLicenceNumber && businessName) || (!businessLicenceNumber && !businessName)) {
			performSearch = false;
		} else if (businessLicenceNumber && !businessLicenceNumber.startsWith('B')) {
			this.searchDataError = 'The business licence number must start with a "B".';
			performSearch = false;
		} else if (businessName && businessName.length < 3) {
			this.searchDataError = 'The business name must be at least 3 characters.';
			performSearch = false;
		}

		if (!performSearch) {
			this.showSearchDataError = true;
			return;
		}

		this.performSearch(businessLicenceNumber, businessName);
	}

	getLicenceStatusClass(licenceStatusCode: LicenceStatusCode | null | undefined): string {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'mat-chip-green' : 'mat-chip-red';
	}

	getLicenceStatus(licenceStatusCode: LicenceStatusCode | null | undefined): string {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'Active' : (licenceStatusCode ?? '---');
	}

	private reset(): void {
		this.searchResults = [];

		this.showSearchDataError = false;
		this.searchDataError = 'Enter either a business licence number, OR the business name is required.';

		this.showSearchResults = false;
	}

	private performSearch(licenceNumber: string | undefined, businessName: string | undefined): void {
		console.debug('licenceNumber', licenceNumber);
		console.debug('businessName', businessName);

		this.licenceService
			.apiLicencesBusinessLicenceGet({
				licenceNumber,
				businessName,
			})
			.subscribe((resps: Array<LicenceBasicResponse>) => {
				const sortedResps = resps.sort((a, b) => {
					return this.utilService.sortByDirection(a.licenceNumber, b.licenceNumber);
				});

				this.searchResults = sortedResps;

				this.showSearchResults = true;
			});
	}
}
