import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';

@Component({
	selector: 'app-summary',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<div class="step" *ngIf="crcData">
				<app-step-title title="Review the following information"></app-step-title>
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-xl-3 col-lg-4 col-md-12">
									<h4>Organization<br />Information</h4>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Requesting Organization</div>
									<div class="text-data">{{ crcData.orgName }}</div>
								</div>
								<div class="col-xl-4 col-lg-3 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Organization Phone Number</div>
									<div class="text-data">
										{{ crcData.orgPhoneNumber || '' | mask : appConstants.phone.displayMask }}
									</div>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-12 text-end">
									<mat-icon matTooltip="Edit this data" (click)="onReEditOrg()">edit</mat-icon>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Organization Address</div>
									<div class="text-data">{{ crcData.address }}</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Job Title</div>
									<div class="text-data">{{ crcData.jobTitle }}</div>
								</div>
							</div>
						</section>
					</div>
				</div>
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-xl-3 col-lg-4 col-md-12">
									<h4>Contact<br />Information</h4>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Contact Given Names</div>
									<div class="text-data">
										{{ crcData.contactGivenName }} {{ crcData.contactMiddleName1 }} {{ crcData.contactMiddleName2 }}
									</div>
								</div>
								<div class="col-xl-4 col-lg-3 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Contact Surname</div>
									<div class="text-data">{{ crcData.contactSurname }}</div>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-12 text-end">
									<mat-icon matTooltip="Edit this data" (click)="onReEditContact()">edit</mat-icon>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Email</div>
									<div class="text-data">{{ crcData.emailAddress }}</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Phone Number</div>
									<div class="text-data">{{ crcData.phoneNumber || '' | mask : appConstants.phone.displayMask }}</div>
								</div>
							</div>

							<div class="row mb-2">
								<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted">Date of Birth</div>
									<div class="text-data">
										{{ crcData.contactDateOfBirth | date : appConstants.date.dateFormat : 'UTC' }}
									</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block text-muted mt-2 mt-lg-0">Birthplace</div>
									<div class="text-data">{{ crcData.birthplace }}</div>
								</div>
							</div>

							<div class="row mt-2">
								<div class="offset-xl-3 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block text-muted">BC Drivers Licence</div>
									<div class="text-data">{{ crcData.driversLicenseNumber | default }}</div>
								</div>
							</div>

							<div class="row mt-2">
								<div class="offset-xl-3 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block text-muted">Previous Names</div>
									<div class="text-data">
										<ng-container *ngIf="crcData.previousNamesList?.length > 0; else noPreviousNames">
											<ng-container *ngFor="let name of crcData.previousNamesList">
												<div>{{ name.firstName }} {{ name.middleNames }} {{ name.previousSurname }}</div>
											</ng-container>
										</ng-container>
										<ng-template #noPreviousNames> -- </ng-template>
									</div>
								</div>
							</div>

							<div class="row my-2">
								<div class="offset-xl-3 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block text-muted">Mailing Address</div>
									<div class="text-data">{{ getCrcDataMailingAddress() }}</div>
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
				border-left: 4px solid var(--color-primary);
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class SummaryComponent {
	appConstants = SPD_CONSTANTS;

	@Input() crcData!: any;
	@Output() reEditPersonalInformation: EventEmitter<boolean> = new EventEmitter();
	@Output() reEditCrcInformation: EventEmitter<boolean> = new EventEmitter();

	onReEditOrg(): void {
		this.reEditCrcInformation.emit(true);
	}

	onReEditContact(): void {
		this.reEditPersonalInformation.emit(true);
	}

	getCrcDataMailingAddress(): string {
		if (this.crcData) {
			let address =
				this.crcData.mailingAddressLine1 +
				', ' +
				this.crcData.mailingCity +
				', ' +
				this.crcData.mailingProvince +
				', ' +
				this.crcData.mailingPostalCode +
				', ' +
				this.crcData.mailingCountry;
			return address;
		}

		return '';
	}
}
