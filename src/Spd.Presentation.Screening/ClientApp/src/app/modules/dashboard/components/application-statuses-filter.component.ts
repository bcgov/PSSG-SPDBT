import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseFilterComponent } from 'src/app/shared/components/base-filter.component';

@Component({
	selector: 'app-application-statuses-filter',
	template: `
		<div class="filter-panel">
			<form [formGroup]="formGroup" novalidate>
				<mat-toolbar>
					<span class="fw-bold">Filters</span>
					<button mat-icon-button aria-label="close" (click)="emitFilterClose()">
						<mat-icon>close</mat-icon>
					</button>
				</mat-toolbar>
				<mat-card>
					<mat-card-content class="mb-2 text-start">
						<div class="row">
							<div class="col-sm-12">
								<strong>Statuses</strong>
								<mat-checkbox formControlName="verifyIdentity" class="text-start"> Verify Identity </mat-checkbox>
								<mat-checkbox formControlName="inProgress" class="text-start"> In Progress </mat-checkbox>
								<!-- <mat-checkbox formControlName="payNow" class="text-start"> Pay Now</mat-checkbox>
								<mat-checkbox formControlName="awaitingThirdParty" class="text-start">
									Awaiting Third Party
								</mat-checkbox>
								<mat-checkbox formControlName="awaitingApplicant" class="text-start"> Awaiting Applicant</mat-checkbox>
								<mat-checkbox formControlName="underAssessment" class="text-start"> Under Assessment</mat-checkbox>
								<mat-checkbox formControlName="incomplete" class="text-start"> Incomplete</mat-checkbox>
								<mat-checkbox formControlName="cleared" class="text-start"> Completed - Cleared</mat-checkbox>
								<mat-checkbox formControlName="riskFound" class="text-start"> Completed - Risk Found</mat-checkbox>
								<mat-checkbox formControlName="judicialReview" class="text-start">
									Closed - Judicial Review
								</mat-checkbox>
								<mat-checkbox formControlName="noResponse" class="text-start"> Closed - No Response</mat-checkbox>
								<mat-checkbox formControlName="noApplicantConsent" class="text-start">
									Closed - No Applicant Consent
								</mat-checkbox>
								<mat-checkbox formControlName="cancelledByOrg" class="text-start">
									Cancelled by Organization
								</mat-checkbox>
								<mat-checkbox formControlName="cancelledByAppl" class="text-start">
									Cancelled by Applicant
								</mat-checkbox> -->
							</div>
						</div>
					</mat-card-content>
					<mat-divider class="my-3"></mat-divider>
					<mat-card-actions>
						<button mat-stroked-button class="action-button" (click)="emitFilterClear()">Clear</button>
						<button mat-flat-button class="action-button" color="primary" (click)="emitFilterChange()">Search</button>
					</mat-card-actions>
				</mat-card>
			</form>
		</div>
	`,
	styles: [
		`
			.filter-panel {
				border: 2px solid var(--color-sidebar);
			}

			.mat-toolbar-single-row {
				justify-content: space-between;
				background-color: var(--color-sidebar);
				color: var(--color-white);
			}

			.mat-mdc-card {
				border-radius: 0;
				/* background-color: var(--color-grey-lightest); */
			}

			.mat-mdc-card-actions {
				padding: 0 16px 16px 16px;
				display: flex;
				justify-content: space-between;
			}

			.action-button {
				width: unset;
			}
		`,
	],
})
export class ApplicationStatusesFilterComponent extends BaseFilterComponent {
	@Input() formGroup!: FormGroup;

	constructor(private formBuilder: FormBuilder) {
		super();
	}

	emitFilterChange() {
		this.filterChange.emit();
	}

	override emitFilterClear() {
		this.formGroup.reset();
		this.filterClear.emit();
	}
}
