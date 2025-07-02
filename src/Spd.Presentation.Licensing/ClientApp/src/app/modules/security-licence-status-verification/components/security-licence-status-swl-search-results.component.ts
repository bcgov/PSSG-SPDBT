import { Component, Input } from '@angular/core';
import { LicenceBasicResponse, LicenceStatusCode, WorkerCategoryTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-security-licence-status-swl-search-results',
	template: `
		@if (showSearchResults) {
			@if (searchResults && searchResults.length > 0) {
				<div class="mb-3">
					<mat-divider class="my-3"></mat-divider>
					<div class="text-minor-heading my-3">Search results</div>
					@for (licence of searchResults; track licence; let i = $index) {
						<div class="summary-card-section summary-card-section__green mb-3 px-4 py-3">
							<div class="row">
								<div class="col-xl-2 col-lg-2">
									<div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
									<div class="text-minor-heading">
										{{ licence.licenceNumber }}
									</div>
								</div>

								@if (licence.licenceId) {
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
														<strong>{{ licence.licenceNumber }} - {{ licence.licenceHolderName }}</strong> does not hold
														a valid licence. If you believe they are working in security in B.C., please consider
														submitting a
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
								} @else {
									<div class="col-xl-8 col-lg-8 my-auto">
										<div class="text-data fw-bold">Not a valid security worker licence</div>
									</div>
								}
							</div>
						</div>
					}
				</div>
			} @else {
				<div class="mt-3">
					@if (searchResultsErrorName) {
						<app-alert type="danger" icon="dangerous">
							<strong>{{ searchResultsErrorName }}</strong> does not hold a valid licence. If you believe they are
							working in security in B.C., please consider submitting a
							<a aria-label="Navigate to SPD complaint site" [href]="spdComplaintUrl" target="_blank">complaint</a>.
						</app-alert>
					} @else {
						<app-alert type="danger" icon="dangerous">No results match your search.</app-alert>
					}
				</div>
			}
		}
	`,
	styles: [],
	standalone: false,
})
export class SecurityLicenceStatusSwlSearchResultsComponent {
	spdComplaintUrl = SPD_CONSTANTS.urls.spdComplaintUrl;

	@Input() showSearchResults!: boolean;
	@Input() searchResultsErrorName!: string | null | undefined;
	@Input() searchResults!: Array<LicenceBasicResponse> | null | undefined;

	constructor(
		private utilService: UtilService,
		private optionsPipe: OptionsPipe
	) {}

	getLicenceStatusClass(licenceStatusCode: LicenceStatusCode | null | undefined): string {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'mat-chip-green' : 'mat-chip-red';
	}

	getLicenceStatus(licenceStatusCode: LicenceStatusCode | null | undefined): string | null | undefined {
		return this.utilService.isLicenceActive(licenceStatusCode) ? 'Active' : licenceStatusCode;
	}

	isLicenceActive(licenceStatusCode: LicenceStatusCode | null | undefined): boolean {
		return this.utilService.isLicenceActive(licenceStatusCode);
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
}
