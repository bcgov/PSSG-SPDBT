import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';

@Component({
	selector: 'app-step-metal-dealers-summary',
	template: `
		<app-step-section title="Review" *ngIf="modelData">
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
								<div class="text-minor-heading-small mt-4">Business Owner</div>
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
											{{ businessOwnerDatalegalBusinessName | default }}
										</div>
									</div>
									<div class="col-lg-4 col-md-12">
										<div class="text-label d-block text-muted">Trade Name or "doing business as" Name</div>
										<div class="summary-text-data">
											{{ businessOwnerDatatradeName | default }}
										</div>
									</div>
								</div>
								<div class="text-minor-heading-small mt-4">Business Manager</div>
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
							</div>
						</mat-expansion-panel>

						<mat-expansion-panel class="mb-4" [expanded]="true">
							<mat-expansion-panel-header>
								<mat-panel-title class="review-panel-title">
									<mat-toolbar class="d-flex justify-content-between">
										<div class="panel-header">Business Addresses</div>
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

							<div class="panel-body"></div>
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
											matTooltip="Go to Step 4"
											aria-label="Go to Step 4"
											(click)="$event.stopPropagation(); onEditStep(3)"
										>
											<mat-icon>edit</mat-icon>
										</button>
									</mat-toolbar>
								</mat-panel-title>
							</mat-expansion-panel-header>

							<div class="panel-body"></div>
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
export class StepMetalDealersSummaryComponent implements OnInit {
	modelData: any = {};

	@Output() editStep: EventEmitter<number> = new EventEmitter<number>();

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	ngOnInit(): void {
		this.modelData = {
			...this.metalDealersApplicationService.modelFormGroup.getRawValue(),
		};
	}

	onEditStep(stepNumber: number) {
		this.editStep.emit(stepNumber);
	}

	onUpdateData(): void {
		this.modelData = {
			...this.metalDealersApplicationService.modelFormGroup.getRawValue(),
		};
	}

	get businessOwnerDataname(): string {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDataname(this.modelData);
	}
	get businessOwnerDatalegalBusinessName(): string {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDatalegalBusinessName(this.modelData);
	}
	get businessOwnerDatatradeName(): string {
		return this.metalDealersApplicationService.getSummarybusinessOwnerDatatradeName(this.modelData);
	}

	get businessManagerDataname(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDataname(this.modelData);
	}
	get businessManagerDataphoneNumber(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDataphoneNumber(this.modelData);
	}
	get businessManagerDataemailAddress(): string {
		return this.metalDealersApplicationService.getSummarybusinessManagerDataemailAddress(this.modelData);
	}
}
