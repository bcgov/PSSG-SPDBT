import { Component } from '@angular/core';

@Component({
	selector: 'app-summary',
	template: `
		<section class="step-section pt-4 pb-5">
			<div class="step">
				<div class="title mb-5">Review the following information:</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-lg-3">
									<mat-chip-listbox>
										<mat-chip selected color="accent" class="p-3">Eligibility </mat-chip>
									</mat-chip-listbox>
								</div>
								<div class="col-lg-5">
									<small class="d-block text-muted">Requesting Organization</small>
									<strong> Sunshine Daycare </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted">Organization Phone Number</small>
									<strong> (250) 455-6565 </strong>
								</div>
								<div class="col-lg-1">
									<mat-icon>edit</mat-icon>
								</div>
							</div>

							<hr />

							<div class="row mb-2">
								<div class="offset-lg-3 col-lg-5">
									<small class="d-block text-muted">Organization Address</small>
									760 Vernon Ave, Victoria, BC V8X 2W6, Canada
								</div>
								<div class="col-lg-4">
									<small class="d-block text-muted">Job Title</small>
									Teacher
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
									<mat-chip-listbox>
										<mat-chip selected color="accent" class="p-3">Contact </mat-chip>
									</mat-chip-listbox>
								</div>
								<div class="col-lg-5">
									<small class="d-block text-muted">Contact First Name</small>
									<strong> John </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted">Contact Surname</small>
									<strong> Smith </strong>
								</div>
								<div class="col-lg-1">
									<mat-icon>edit</mat-icon>
								</div>
							</div>

							<hr />

							<div class="row mb-2">
								<div class="offset-lg-3 col-lg-5">
									<small class="d-block text-muted">Email</small>
									test@test.com
								</div>
								<div class="col-lg-4">
									<small class="d-block text-muted">Phone Number</small>
									(250) 465-9898
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
									<mat-chip-listbox>
										<mat-chip selected color="accent" class="p-3">Personal </mat-chip>
									</mat-chip-listbox>
								</div>
								<div class="col-lg-5">
									<small class="d-block text-muted">Date of Birth</small>
									<strong> Jan 4, 2000 </strong>
								</div>
								<div class="col-lg-3">
									<small class="d-block text-muted">Birthplace</small>
									<strong> Victoria, BC, Canada </strong>
								</div>
								<div class="col-lg-1">
									<mat-icon>edit</mat-icon>
								</div>
							</div>

							<hr />

							<div class="row mb-2">
								<div class="offset-lg-3 col-lg-5">
									<small class="d-block text-muted">BC Drivers License</small>
									9998877
								</div>
								<!-- <div class="col-lg-3">
								<small class="d-block text-muted">Amount due</small>
								142
							</div> -->
							</div>
						</section>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.mat-mdc-standard-chip {
				background-color: var(--color-yellow) !important;
			}

			.card-section {
				background-color: #ededed !important;
				border-left: 3px solid var(--color-primary);
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class SummaryComponent {}
