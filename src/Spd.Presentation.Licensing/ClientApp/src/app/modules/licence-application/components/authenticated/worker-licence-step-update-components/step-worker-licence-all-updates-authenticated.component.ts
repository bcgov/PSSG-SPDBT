import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationTypeCode, BusinessTypeCode, WorkerCategoryTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceUpdateTypeCode } from '@app/core/code-types/model-desc.models';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import {
	LicenceCategoryDialogData,
	WorkerLicenceCategoryUpdateAuthenticatedModalComponent,
} from './worker-licence-category-update-authenticated-modal.component';
import { WorkerLicenceDogsUpdateAuthenticatedModalComponent } from './worker-licence-dogs-update-authenticated-modal.component';
import { WorkerLicenceNameChangeUpdateAuthenticatedModalComponent } from './worker-licence-name-change-update-authenticated-modal.component';
import { WorkerLicencePhotoUpdateAuthenticatedModalComponent } from './worker-licence-photo-update-authenticated-modal.component';
import { WorkerLicenceRestraintsUpdateAuthenticatedModalComponent } from './worker-licence-restraints-update-authenticated-modal.component';

export interface UpdateOptionListData {
	updateTypeCode: LicenceUpdateTypeCode;
	category?: WorkerCategoryTypeCode | null;
	categoryDesc?: string | null;
	label: string;
	allowEdit: boolean;
	allowDelete: boolean;
}

@Component({
	selector: 'app-step-worker-licence-all-updates-authenticated',
	template: `
		<section class="step-section pb-4">
			<div class="step">
				<app-step-title
					title="Update your Licence or Permit"
					[subtitle]="subtitle"
					[showDivider]="true"
				></app-step-title>

				<div class="row">
					<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<div class="fs-4 mb-2">Your update options:</div>
					</div>
				</div>

				<!-- <div class="row">
						<div class="offset-xxl-2 col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<ul class="m-0">
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onApplyNameChangeModal()">Apply your Updated Name</a>
								</li>
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onUpdatePhotoModal()">Update your Photo</a>
								</li>
							</ul>
						</div>

						<div class="col-xxl-4 col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<ul class="m-0">
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onAddLicenceCategory()">Add a Licence Category</a>
								</li>
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onUseRestraintsModal()"
										>Add  Authorization to Use Restraints</a
									>
								</li>
								<li class="my-2">
									<a color="primary" class="large my-2" (click)="onUseDogsModal()"
										>Add  Authorization to Use Dogs</a
									>
								</li>
							</ul>
						</div>
					</div> -->

				<div class="row">
					<div class="offset-xxl-2 col-xxl-3 offset-xl-1 col-xl-4 col-lg-6 col-md-12 col-sm-12">
						<button
							mat-stroked-button
							color="primary"
							(click)="onApplyNameChangeModal()"
							class="large my-2"
							[disabled]="addedUpdateName"
						>
							Apply updated Name
						</button>
						<button
							mat-stroked-button
							color="primary"
							(click)="onUpdatePhotoModal()"
							class="large my-2"
							[disabled]="addedUpdatePhoto"
						>
							Update your Photo
						</button>
					</div>

					<div class="col-xxl-5 col-xl-6 col-lg-6 col-md-12 col-sm-12">
						<button mat-stroked-button color="primary" (click)="onAddLicenceCategory()" class="large my-2">
							Add a Licence Category
						</button>
						<button
							mat-stroked-button
							color="primary"
							class="large my-2"
							(click)="onUseRestraintsModal()"
							[disabled]="addedAuthorizationToUseRestraints"
						>
							Add Authorization to Use Restraints
						</button>
						<button
							mat-stroked-button
							color="primary"
							class="large my-2"
							(click)="onUseDogsModal()"
							[disabled]="addedAuthorizationToUseDogs"
						>
							Add Authorization to Use Dogs
						</button>
					</div>
				</div>

				<div class="row">
					<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<div class="fs-4 mt-3 mb-2">
							<mat-icon class="me-2">shopping_cart</mat-icon>
							Your list of updates:
						</div>
					</div>
				</div>

				<div class="row">
					<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<app-alert type="info" [showBorder]="false" icon="" *ngIf="updates.length === 0">
							No updates have been selected
						</app-alert>
						<div class="summary-card-section mb-2 px-4 py-3" *ngFor="let update of updates; let i = index">
							<div class="row">
								<div class="col-lg-6 col-md-12">
									<div class="fs-6 fw-normal" style="color: var(--color-primary);" [innerHTML]="update.label"></div>
								</div>
								<div class="col-lg-3 col-6">
									<button mat-stroked-button class="mt-2" *ngIf="update.allowEdit" (click)="onEdit(update)">
										<mat-icon>edit</mat-icon>Edit
									</button>
								</div>
								<div class="col-lg-3 col-6">
									<button mat-stroked-button class="mt-2" *ngIf="update.allowDelete" (click)="onRemove(update, i)">
										<mat-icon>delete_outline</mat-icon>Remove
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepWorkerLicenceAllUpdatesAuthenticatedComponent implements OnInit {
	updates: Array<UpdateOptionListData> = [];

	subtitle = '';

	addedUpdateName = false;
	addedUpdatePhoto = false;
	addedAuthorizationToUseRestraints = false;
	addedAuthorizationToUseDogs = false;

	constructor(
		private dialog: MatDialog,
		private currencyPipe: CurrencyPipe,
		private optionsPipe: OptionsPipe,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(
				WorkerLicenceTypeCode.SecurityWorkerLicence,
				ApplicationTypeCode.Update,
				BusinessTypeCode.None
			)
			.find((item) => item.applicationTypeCode === ApplicationTypeCode.Update);

		const licenceFee = fee ? fee.amount ?? null : null;
		const displayFee = this.currencyPipe.transform(licenceFee, 'CAD', 'symbol-narrow', '1.0');

		this.subtitle = `Making one or many of the following edits will incur a TOTAL ${displayFee} licence reprint fee`;
	}

	onEdit(row: UpdateOptionListData) {
		switch (row.updateTypeCode) {
			case LicenceUpdateTypeCode.UpdatePhoto:
				this.onUpdatePhotoModal();
				break;
			case LicenceUpdateTypeCode.AddLicenceCategory:
				this.onEditLicenceCategoryModal(row);
				break;
			case LicenceUpdateTypeCode.AddAuthorizationToUseRestraints:
				this.onUseRestraintsModal();
				break;
			case LicenceUpdateTypeCode.AddAuthorizationToUseDogs:
				this.onUseDogsModal();
				break;
		}
	}

	onRemove(row: UpdateOptionListData, i: number) {
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

					switch (row.updateTypeCode) {
						case LicenceUpdateTypeCode.UpdateName:
							this.addedUpdateName = false;
							break;
						case LicenceUpdateTypeCode.UpdatePhoto:
							this.addedUpdatePhoto = false;
							break;
						case LicenceUpdateTypeCode.AddAuthorizationToUseRestraints:
							this.addedAuthorizationToUseRestraints = false;
							break;
						case LicenceUpdateTypeCode.AddAuthorizationToUseDogs:
							this.addedAuthorizationToUseDogs = false;
							break;
					}
				}
			});
	}

	onApplyNameChangeModal(): void {
		// const dialogOptions: ApplyNameChangeDialogData = {};

		this.dialog
			.open(WorkerLicenceNameChangeUpdateAuthenticatedModalComponent, {
				// data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				if (resp.success) {
					this.addedUpdateName = true;

					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.UpdateName,
						label: 'Apply New Name: <b>Joanna Lee</b>',
						allowEdit: false,
						allowDelete: true,
					});
				}
			});
	}

	onUpdatePhotoModal(): void {
		// const data: UpdatePhotoDialogData = {};

		this.dialog
			.open(WorkerLicencePhotoUpdateAuthenticatedModalComponent, {
				width: '1000px',
				// data,
			})
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.addedUpdatePhoto = true;

					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.UpdatePhoto,
						label: 'Update your Photo',
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}

	onEditLicenceCategoryModal(row: UpdateOptionListData): void {
		const dialogOptions: LicenceCategoryDialogData = { category: row.category! };

		this.dialog
			.open(WorkerLicenceCategoryUpdateAuthenticatedModalComponent, {
				width: '1000px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe();
	}

	onAddLicenceCategory(): void {
		const dialogOptions: LicenceCategoryDialogData = { category: null };

		this.dialog
			.open(WorkerLicenceCategoryUpdateAuthenticatedModalComponent, {
				width: '1000px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((resp) => {
				const category = resp.data?.category;
				if (category) {
					const categoryDesc = this.optionsPipe.transform(category, 'WorkerCategoryTypes');

					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.AddLicenceCategory,
						category: category,
						categoryDesc: categoryDesc,
						label: `Add Licence Category: <b>${categoryDesc}</b>`,
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}

	onUseRestraintsModal(): void {
		// const data: RestraintAuthorizationDialogData = {};

		this.dialog
			.open(WorkerLicenceRestraintsUpdateAuthenticatedModalComponent, {
				width: '1000px',
				// data,
			})
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.addedAuthorizationToUseRestraints = true;

					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.AddAuthorizationToUseRestraints,
						label: 'Add Authorization to use Restraints',
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}

	onUseDogsModal(): void {
		// const data: DogAuthorizationDialogData = {};

		this.dialog
			.open(WorkerLicenceDogsUpdateAuthenticatedModalComponent, {
				width: '1000px',
				// data,
			})
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.addedAuthorizationToUseDogs = true;

					this.updates.push({
						updateTypeCode: LicenceUpdateTypeCode.AddAuthorizationToUseDogs,
						label: 'Add Authorization to use Dogs',
						allowEdit: true,
						allowDelete: true,
					});
				}
			});
	}
}
