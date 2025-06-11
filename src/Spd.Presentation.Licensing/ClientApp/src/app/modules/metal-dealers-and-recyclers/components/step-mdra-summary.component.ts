import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormMdraBranchesComponent } from './form-mdra-branches.component';

@Component({
	selector: 'app-step-mdra-summary',
	template: `
		<app-step-section
			title="Registration summary"
			subtitle="Review your information before submitting your application"
			*ngIf="metalDealersModelData"
		>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<mat-accordion multi="true">
						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Business Information</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step 2"
											aria-label="Go to Step 2"
											(click)="$event.stopPropagation(); onEditStep(1)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<mat-divider class="mt-3 mb-2"></mat-divider>
								<div class="text-minor-heading-small">Expired Licence</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Expired Licence</div>
										<div class="summary-text-data">{{ hasExpiredLicence | default }}</div>
									</div>
									<ng-container *ngIf="hasExpiredLicence === booleanTypeCodeYes">
										<div class="col-lg-4 col-md-12">
											<div class="text-label d-block text-muted">Expired Licence Number</div>
											<div class="summary-text-data">{{ expiredLicenceNumber | default }}</div>
										</div>
										<div class="col-lg-4 col-md-12">
											<div class="text-label d-block text-muted">Expiry Date</div>
											<div class="summary-text-data">
												{{ expiredLicenceExpiryDate | formatDate | default }}
											</div>
										</div>
									</ng-container>
								</div>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<div class="text-minor-heading-small">Business Owner</div>
								<div class="row mt-0">
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Business Owner Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDataname | default }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Legal Business Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDatabizLegalName | default }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Trade or 'Doing Business As' Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDatabizTradeName | default }}
										</div>
									</div>
									<div class="col-lg-6 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">
											{{ businessOwnerDatabizEmailAddress | default }}
										</div>
									</div>
									<div class="col-12">
										<div class="text-label d-block text-muted">Business Licence Documents</div>
										<div class="summary-text-data">
											<ul class="m-0">
												<ng-container *ngFor="let doc of businessLicenceAttachments; let i = index">
													<li>{{ doc.name }}</li>
												</ng-container>
											</ul>
										</div>
									</div>
								</div>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<div class="text-minor-heading-small">Business Manager</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Business Manager Name</div>
										<div class="summary-text-data">
											{{ businessManagerDataname | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Phone Number</div>
										<div class="summary-text-data">
											{{ businessManagerDatabizPhoneNumber | formatPhoneNumber | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">
											{{ businessManagerDatabizManagerEmailAddress | default }}
										</div>
									</div>
								</div>
								<mat-divider class="mt-3 mb-2"></mat-divider>

								<app-form-address-summary
									[formData]="metalDealersModelData.businessAddressData"
									headingLabel="Business Address"
									[isAddressTheSame]="false"
								></app-form-address-summary>

								<mat-divider class="mt-3 mb-2"></mat-divider>
								<app-form-address-summary
									[formData]="metalDealersModelData.businessMailingAddressData"
									headingLabel="Business Mailing Address"
									[isAddressTheSame]="isAddressTheSame"
									isAddressTheSameLabel="The business address and mailing address are the same"
								></app-form-address-summary>
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Branch Offices</div>
										<button
											mat-mini-fab
											color="primary"
											class="go-to-step-button"
											matTooltip="Go to Step 3"
											aria-label="Go to Step 3"
											(click)="$event.stopPropagation(); onEditStep(2)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body">
								<app-form-mdra-branches [form]="branchesFormGroup" [isReadonly]="true"></app-form-mdra-branches>
							</div>
						</mat-expansion-panel>
					</mat-accordion>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
			.mat-expansion-panel {
				border-radius: 0;
			}

			.mat-expansion-panel-header {
				height: unset;
			}

			.panel-body {
				margin-top: 10px;
				margin-bottom: 10px;
			}

			.review-panel-title {
				width: 100%;

				.mat-toolbar {
					background-color: var(--color-primary-lighter) !important;
					color: var(--color-primary-dark) !important;
					padding: 0;

					.panel-header {
						white-space: normal;
						margin-top: 0.5rem !important;
						margin-bottom: 0.5rem !important;
					}
				}
			}

			.go-to-step-button {
				width: 35px;
				height: 35px;
			}
		`,
	],
	standalone: false,
})
export class StepMdraSummaryComponent implements OnInit, LicenceChildStepperStepComponent {
	metalDealersModelData: any = {};

	booleanTypeCodeYes = BooleanTypeCode.Yes;

	branchesFormGroup = this.metalDealersApplicationService.branchesFormGroup;
	columns: string[] = ['addressLine1', 'city', 'branchManager'];

	@ViewChild(FormMdraBranchesComponent) formBranches!: FormMdraBranchesComponent;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	ngOnInit(): void {
		this.metalDealersModelData = {
			...this.metalDealersApplicationService.metalDealersModelFormGroup.getRawValue(),
		};
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.metalDealersModelData = {
			...this.metalDealersApplicationService.metalDealersModelFormGroup.getRawValue(),
		};

		this.formBranches.refreshTable();
	}

	isFormValid(): boolean {
		return true;
	}

	get hasExpiredLicence(): string {
		return this.metalDealersApplicationService.getSummaryhasExpiredLicence(this.metalDealersModelData);
	}
	get expiredLicenceNumber(): string {
		return this.metalDealersApplicationService.getSummaryexpiredLicenceNumber(this.metalDealersModelData);
	}
	get expiredLicenceExpiryDate(): string {
		return this.metalDealersApplicationService.getSummaryexpiredLicenceExpiryDate(this.metalDealersModelData);
	}

	get businessOwnerDataname(): string {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDataname(this.metalDealersModelData);
	}
	get businessOwnerDatabizLegalName(): string {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDatabizLegalName(this.metalDealersModelData);
	}
	get businessOwnerDatabizTradeName(): string {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDatabizTradeName(this.metalDealersModelData);
	}
	get businessOwnerDatabizEmailAddress(): string {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDatabizEmailAddress(this.metalDealersModelData);
	}

	get businessManagerDataname(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDataname(this.metalDealersModelData);
	}
	get businessManagerDatabizPhoneNumber(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDatabizPhoneNumber(this.metalDealersModelData);
	}
	get businessManagerDatabizManagerEmailAddress(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDatabizManagerEmailAddress(
			this.metalDealersModelData
		);
	}

	get isAddressTheSame(): boolean {
		return this.metalDealersApplicationService.getSummaryisAddressTheSame(this.metalDealersModelData);
	}

	get businessLicenceAttachments(): File[] {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDataattachments(this.metalDealersModelData);
	}

	get branchesArray(): Array<any> {
		return this.metalDealersApplicationService.getSummarybranchesDatabranches(this.metalDealersModelData);
	}
}
