import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { UtilService } from '@app/core/services/util.service';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { HotToastService } from '@ngneat/hot-toast';
import { ModalMemberWithoutSwlEditComponent } from './modal-member-without-swl-edit.component';

@Component({
	selector: 'app-step-business-licence-controlling-member-without-swl', // TODO delete this component?
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do any of your controlling members NOT have valid security worker licences?"
					subtitle="Add all controlling members of this business without an active security worker licence"
				></app-step-title>

				<div class="row">
					<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
						<app-alert type="warning" icon="warning">
							Controlling members who are not licensed security workers must consent to criminal, police information and
							correctional service record checks. These checks help the Registrar determine whether or not to approve
							your security business application.
						</app-alert>
					</div>
				</div>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasMembersWithoutSwl">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasMembersWithoutSwl')?.dirty || form.get('hasMembersWithoutSwl')?.touched) &&
									form.get('hasMembersWithoutSwl')?.invalid &&
									form.get('hasMembersWithoutSwl')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div
						class="row mt-4"
						*ngIf="hasMembersWithoutSwl.value === booleanTypeCodes.Yes"
						@showHideTriggerSlideAnimation
					>
						<div class="col-xxl-10 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading mb-2">Added controlling members without a security worker licence</div>

							<div class="row mb-2">
								<div class="col-12">
									<mat-table
										[dataSource]="dataSource"
										(matSortChange)="onSortData($event)"
										matSortActive="surname"
										matSortDirection="asc"
										matSort
									>
										<ng-container matColumnDef="givenName">
											<mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by given name">
												Given Name
											</mat-header-cell>
											<mat-cell *matCellDef="let member">
												<span class="mobile-label">Given Name:</span>
												{{ member.givenName | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="middleNames">
											<mat-header-cell *matHeaderCellDef>Middle Names</mat-header-cell>
											<mat-cell *matCellDef="let member">
												<span class="mobile-label">Middle Names:</span>
												{{ member.middleName1 | default }} {{ member.middleName2 | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="surname">
											<mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by surname">
												Surname
											</mat-header-cell>
											<mat-cell *matCellDef="let member">
												<span class="mobile-label">Surname:</span>
												{{ member.surname | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="emailAddress">
											<mat-header-cell *matHeaderCellDef>Email Address</mat-header-cell>
											<mat-cell *matCellDef="let member">
												<span class="mobile-label">Email Address:</span>
												{{ member.emailAddress | default }}
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="action1">
											<mat-header-cell *matHeaderCellDef></mat-header-cell>
											<mat-cell *matCellDef="let member">
												<button
													mat-flat-button
													class="table-button w-auto"
													style="color: var(--color-green);"
													aria-label="Edit member"
													(click)="onEditMember(member)"
												>
													<mat-icon>edit</mat-icon>Edit
												</button>
											</mat-cell>
										</ng-container>

										<ng-container matColumnDef="action2">
											<mat-header-cell *matHeaderCellDef></mat-header-cell>
											<mat-cell *matCellDef="let member; let i = index">
												<button
													mat-flat-button
													class="table-button w-auto"
													style="color: var(--color-red);"
													aria-label="Remove member"
													(click)="onRemoveMember(i)"
												>
													<mat-icon>delete_outline</mat-icon>Remove
												</button>
											</mat-cell>
										</ng-container>

										<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
										<mat-row *matRowDef="let row; columns: columns"></mat-row>
									</mat-table>
									<button mat-stroked-button (click)="onAddMember()" class="large mt-3 w-auto">
										<mat-icon class="add-icon">add_circle</mat-icon>Add Another Member
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
export class StepBusinessLicenceControllingMemberWithoutSwlComponent
	implements OnInit, AfterViewInit, LicenceChildStepperStepComponent
{
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = new FormGroup({}); //  = this.businessApplicationService.membersWithoutSwlFormGroup;

	memberList: Array<any> = [];

	dataSource!: MatTableDataSource<any>;
	columns: string[] = ['givenName', 'middleNames', 'surname', 'emailAddress', 'action1', 'action2'];

	@ViewChild(MatSort) sort!: MatSort;

	constructor(
		private utilService: UtilService,
		private dialog: MatDialog,
		private businessApplicationService: BusinessApplicationService,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		this.memberList = [
			{
				id: 1,
				givenName: 'Tim',
				middleName1: 'Tank',
				middleName2: 'Timmons',
				surname: 'Thompson',
				emailAddress: 'xxx@xxx.com',
			},
			{
				id: 2,
				givenName: 'Jason',
				middleName1: null,
				middleName2: null,
				surname: 'Alexander',
				emailAddress: 'yyyy@xxx.com',
			},
		];
		this.dataSource = new MatTableDataSource(this.memberList);
		this.onSortData({
			active: 'surname',
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

	onEditMember(member: any): void {
		this.memberDialog(member, false);
	}

	onRemoveMember(index: number): void {
		this.memberList.splice(index, 1);
		this.dataSource = new MatTableDataSource(this.memberList);
	}

	onSortData(sort: Sort) {
		if (!sort.active || !sort.direction) {
			return;
		}

		this.memberList = [...this.memberList].sort((a, b) => {
			switch (sort.active) {
				case 'givenName':
					return this.utilService.sortByDirection(a.givenName, b.givenName, sort.direction);
				case 'surname':
					return this.utilService.sortByDirection(a.surname, b.surname, sort.direction);
				default:
					return 0;
			}
		});
		this.dataSource.data = this.memberList;
	}

	onAddMember(): void {
		this.memberDialog({}, true);
	}

	private memberDialog(dialogOptions: any, isCreate: boolean): void {
		this.dialog
			.open(ModalMemberWithoutSwlEditComponent, {
				width: '800px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				if (resp) {
					if (isCreate) {
						this.memberList.push(resp.data);
						this.hotToastService.success('Controlling member was successfully added');
					} else {
						const memberIndex = this.memberList.findIndex((item) => item.id == dialogOptions.id!);
						if (memberIndex >= 0) {
							this.memberList[memberIndex] = resp.data;
							this.dataSource.data = this.memberList;
						}
						this.hotToastService.success('Controlling member was successfully updated');
					}
					this.dataSource.sort = this.sort;
				}
			});
	}

	get hasMembersWithoutSwl(): FormControl {
		return this.form.get('hasMembersWithoutSwl') as FormControl;
	}
	get membersArray(): FormArray {
		return <FormArray>this.form.get('members');
	}
}
