import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LicenceBasicResponse, LicenceStatusCode } from '@app/api/models';
import { LicenceService } from '@app/api/services';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
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

						<div class="col-xl-4 col-lg-4 col-md-12 no-print">
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
										placeholder="E123456"
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
									<input matInput formControlName="firstName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="offset-xl-0 col-xl-4 offset-lg-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Last Name</mat-label>
									<input matInput formControlName="lastName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>
						</div>

						<ng-container *ngIf="showSearchDataError">
							<app-alert type="danger" icon="error"> {{ searchDataError }} </app-alert>
						</ng-container>

						<div class="row no-print my-2">
							<div class="col-12 text-end">
								<button mat-flat-button color="primary" class="large w-auto" (click)="onSubmit()">Submit</button>
							</div>
						</div>
					</form>

					<ng-container *ngIf="showSearchResults">
						<div class="mb-3" *ngIf="searchResults.length > 0; else NoSearchResults">
							<mat-divider class="mat-divider-main my-3"></mat-divider>
							<div class="text-minor-heading my-3">Search Results</div>

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
												<div class="text-data fw-bold">
													<ul class="m-0">
														<ng-container *ngFor="let category of licence.categoryCodes; let i = index">
															<li>{{ category | options: 'WorkerCategoryTypes' }}</li>
														</ng-container>
													</ul>
												</div>
											</div>

											<div class="mt-3" *ngIf="!isLicenceActive(licence.licenceStatusCode)">
												<app-alert type="warning" icon="warn">
													<strong>{{ licence.licenceNumber }} - {{ licence.licenceHolderName }}</strong> does not hold a
													valid licence. If you believe they are working in security in B.C., please consider submitting
													a <a [href]="spdComplaintUrl" target="_blank">complaint</a>.
												</app-alert>
											</div>
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
						</div>
						<ng-template #NoSearchResults>
							<div class="mt-3">
								<ng-container *ngIf="isWorkerLicenceNumberSearchError; else NameSearchError">
									<app-alert type="danger" icon="error">No results match your search.</app-alert>
								</ng-container>

								<ng-template #NameSearchError>
									<app-alert type="danger" icon="error">
										<strong>{{ firstName }} {{ lastName }}</strong> does not hold a valid licence. If you believe they
										are working in security in B.C., please consider submitting a
										<a [href]="spdComplaintUrl" target="_blank">complaint</a>.
									</app-alert>
								</ng-template>
							</div>
						</ng-template>
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
	spdComplaintUrl = SPD_CONSTANTS.urls.spdComplaintUrl;

	showSearchDataError = false;
	searchDataError = '';

	showSearchResults = false;
	isWorkerLicenceNumberSearchError = false;

	searchResults: Array<any> = [];

	form = this.formBuilder.group({
		workerLicenceNumber: new FormControl(''),
		firstName: new FormControl(''),
		lastName: new FormControl(''),
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

		const workerLicenceNumber = formValue.workerLicenceNumber?.trim();
		const firstName = formValue.firstName?.trim();
		const lastName = formValue.lastName?.trim();

		let performSearch = true;
		if ((workerLicenceNumber && firstName && lastName) || (!workerLicenceNumber && !firstName && !lastName)) {
			performSearch = false;
		} else if (!workerLicenceNumber) {
			// must have both names
			if (!firstName || !lastName) {
				performSearch = false;
			}
		}

		if (!performSearch) {
			this.showSearchDataError = true;
			return;
		}

		this.performSearch(workerLicenceNumber, firstName, lastName);
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

	get firstName(): string {
		return this.form.value.firstName ?? '';
	}

	get lastName(): string {
		return this.form.value.lastName ?? '';
	}

	private reset(): void {
		this.searchResults = [];

		this.showSearchDataError = false;
		this.searchDataError =
			'Enter either a security worker licence number, OR the full name as it appears on the licence.';

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
				if (resps.length === 0) {
					this.isWorkerLicenceNumberSearchError = !!licenceNumber;
				} else {
					const sortedResps = resps.sort((a, b) => {
						return this.utilService.sortDate(a.licenceNumber, b.licenceNumber);
					});

					this.searchResults = sortedResps;
				}

				this.showSearchResults = true;
			});
	}
}
