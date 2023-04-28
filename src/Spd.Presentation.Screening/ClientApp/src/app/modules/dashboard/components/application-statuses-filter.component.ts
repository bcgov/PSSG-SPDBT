import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UtilService } from 'src/app/core/services/util.service';
import { BaseFilterComponent, FilterQueryList } from 'src/app/shared/components/base-filter.component';

export const ApplicationStatusFiltersTypes = [
	{ desc: 'Verify Identity', code: 'verifyIdentity' },
	{ desc: 'In Progress', code: 'inProgress' },
	{ desc: 'Pay Now', code: 'payNow' },
	{ desc: 'Awaiting Third Party', code: 'awaitingThirdParty' },
	{ desc: 'Awaiting Applicant', code: 'awaitingApplicant' },
	{ desc: 'Under Assessment', code: 'underAssessment' },
	{ desc: 'Incomplete', code: 'incomplete' },
	{ desc: 'Completed - Cleared', code: 'cleared' },
	{ desc: 'Completed - Risk Found', code: 'riskFound' },
	{ desc: 'Closed - Judicial Review', code: 'judicialReview' },
	{ desc: 'Closed - No Response', code: 'noResponse' },
	{ desc: 'Closed - No Applicant Consent', code: 'noApplicantConsent' },
	{ desc: 'Cancelled by Organization', code: 'cancelledByOrg' },
	{ desc: 'Cancelled by Applicant', code: 'cancelledByAppl' },
];

export class ApplicationStatusFilter {
	search: string = '';
	statuses: string[] = [];
	applicantName: string = '';
	createdOn: string = '';
	contractedCompanyName: string = '';
}

export const ApplicationStatusFilterMap: Record<keyof ApplicationStatusFilter, string> = {
	search: 'searchBe',
	statuses: 'statusCodeBe',
	applicantName: 'applicantNameBe',
	createdOn: 'createdOn',
	contractedCompanyName: 'contractedCompanyName',
};

@Component({
	selector: 'app-application-statuses-filter',
	template: `
		<div class="filter-container mat-elevation-z8">
			<form [formGroup]="formGroup" novalidate>
				<mat-toolbar>
					<span class="fw-bold">Filters</span>
					<button mat-icon-button aria-label="close" (click)="emitFilterClose()">
						<mat-icon>close</mat-icon>
					</button>
				</mat-toolbar>
				<mat-card>
					<mat-card-content class="mb-2 text-start">
						<mat-form-field class="status-filter" style="min-width: 600px; min-height: 200px">
							<mat-label>Filter by status</mat-label>
							<mat-select formControlName="statuses" placeholder="All statuses" multiple>
								<mat-select-trigger>
									<mat-chip-listbox>
										<mat-chip
											*ngFor="let status of statuses.value"
											[removable]="true"
											(removed)="onItemRemoved(status)"
											selected
										>
											{{ getStatusDesc(status) }}
											<mat-icon matChipRemove>cancel</mat-icon>
										</mat-chip>
									</mat-chip-listbox>
								</mat-select-trigger>

								<mat-option *ngFor="let status of applicationStatusFiltersTypes" [value]="status.code">
									{{ status.desc }}
								</mat-option>
							</mat-select>
						</mat-form-field>
					</mat-card-content>
					<mat-divider class="my-3"></mat-divider>
					<mat-card-actions>
						<button mat-stroked-button class="large action-button" (click)="emitFilterClear()">Clear</button>
						<button mat-flat-button class="large action-button" color="primary" (click)="emitFilterChange()">
							Search
						</button>
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

			.status-column {
				max-width: 15em;
			}

			.action-button {
				width: unset;
			}
		`,
	],
})
export class ApplicationStatusesFilterComponent extends BaseFilterComponent {
	applicationStatusFiltersTypes = ApplicationStatusFiltersTypes;

	@Input() formGroup!: FormGroup;

	constructor(private formBuilder: FormBuilder, private utilService: UtilService) {
		super();
	}

	onItemRemoved(item: string) {
		const items = [...this.statuses.value] as string[];
		this.utilService.removeFirst(items, item);
		this.statuses.setValue(items); // To trigger change detection
	}

	emitFilterChange() {
		this.filterChange.emit(this.constructFilterString(this.constructFilterList(this.formGroup.value)));
	}

	override emitFilterClear() {
		this.formGroup.reset();
		this.filterClear.emit();
	}

	getStatusDesc(code: string): string {
		return ApplicationStatusFiltersTypes.find((item) => item.code == code)?.desc ?? '';
	}

	private constructFilterList(formGroupValue: ApplicationStatusFilter): FilterQueryList[] {
		let filterList: FilterQueryList[] = [];

		if (formGroupValue.statuses?.length > 0) {
			filterList.push({
				key: ApplicationStatusFilterMap['statuses'],
				operator: 'caseInsensitiveStringContains',
				value: formGroupValue.statuses.join('|'),
			});
		}

		return filterList;
	}

	get statuses(): FormControl {
		return this.formGroup.get('statuses') as FormControl;
	}
}
