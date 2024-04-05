import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
	selector: 'app-step-business-licence-employees',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you want to add an employee to this application?"
					info="Your business must have valid security worker licence holders in B.C. that support the various licence categories the business wishes to be licensed for. If your controlling members don't meet this requirement, add employees who do."
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasEmployees">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasEmployees')?.dirty || form.get('hasEmployees')?.touched) &&
									form.get('hasEmployees')?.invalid &&
									form.get('hasEmployees')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row" *ngIf="hasEmployees.value === booleanTypeCodes.Yes">
						<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
							<div class="row mt-4">
								<div class="summary-heading">Security Worker Licence Number</div>
								<div class="col-lg-5 col-md-12">
									<mat-form-field>
										<mat-label>Lookup a licence number</mat-label>
										<input
											matInput
											type="search"
											formControlName="licenceNumberLookup"
											oninput="this.value = this.value.toUpperCase()"
											maxlength="10"
										/>
										<mat-error *ngIf="form.get('licenceNumberLookup')?.hasError('required')">
											This is required
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-lg-4 col-md-12">
									<button mat-flat-button color="primary" class="large" (click)="onSearch()">Search</button>
								</div>
							</div>

							<div class="row mt-4" *ngIf="dataSource.data.length > 0" @showHideTriggerSlideAnimation>
								<div class="col-12">
									<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

									<div class="text-minor-heading mb-2">Added employees</div>

									<mat-table [dataSource]="dataSource">
										<ng-container matColumnDef="fullName">
											<mat-header-cell *matHeaderCellDef>Full Name</mat-header-cell>
											<mat-cell *matCellDef="let member">
												<span class="mobile-label">Full Name:</span>
												{{ member.fullName | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="licenceNumber">
											<mat-header-cell *matHeaderCellDef>Security Worker Licence Number</mat-header-cell>
											<mat-cell *matCellDef="let member">
												<span class="mobile-label">Security Worker Licence Number:</span>
												{{ member.licenceNumber | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="action1">
											<mat-header-cell *matHeaderCellDef></mat-header-cell>
											<mat-cell *matCellDef="let member; let i = index">
												<button
													mat-flat-button
													class="table-button w-auto"
													style="color: var(--color-red);"
													aria-label="Remove controlling member"
													(click)="onRemoveRow(i)"
												>
													<mat-icon>delete_outline</mat-icon>Remove
												</button>
											</mat-cell>
										</ng-container>

										<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
										<mat-row *matRowDef="let row; columns: columns"></mat-row>
									</mat-table>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [
		`
			.mat-column-action1 {
				min-width: 150px;
				max-width: 150px;
				.table-button {
					min-width: 130px;
				}
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBusinessLicenceEmployeesComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.businessApplicationService.employeesFormGroup;

	memberList: Array<any> = [];

	dataSource!: MatTableDataSource<any>;
	columns: string[] = ['fullName', 'licenceNumber', 'action1'];

	constructor(
		private utilService: UtilService,
		private hotToastService: HotToastService,
		private businessApplicationService: BusinessApplicationService
	) {}

	ngOnInit(): void {
		this.memberList = [
			{
				id: 1,
				fullName: 'Barbara Streisand',
				licenceNumber: '7465766',
			},
			{
				id: 2,
				fullName: 'Yank Alexander',
				licenceNumber: '2345433',
			},
			{
				id: 3,
				fullName: 'Anderson Cooper',
				licenceNumber: '898778',
			},
		];
		this.dataSource = new MatTableDataSource(this.memberList);
		this.onSortData();
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	onRemoveRow(index: number) {
		this.memberList.splice(index, 1);
		this.dataSource = new MatTableDataSource(this.memberList);
	}

	onSearch(): void {
		const fullName = 'Timothy Test';
		this.memberList.push({
			id: 1,
			fullName,
			licenceNumber: '87657453',
			licenceStatus: 'Valid',
		});
		this.hotToastService.success(`${fullName} was added to your list of employees`);
		this.onSortData();
	}

	onSortData() {
		this.memberList = [...this.memberList].sort((a, b) => {
			return this.utilService.sortByDirection(a.fullName, b.fullName, 'asc');
		});
		this.dataSource.data = this.memberList;
	}

	get hasEmployees(): FormControl {
		return this.form.get('hasEmployees') as FormControl;
	}
	get employeesArray(): FormArray {
		return <FormArray>this.form.get('employees');
	}
}
