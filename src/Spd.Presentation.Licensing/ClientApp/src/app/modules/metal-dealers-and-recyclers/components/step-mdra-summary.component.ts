import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationTypeCode } from '@app/api/models';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { MetalDealersAndRecyclersBranchResponse } from './modal-mdra-branch.component';

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
								<div class="text-minor-heading-small">Business Owner</div>
								<div class="row mt-0">
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Business Owner Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDataname | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Legal Business Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDatabizLegalName | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Trade or 'Doing Business As' Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDatabizTradeName | default }}
										</div>
									</div>
									<div class="col-12">
										<div class="text-label d-block text-muted">Business Licence Documents</div>
										<ng-container *ngIf="attachmentsExist; else noAttachments">
											<div class="summary-text-data">
												<ul class="m-0">
													<ng-container *ngFor="let doc of businessLicenceAttachments; let i = index">
														<li>{{ doc.name }}</li>
													</ng-container>
												</ul>
											</div>
										</ng-container>
										<ng-template #noAttachments>
											<div class="summary-text-data">There are no business licence documents</div>
										</ng-template>
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
											{{ businessManagerDataname | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Email Address</div>
										<div class="summary-text-data">
											{{ businessManagerDataname | default }}
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
								<ng-container *ngIf="branchesExist; else noBranchesExist">
									<app-form-mdra-branches [form]="branchesFormGroup" [isReadonly]="true"></app-form-mdra-branches>
								</ng-container>
								<ng-template #noBranchesExist>
									<div class="text-minor-heading-small mt-3">No branches have been entered.</div>
								</ng-template>
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

	attachmentsExist!: boolean;
	branchesExist!: boolean;
	branchesFormGroup = this.metalDealersApplicationService.branchesFormGroup;
	dataSource!: MatTableDataSource<MetalDealersAndRecyclersBranchResponse>;
	columns: string[] = ['addressLine1', 'city', 'branchManager'];

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

		this.dataSource = new MatTableDataSource(this.branchesArray);
		this.branchesExist = this.dataSource.data.length > 0;
		this.attachmentsExist = this.businessLicenceAttachments.length > 0;
	}

	isFormValid(): boolean {
		return true;
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

	get businessManagerDataname(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDataname(this.metalDealersModelData);
	}
	get businessManagerDataphoneNumber(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDataphoneNumber(this.metalDealersModelData);
	}
	get businessManagerDataemailAddress(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDataemailAddress(this.metalDealersModelData);
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
