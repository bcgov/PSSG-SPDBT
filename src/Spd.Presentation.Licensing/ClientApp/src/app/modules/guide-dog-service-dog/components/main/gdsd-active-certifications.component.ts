import { Component } from '@angular/core';

@Component({
	selector: 'app-gdsd-active-certifications',
	template: `
		<div class="mb-3">
			<div class="text-primary-color fs-5 py-3">Active Certifications</div>
			<div class="summary-card-section summary-card-section__green mb-3 px-4 py-3">
				<div class="row">
					<div class="col-lg-2">
						<div class="fs-5" style="color: var(--color-primary);">Dog Trainer</div>
					</div>
					<div class="col-lg-10">
						<div class="row">
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Licence Number</div>
								<div class="text-data fw-bold">GDSD0001</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Licence Term</div>
								<div class="text-data fw-bold">2 Years</div>
							</div>
							<div class="col-lg-3">
								<div class="d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
								<div class="text-data fw-bold">2026-01-01</div>
								<!-- <div class="text-data fw-bold" [ngClass]="licence.isRenewalPeriod ? 'error-color' : ''">
									{{ licence.expiryDate | formatDate: formalDateFormat }}
								</div> -->
							</div>
							<div class="col-lg-3 text-end">
								<mat-chip-option [selectable]="false" class="appl-chip-option mat-chip-green">
									<mat-icon class="appl-chip-option-item">check_circle</mat-icon>
									<span class="appl-chip-option-item mx-2 fs-5">Active</span>
								</mat-chip-option>
							</div>
							<mat-divider class="my-2"></mat-divider>
						</div>

						<div class="row mb-2">
							<div class="col-lg-4">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
							<div class="col-lg-4">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
							<div class="col-lg-4">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
						</div>
						<mat-divider class="my-2"></mat-divider>
						<div class="row mb-2">
							<div class="col-lg-4">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
							<div class="col-lg-8">
								<div class="d-block text-muted mt-2 mt-lg-0">Label</div>
								<div class="text-data">Data</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.appl-chip-option {
				height: 35px;
			}

			.appl-chip-option-item {
				vertical-align: text-bottom;
			}

			.error-color {
				font-weight: 600;
				color: var(--color-red-dark);
			}
		`,
	],
	standalone: false,
})
export class GdsdActiveCertificationsComponent {}
