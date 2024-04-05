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
	selector: 'app-step-business-licence-controlling-member-with-swl',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Add all controlling members of this business"
					info="<a class='large' href='https://www2.gov.bc.ca/gov/content/employment-business/business/security-services/security-industry-licensing/businesses/rules'>Controlling members</a> who are also licensed security workers must provide their licence number to the Registrar of Security Services when the business applies for a licence."
				>
				</app-step-title>

				<div class="row">
					<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
						<app-alert type="warning" icon="warning">
							Controlling members who are not licensed security workers must consent to criminal, police information and
							correctional service record checks. These checks help the Registrar determine whether or not to approve
							your security business application.
						</app-alert>
					</div>
				</div>

				<app-step-title
					title="Do any of your controlling members have valid security worker licences?"
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasMembersWithSwl">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasMembersWithSwl')?.dirty || form.get('hasMembersWithSwl')?.touched) &&
									form.get('hasMembersWithSwl')?.invalid &&
									form.get('hasMembersWithSwl')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mt-4" *ngIf="hasMembersWithSwl.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
						<div class="col-xxl-10 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
							<div class="row">
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

							<div class="row mt-4" *ngIf="dataSource.data.length > 0">
								<div class="col-12">
									<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

									<div class="text-minor-heading mb-2">Added controlling members with a security worker licence</div>

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
export class StepBusinessLicenceControllingMemberWithSwlComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.businessApplicationService.membersWithSwlFormGroup;

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
		this.hotToastService.success('Controlling member was successfully added');
		this.onSortData();
	}

	onSortData() {
		this.memberList = [...this.memberList].sort((a, b) => {
			return this.utilService.sortByDirection(a.fullName, b.fullName, 'asc');
		});
		this.dataSource.data = this.memberList;
	}

	get hasMembersWithSwl(): FormControl {
		return this.form.get('hasMembersWithSwl') as FormControl;
	}
	get membersArray(): FormArray {
		return <FormArray>this.form.get('members');
	}
}
