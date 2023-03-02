import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-summary',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<div class="step">
				<div class="title mb-5">Review the following information</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-lg-3">
									<h4>Organization Information</h4>
								</div>
								<div class="col-lg-5">
									<small class="d-block text-muted">Requesting Organization</small>
									<strong> Sunshine Daycare </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted mt-2 mt-lg-0">Organization Phone Number</small>
									<strong> (250) 455-6565 </strong>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-lg-3 col-lg-5">
									<small class="d-block text-muted">Organization Address</small>
									<strong>760 Vernon Ave, Victoria, BC V8X 2W6, Canada</strong>
								</div>
								<div class="col-lg-4">
									<small class="d-block text-muted mt-2 mt-lg-0">Job Title</small>
									<strong>Teacher</strong>
								</div>
							</div>
						</section>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-lg-3">
									<h4>Contact Information</h4>
								</div>
								<div class="col-lg-5">
									<small class="d-block text-muted">Contact First Name</small>
									<strong> John </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted mt-2 mt-lg-0">Contact Surname</small>
									<strong> Smith </strong>
								</div>
								<div class="col-lg-1 text-end">
									<mat-icon matTooltip="Edit this data" (click)="onReEditContact()">edit</mat-icon>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-lg-3 col-lg-5">
									<small class="d-block text-muted">Email</small>
									<strong>test@test.com</strong>
								</div>
								<div class="col-lg-4">
									<small class="d-block text-muted mt-2 mt-lg-0">Phone Number</small>
									<strong>(250) 465-9898</strong>
								</div>
							</div>

							<div class="row mb-2">
								<div class="offset-lg-3 col-lg-5">
									<small class="d-block text-muted">Date of Birth</small>
									<strong> 2000-Jan-04 </strong>
								</div>
								<div class="col-lg-4">
									<small class="d-block text-muted mt-2 mt-lg-0">Birthplace</small>
									<strong> Victoria, BC, Canada </strong>
								</div>
							</div>

							<div class="row mt-2">
								<div class="offset-lg-3 col-lg-5">
									<small class="d-block text-muted">BC Drivers License</small>
									<strong>9998877</strong>
								</div>
							</div>

							<div class="row mt-2">
								<div class="offset-lg-3 col-lg-8">
									<small class="d-block text-muted">Previous Names</small>
									<strong>Norma Jeane Mortenson, Jean Morty</strong>
								</div>
							</div>

							<div class="row my-2">
								<div class="offset-lg-3 col-lg-8">
									<small class="d-block text-muted">Mailing Address</small>
									<strong>755 Caledonia Avenue, Victoria, BC V8T 0C2, Canada</strong>
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
