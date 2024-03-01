import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { HotToastService } from '@ngneat/hot-toast';
import { BcBranchEditModalComponent } from './bc-branch-edit-modal.component';

export interface BranchResponse {
	id?: null | number;
	addressSelected?: null | boolean;
	addressLine1?: null | string;
	addressLine2?: null | string;
	city?: null | string;
	country?: null | string;
	postalCode?: null | string;
	province?: null | string;
	managerName?: null | string;
	managerSwlNumber?: null | string;
	managerPhoneNumber?: null | string;
	managerEmail?: null | string;
}

@Component({
	selector: 'app-step-business-licence-bc-branches',
	template: `
		<section class="step-section">
			<div class="step">
				<!-- <ng-container *ngIf="isRenewalOrUpdate">
					<app-common-update-renewal-alert
						[applicationTypeCode]="applicationTypeCode"
					></app-common-update-renewal-alert>
				</ng-container> -->

				<app-step-title title="Does your business have any branches in B.C.?"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasBranchesInBc">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasBranchesInBc')?.dirty || form.get('hasBranchesInBc')?.touched) &&
									form.get('hasBranchesInBc')?.invalid &&
									form.get('hasBranchesInBc')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div class="row mt-4" *ngIf="hasBranchesInBc.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
						<div class="col-xxl-10 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading mb-2">Branches in B.C.</div>
							<div class="row mb-2">
								<div class="col-12">
									<mat-table
										[dataSource]="dataSource"
										(matSortChange)="onSortData($event)"
										matSortActive="city"
										matSortDirection="asc"
										matSort
									>
										<ng-container matColumnDef="addressLine1">
											<mat-header-cell *matHeaderCellDef>Address Line 1</mat-header-cell>
											<mat-cell *matCellDef="let branch">
												<span class="mobile-label">Address Line 1:</span>
												{{ branch.addressLine1 | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="city">
											<mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by city"
												>City</mat-header-cell
											>
											<mat-cell *matCellDef="let branch">
												<span class="mobile-label">City:</span>
												{{ branch.city | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="managerName">
											<mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by manager name"
												>Manager</mat-header-cell
											>
											<mat-cell *matCellDef="let branch">
												<span class="mobile-label">Manager:</span>
												{{ branch.managerName | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="action1">
											<mat-header-cell *matHeaderCellDef></mat-header-cell>
											<mat-cell *matCellDef="let branch">
												<button
													mat-flat-button
													class="table-button w-auto"
													style="color: var(--color-green);"
													aria-label="Edit branch"
													(click)="onEditBranch(branch)"
												>
													<mat-icon>edit</mat-icon>Edit
												</button>
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="action2">
											<mat-header-cell *matHeaderCellDef></mat-header-cell>
											<mat-cell *matCellDef="let branch; let i = index">
												<button
													mat-flat-button
													class="table-button w-auto"
													style="color: var(--color-red);"
													aria-label="Remove branch"
													(click)="onRemoveBranch(i)"
												>
													<mat-icon>delete_outline</mat-icon>Remove
												</button>
											</mat-cell>
										</ng-container>

										<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
										<mat-row *matRowDef="let row; columns: columns"></mat-row>
									</mat-table>
									<button mat-stroked-button (click)="onAddBranch()" class="large mt-3 w-auto">
										<mat-icon class="add-icon">add_circle</mat-icon>Add Another Branch
									</button>
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

			.mat-column-action2 {
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
export class StepBusinessLicenceBcBranchesComponent implements OnInit, AfterViewInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.businessApplicationService.branchesInBcFormGroup;

	branchList: Array<BranchResponse> = [];

	dataSource!: MatTableDataSource<BranchResponse>;
	columns: string[] = ['addressLine1', 'city', 'managerName', 'action1', 'action2'];

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private utilService: UtilService,
		private dialog: MatDialog,
		private businessApplicationService: BusinessApplicationService,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		this.branchList = [
			{
				id: 1,
				addressSelected: true,
				addressLine1: '2344 Douglas Street',
				addressLine2: 'xxx',
				city: 'Timmons',
				country: 'xxx',
				postalCode: 'xxx',
				province: 'xxx',
				managerName: 'Barbara Streisand',
				managerSwlNumber: 'xxx',
				managerPhoneNumber: '5551228787',
				managerEmail: 'xxx@xxx.com',
			},
			{
				id: 2,
				addressSelected: true,
				addressLine1: '2344 Douglas Street',
				addressLine2: 'xxx',
				city: 'Parksville',
				country: 'xxx',
				postalCode: 'xxx',
				province: 'xxx',
				managerName: 'Jason Alexander',
				managerSwlNumber: 'xxx',
				managerPhoneNumber: '3331228787',
				managerEmail: 'xxx@xxx.com',
			},
			{
				id: 3,
				addressSelected: true,
				addressLine1: '5656 Blenkinsop Street',
				addressLine2: 'zzz',
				city: 'Victoria',
				country: 'zzz',
				postalCode: 'zzz',
				province: 'zzz',
				managerName: 'Anderson Cooper',
				managerSwlNumber: 'zzz',
				managerPhoneNumber: '5551228799',
				managerEmail: 'zzz@zzz.com',
			},
		];
		this.dataSource = new MatTableDataSource(this.branchList);
		this.onSortData({
			active: 'city',
			direction: 'asc',
		});
	}

	ngAfterViewInit(): void {
		this.dataSource.sort = this.sort;
	}

	isFormValid(): boolean {
		// TODO do I need to load data manually into formgroup?
		// const aliasesArray = this.licenceModelFormGroup.get('aliasesData.aliases') as FormArray;
		// resp.aliases?.forEach((alias: Alias) => {
		// 	aliasesArray.push(
		// 		new FormGroup({
		// 			givenName: new FormControl(alias.givenName),
		// 			middleName1: new FormControl(alias.middleName1),
		// 			middleName2: new FormControl(alias.middleName2),
		// 			surname: new FormControl(alias.surname, [FormControlValidators.required]),
		// 		})
		// 	);
		// });

		// this.licenceModelFormGroup.setControl('aliasesData.aliases', aliasesArray);

		this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	onEditBranch(branch: BranchResponse): void {
		this.branchDialog(branch, false);
	}

	onRemoveBranch(index: number): void {
		this.branchList.splice(index, 1);
		this.dataSource = new MatTableDataSource(this.branchList);
	}

	onSortData(sort: Sort) {
		if (!sort.active || !sort.direction) {
			return;
		}

		this.branchList = [...this.branchList].sort((a, b) => {
			switch (sort.active) {
				case 'city':
					return this.utilService.sortByDirection(a.city, b.city, sort.direction);
				case 'managerName':
					return this.utilService.sortByDirection(a.managerName, b.managerName, sort.direction);
				default:
					return 0;
			}
		});
		this.dataSource.data = this.branchList;
	}

	onAddBranch(): void {
		this.branchDialog({}, true);
	}

	private branchDialog(dialogOptions: BranchResponse, isCreate: boolean): void {
		this.dialog
			.open(BcBranchEditModalComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				console.log('resp', resp);
				if (resp) {
					if (isCreate) {
						this.branchList.push(resp.data);
						this.hotToastService.success('Branch was successfully added');
					} else {
						const branchIndex = this.branchList.findIndex((item) => item.id == dialogOptions.id!);
						if (branchIndex >= 0) {
							this.branchList[branchIndex] = resp.data;
							this.dataSource.data = this.branchList;
						}
						this.hotToastService.success('Branch was successfully updated');
					}
					this.dataSource.sort = this.sort;
				}
			});
	}

	get hasBranchesInBc(): FormControl {
		return this.form.get('hasBranchesInBc') as FormControl;
	}
	get branchesArray(): FormArray {
		return <FormArray>this.form.get('branches');
	}
}
