import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LicenceUpdateTypeCode } from 'src/app/core/code-types/model-desc.models';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import {
	DogAuthorizationDialogData,
	UpdateAddDogsModalComponent,
} from '../../components/update-add-dogs-modal.component';
import {
	RestraintAuthorizationDialogData,
	UpdateAddRestraintsModalComponent,
} from '../../components/update-add-restraints-modal.component';
import {
	ApplyNameChangeDialogData,
	UpdateApplyNameChangeModalComponent,
} from '../../components/update-apply-name-change-modal.component';
import {
	LicenceCategoryDialogData,
	UpdateLicenceCategoryModalComponent,
} from '../../components/update-licence-category-modal.component';
import { UpdatePhotoDialogData, UpdatePhotoModalComponent } from '../../components/update-photo-modal.component';

export interface UpdateOptionListData {
	updateTypeCode: LicenceUpdateTypeCode;
	label: string;
	allowEdit: boolean;
	allowDelete: boolean;
}

@Component({
	selector: 'app-step-licence-updates',
	template: `
		<section class="step-section p-3 pb-4">
			<div class="step">
				<app-step-title
					title="Update your Licence or Permit"
					subtitle="Making one or many of the following edits will incur a TOTAL $20 licence reprint fee"
					[showDivider]="true"
				></app-step-title>

				<div class="step-container">
					<div class="row">
						<div class="col-xxl-8 col-xl-9 col-lg-10 col-md-12 col-sm-12 mx-auto">
							<div class="fs-4 mb-2">Your update options:</div>
							<div class="fs-6 mb-2">You may update one or more the following.</div>
						</div>
					</div>

					<div class="row">
						<div class="offset-xxl-2 col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<ul class="m-0">
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onApplyNameChange()">Apply your Updated Name</a>
								</li>
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onUpdatePhoto()">Update your Photo</a>
								</li>
							</ul>
						</div>

						<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<ul class="m-0">
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onAddLicenceCategory()">Add a Licence Category</a>
								</li>
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onAddUseRestraints()"
										>Add Request Authorization to Use Restraints</a
									>
								</li>
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onAddUseDogs()"
										>Add Request Authorization to Use Dogs</a
									>
								</li>
							</ul>
						</div>
					</div>

					<!-- <div class="row">
						<div class="offset-xxl-2 col-xxl-3 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<button mat-flat-button color="primary" (click)="onApplyNameChange()" class="large my-2">
								Apply your Updated Name
							</button>
							<button mat-flat-button color="primary" (click)="onUpdatePhoto()" class="large my-2">Update your Photo</button>
						</div>

						<div class="col-xxl-5 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<button mat-flat-button color="primary" (click)="onAddLicenceCategory()" class="large my-2">
								Add a Licence Category
							</button>
							<button mat-flat-button color="primary" class="large my-2" (click)="onAddUseRestraints()">
								Add Request Authorization to Use Restraints
							</button>
							<button mat-flat-button color="primary" class="large my-2" (click)="onAddUseDogs()">Add Request Authorization to Use Dogs</button>
						</div>
					</div> -->

					<div class="row">
						<div class="col-xxl-8 col-xl-9 col-lg-10 col-md-12 col-sm-12 mx-auto">
							<div class="fs-4 mt-3 mb-2">
								<mat-icon class="me-2">shopping_cart</mat-icon>
								Your list of updates:
							</div>
						</div>
					</div>

					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<app-alert type="info" icon="" *ngIf="updates.length == 0"> No updates have been selected </app-alert>
							<div class="card-section mb-2 px-4 py-3" *ngFor="let update of updates; let i = index">
								<div class="row">
									<div class="col-lg-6 col-md-12">
										<div class="fs-6 fw-normal" style="color: var(--color-primary);" [innerHTML]="update.label"></div>
									</div>
									<div class="col-lg-3 col-md-12">
										<button mat-stroked-button *ngIf="update.allowEdit" (click)="onEdit(update)">
											<mat-icon>edit</mat-icon>Edit
										</button>
									</div>
									<div class="col-lg-3 col-md-12">
										<button mat-stroked-button *ngIf="update.allowDelete" (click)="onRemove(i)">
											<mat-icon>delete_outline</mat-icon>Remove
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			small {
				color: var(--color-grey-dark);
				line-height: 1.3em;
			}

			.text-data {
				font-weight: 500;
			}

			.card-section {
				background-color: #ededed !important;
				border-left: 3px solid #38598a;
				border-bottom-width: 1px;
				border-bottom-style: solid;
				border-bottom-color: rgba(0, 0, 0, 0.12);
			}
		`,
	],
})
export class StepLicenceUpdatesComponent {
	updates: Array<UpdateOptionListData> = [];

	constructor(private dialog: MatDialog) {}

	onEdit(row: UpdateOptionListData) {
		switch (row.updateTypeCode) {
			case LicenceUpdateTypeCode.UpdatePhoto:
				this.onUpdatePhoto();
				break;
			case LicenceUpdateTypeCode.AddLicenceCategory:
				this.onAddLicenceCategory();
				break;
			case LicenceUpdateTypeCode.AddRequestAuthorizationToUseRestraints:
				this.onAddUseRestraints();
				break;
			case LicenceUpdateTypeCode.AddRequestAuthorizationToUseDogs:
				this.onAddUseDogs();
				break;
		}
	}

	onRemove(i: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this update?',
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.updates.splice(i, 1);
				}
			});
	}

	onApplyNameChange(): void {
		const dialogOptions: ApplyNameChangeDialogData = {};

		this.dialog
			.open(UpdateApplyNameChangeModalComponent, {
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp.success) {
					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.UpdateName,
						label: 'Apply new name: <b>Joanna Lee</b>',
						allowEdit: false,
						allowDelete: true,
					});
				}
			});
	}

	onUpdatePhoto(): void {
		const data: UpdatePhotoDialogData = {};

		this.dialog
			.open(UpdatePhotoModalComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.UpdatePhoto,
						label: 'Update your photo',
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}

	onAddLicenceCategory(): void {
		const dialogOptions: LicenceCategoryDialogData = {};

		this.dialog
			.open(UpdateLicenceCategoryModalComponent, {
				width: '900px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp.success) {
					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.AddLicenceCategory,
						label: 'Add Licence Category: <b>Locksmith</b>',
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}

	onAddUseRestraints(): void {
		const data: RestraintAuthorizationDialogData = {};

		this.dialog
			.open(UpdateAddRestraintsModalComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.AddRequestAuthorizationToUseRestraints,
						label: 'Add Request Authorization to use restraints',
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}

	onAddUseDogs(): void {
		const data: DogAuthorizationDialogData = {};

		this.dialog
			.open(UpdateAddDogsModalComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.AddRequestAuthorizationToUseDogs,
						label: 'Add Request Authorization to use dogs',
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}
}
