import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceBasicResponse, LicenceStatusCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
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

						<div class="col-xl-4 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onBack()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
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
										placeholder="E12345678"
										[errorStateMatcher]="matcher"
										maxlength="20"
									/>
								</mat-form-field>
							</div>

							<div class="col-xl-1 col-lg-1 col-md-12 text-center">
								<div class="text-minor-heading text-red my-3">OR</div>
							</div>

							<div class="col-xl-3 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>First Name</mat-label>
									<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="offset-xl-0 col-xl-4 offset-lg-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Last Name</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>
						</div>

						<ng-container *ngIf="showSearchDataError">
							<app-alert type="danger" icon="error">
								Enter either a security worker licence number, OR the full name as it appears on the licence.
							</app-alert>
						</ng-container>

						<div class="row my-2">
							<div class="col-12 text-end">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onSubmit()">Submit</button>
							</div>
						</div>
					</form>

					<ng-container *ngIf="showSearchResults">
						<mat-divider class="mat-divider-main my-3"></mat-divider>
						<div class="text-minor-heading my-3">Search Results</div>

						<div class="mb-3" *ngIf="searchResults.length > 0; else NoSearchResults">
							<div
								class="summary-card-section summary-card-section__green mb-3 px-4 py-3"
								*ngFor="let licence of searchResults; let i = index"
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
												<div class="d-block text-muted mt-2 mt-lg-0">Licence Holder Name</div>
												<div class="text-data fw-bold">{{ licence.licenceHolderName }}</div>
											</div>
											<div class="col-xl-6 col-lg-6">
												<div class="d-block text-muted mt-2 mt-lg-0">Licence Type(s)</div>
												<div class="text-data fw-bold">{{ licence.categoryCodes }}</div>
											</div>
										</div>
									</div>
									<div class="col-xl-2 col-lg-2 text-end">
										<mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-green">
											<span class="appl-chip-option-item mx-2 fs-5">{{
												getLicenceStatus(licence.licenceStatusCode)
											}}</span>
										</mat-chip-option>
									</div>
								</div>
							</div>
						</div>
						<ng-template #NoSearchResults> not found </ng-template>
					</ng-container>
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
})
export class SecurityLicenceStatusVerificationSwlComponent {
	showSearchResults = false;
	showSearchDataError = false;

	searchResults: Array<any> = [];

	form = this.formBuilder.group({
		workerLicenceNumber: new FormControl(''),
		givenName: new FormControl(''),
		surname: new FormControl(''),
	});

	matcher = new FormErrorStateMatcher();

	constructor(
		private router: Router,
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

		const workerLicenceNumber = formValue.workerLicenceNumber?.trim();
		const givenName = formValue.givenName?.trim();
		const surname = formValue.surname?.trim();

		let performSearch = true;
		if ((workerLicenceNumber && givenName && surname) || (!workerLicenceNumber && !givenName && !surname)) {
			performSearch = false;
		} else if (!workerLicenceNumber) {
			// must have both names
			if (!givenName || !surname) {
				performSearch = false;
			}
		}

		if (!performSearch) {
			this.showSearchDataError = true;
			return;
		}

		this.performSearch(workerLicenceNumber, givenName, surname);
	}

	private reset(): void {
		this.showSearchDataError = false;
		this.showSearchResults = false;
	}

	private performSearch(
		licenceNumber: string | undefined,
		firstName: string | undefined,
		lastName: string | undefined
	): void {
		console.debug('[performSearch] licenceNumber', licenceNumber);
		console.debug('firstName', firstName);
		console.debug('lastName', lastName);

		this.licenceService
			.apiLicencesSecurityWorkerLicenceGet({
				licenceNumber,
				firstName,
				lastName,
			})
			.subscribe((resps: Array<LicenceBasicResponse>) => {
				this.showSearchResults = true;
				this.searchResults = resps;
				// LicenceBasicResponse {
				// 	categoryCodes?: Array<WorkerCategoryTypeCode> | null;
				// 	expiryDate?: string;
				// 	licenceAppId?: string | null;
				// 	licenceHolderId?: string | null;
				// 	licenceHolderName?: string | null;
				// 	licenceId?: string | null;
				// 	licenceNumber?: string | null;
				// 	licenceStatusCode?: LicenceStatusCode;
				// 	licenceTermCode?: LicenceTermCode;
				// 	nameOnCard?: string | null;
				// 	serviceTypeCode?: ServiceTypeCode;
				//   }
			});
	}

	public getLicenceStatus(licenceStatusCode: LicenceStatusCode | null | undefined): string {
		if (!licenceStatusCode) return '';

		if (licenceStatusCode === LicenceStatusCode.Active || licenceStatusCode === LicenceStatusCode.Preview) {
			return 'Active';
		}

		return licenceStatusCode;
	}
}
