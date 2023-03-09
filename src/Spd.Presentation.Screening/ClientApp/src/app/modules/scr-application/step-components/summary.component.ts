import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-summary',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<div class="step">
				<app-step-title title="Review the following information"></app-step-title>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-xl-4 col-lg-4 col-md-12">
									<h4>Organization Information</h4>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Requesting Organization</div>
									<div class="text-data">Sunshine Daycare</div>
								</div>
								<div class="col-xl-4 col-lg-3 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Organization Phone Number</div>
									<div class="text-data">(250) 455-6565</div>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-xl-4 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Organization Address</div>
									<div class="text-data">760 Vernon Ave, Victoria, BC V8X 2W6, Canada</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Job Title</div>
									<div class="text-data">Teacher</div>
								</div>
							</div>
						</section>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-xl-4 col-lg-4 col-md-12">
									<h4>Contact Information</h4>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Contact First Name</div>
									<div class="text-data">John</div>
								</div>
								<div class="col-xl-3 col-lg-3 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Contact Surname</div>
									<div class="text-data">Smith</div>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-12 text-end">
									<mat-icon matTooltip="Edit this data" (click)="onReEditContact()">edit</mat-icon>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-xl-4 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Email</div>
									<div class="text-data">test@test.com</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Phone Number</div>
									<div class="text-data">(250) 465-9898</div>
								</div>
							</div>

							<div class="row mb-2">
								<div class="offset-xl-4 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Date of Birth</div>
									<div class="text-data">2000-Jan-04</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Birthplace</div>
									<div class="text-data">Victoria, BC, Canada</div>
								</div>
							</div>

							<div class="row mt-2">
								<div class="offset-xl-4 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block text-muted">BC Drivers License</div>
									<div class="text-data">9998877</div>
								</div>
							</div>

							<div class="row mt-2">
								<div class="offset-xl-4 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block text-muted">Previous Names</div>
									<div class="text-data">Norma Jeane Mortenson, Jean Morty</div>
								</div>
							</div>

							<div class="row my-2">
								<div class="offset-xl-4 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block text-muted">Mailing Address</div>
									<div class="text-data">755 Caledonia Avenue, Victoria, BC V8T 0C2, Canada</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			h4,
			.mat-icon {
				color: var(--color-primary-light);
			}

			.text-data {
				font-weight: 300;
			}

			.text-label {
				font-size: smaller;
			}

			.card-section {
				background-color: var(--color-card) !important;
				border-left: 3px solid var(--color-primary);
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class SummaryComponent {
	@Output() reEdit: EventEmitter<boolean> = new EventEmitter();

	onReEditContact(): void {
		this.reEdit.emit(true);
	}
}
