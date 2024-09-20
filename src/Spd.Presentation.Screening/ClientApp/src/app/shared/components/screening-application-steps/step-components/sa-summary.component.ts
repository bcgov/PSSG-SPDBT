import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-sa-summary',
	template: `
		<section class="step-section pt-4 pb-4 px-3">
			<div class="step" *ngIf="orgData">
				<app-step-title title="Review the following information"></app-step-title>
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
						<section class="px-4 py-2 mb-3 card-section">
							<div class="row mt-2">
								<div class="col-xl-3 col-lg-4 col-md-12">
									<h4>Organization<br />Information</h4>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block">
										<span *ngIf="orgData.isCrrpa">Requesting Organization</span>
										<span *ngIf="!orgData.isCrrpa">Ministry</span>
									</div>
									<div class="text-data">{{ orgData.orgName }}</div>
								</div>
								<div class="col-xl-4 col-lg-3 col-md-12" *ngIf="orgData.isCrrpa">
									<div class="text-label d-block mt-2 mt-lg-0">Organization Phone Number</div>
									<div class="text-data">
										{{ orgData.orgPhoneNumber || '' | mask : appConstants.phone.displayMask }}
									</div>
								</div>
								<div class="col-xl-4 col-lg-3 col-md-12" *ngIf="!orgData.isCrrpa">
									<div class="text-label d-block mt-2 mt-lg-0">Job Title</div>
									<div class="text-data">{{ orgData.jobTitle | default }}</div>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-12 text-end">
									<mat-icon matTooltip="Edit this data" (click)="onReEditOrg()">edit</mat-icon>
								</div>
							</div>

							<ng-container *ngIf="orgData.isCrrpa">
								<mat-divider class="my-3"></mat-divider>

								<div class="row mb-2">
									<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
										<div class="text-label d-block">Organization Address</div>
										<div class="text-data">{{ orgData.orgAddress | default }}</div>
									</div>
									<div class="col-xl-4 col-lg-4 col-md-12">
										<div class="text-label d-block mt-2 mt-lg-0">Job Title</div>
										<div class="text-data">{{ orgData.jobTitle | default }}</div>
									</div>
								</div>
							</ng-container>
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
									<div class="text-label d-block">Contact Given Names</div>
									<div class="text-data">
										{{ orgData.givenName }} {{ orgData.middleName1 }} {{ orgData.middleName2 }}
									</div>
								</div>
								<div class="col-xl-4 col-lg-3 col-md-12">
									<div class="text-label d-block mt-2 mt-lg-0">Contact Surname</div>
									<div class="text-data">{{ orgData.surname }}</div>
								</div>
								<div class="col-xl-1 col-lg-1 col-md-12 text-end">
									<mat-icon matTooltip="Edit this data" (click)="onReEditContact()">edit</mat-icon>
								</div>
							</div>

							<mat-divider class="my-3"></mat-divider>

							<div class="row mb-2">
								<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block">Email</div>
									<div class="text-data">{{ orgData.emailAddress | default }}</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block mt-2 mt-lg-0">Phone Number</div>
									<div class="text-data">
										{{ orgData.phoneNumber || '' | mask : appConstants.phone.displayMask }}
									</div>
								</div>
							</div>

							<div class="row mb-2">
								<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block">Date of Birth</div>
									<div class="text-data">
										{{ orgData.dateOfBirth | formatDate }}
									</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block mt-2 mt-lg-0">Birthplace</div>
									<div class="text-data">{{ orgData.birthPlace | default }}</div>
								</div>
							</div>

							<div class="row mb-2">
								<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block">BC Drivers Licence</div>
									<div class="text-data">{{ orgData.driversLicense | default }}</div>
								</div>
								<div class="col-xl-4 col-lg-4 col-md-12">
									<div class="text-label d-block mt-2 mt-lg-0">Sex</div>
									<div class="text-data">{{ orgData.genderCode | options : 'GenderTypes' | default }}</div>
								</div>
							</div>

							<div class="row mb-2" *ngIf="orgData.bcGovEmployeeIdShow">
								<div class="offset-xl-3 col-xl-4 offset-lg-4 col-lg-4 col-md-12">
									<div class="text-label d-block">BC Government Employee ID</div>
									<div class="text-data">{{ orgData.employeeId | default }}</div>
								</div>
							</div>

							<div class="row mt-2">
								<div class="offset-xl-3 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block">Previous Names</div>
									<div class="text-data">
										<ng-container *ngIf="orgData.aliases?.length > 0; else noPreviousNames">
											<ng-container *ngFor="let name of orgData.aliases">
												<div>{{ name.givenName }} {{ name.middleName1 }} {{ name.middleName2 }} {{ name.surname }}</div>
											</ng-container>
										</ng-container>
										<ng-template #noPreviousNames> -- </ng-template>
									</div>
								</div>
							</div>

							<div class="row my-2">
								<div class="offset-xl-3 col-xl-8 offset-lg-4 col-lg-8 col-md-12">
									<div class="text-label d-block">Mailing Address</div>
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
				font-size: 1.05rem;
				font-weight: 300;
				line-height: 1.3em;
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
export class SaSummaryComponent {
	appConstants = SPD_CONSTANTS;

	@Input() orgData: any | null = null;
	@Output() reEditPersonalInformation: EventEmitter<boolean> = new EventEmitter();
	@Output() reEditCrcInformation: EventEmitter<boolean> = new EventEmitter();

	constructor(private utilService: UtilService) {}

	onReEditOrg(): void {
		this.reEditCrcInformation.emit(true);
	}

	onReEditContact(): void {
		this.reEditPersonalInformation.emit(true);
	}

	getCrcDataMailingAddress(): string {
		if (this.orgData) {
			return this.utilService.getAddressString({
				addressLine1: this.orgData.addressLine1!,
				addressLine2: this.orgData.addressLine2 ?? undefined,
				city: this.orgData.city!,
				province: this.orgData.province!,
				postalCode: this.orgData.postalCode!,
				country: this.orgData.country!,
			});
		}

		return '';
	}
}
