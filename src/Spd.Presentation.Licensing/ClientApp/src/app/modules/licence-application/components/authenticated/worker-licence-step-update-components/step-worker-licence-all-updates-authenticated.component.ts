import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationTypeCode, BusinessTypeCode, WorkerCategoryTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { LicenceUpdateTypeCode } from '@app/core/code-types/model-desc.models';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import {
	LicenceCategoryDialogData,
	WorkerLicenceCategoryUpdateAuthenticatedModalComponent,
} from './worker-licence-category-update-authenticated-modal.component';
import { WorkerLicenceDogsUpdateAuthenticatedModalComponent } from './worker-licence-dogs-update-authenticated-modal.component';
import {
	ApplyNameChangeDialogData,
	WorkerLicenceNameChangeUpdateAuthenticatedModalComponent,
} from './worker-licence-name-change-update-authenticated-modal.component';
import { WorkerLicencePhotoUpdateAuthenticatedModalComponent } from './worker-licence-photo-update-authenticated-modal.component';
import { WorkerLicenceRestraintsUpdateAuthenticatedModalComponent } from './worker-licence-restraints-update-authenticated-modal.component';

export interface UpdateOptionListData {
	updateTypeCode: LicenceUpdateTypeCode;
	category?: WorkerCategoryTypeCode | null;
	categoryDesc?: string | null;
	label: string;
	allowEdit: boolean;
	allowView: boolean;
	allowDelete: boolean;
}

@Component({
	selector: 'app-step-worker-licence-all-updates-authenticated',
	template: `
		<section class="step-section pb-4">
			<div class="step">
				<app-step-title [title]="title" [subtitle]="subtitle" [showDivider]="true"></app-step-title>

				<div class="row">
					<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<div class="section-title fs-5 mb-2">Your update options</div>
						<div class="row">
							<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12" *ngIf="hasGenderChanged">
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

							<ng-container *ngIf="isLicence">
								<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12">
									<button mat-stroked-button color="primary" (click)="onAddLicenceCategory()" class="large my-2">
										Add a Licence Category
									</button>
								</div>

								<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12">
									<button
										mat-stroked-button
										color="primary"
										class="large my-2"
										(click)="onUseRestraintsModal()"
										[disabled]="addedAuthorizationToUseRestraints"
									>
										Add Authorization to Use Restraints
									</button>
								</div>

								<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12">
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
							</ng-container>

							<ng-container *ngIf="isPermit">
								<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12">
									<button mat-stroked-button color="primary" (click)="onAddLicenceCategory()" class="large my-2">
										Update Purpose
									</button>
								</div>
								<div class="col-xxl-6 col-xl-6 col-lg-12 col-md-12 col-sm-12">
									<button
										mat-stroked-button
										color="primary"
										class="large my-2"
										(click)="onUseRestraintsModal()"
										[disabled]="addedAuthorizationToUseRestraints"
									>
										Update Rationale
									</button>
								</div>
							</ng-container>
						</div>

						<div class="row">
							<div class="col-12">
								<mat-divider class="my-4"></mat-divider>
								<div class="section-title fs-5 my-3">Your list of updates</div>
							</div>
							<div class="col-12">
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
												Edit
											</button>
										</div>
										<div class="col-lg-3 col-6">
											<button mat-stroked-button class="mt-2" *ngIf="update.allowView" (click)="onView()">
												Review
											</button>
											<button mat-stroked-button class="mt-2" *ngIf="update.allowDelete" (click)="onRemove(update, i)">
												Remove
											</button>
										</div>
									</div>
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
	licenceModelData: any = {};
	updates: Array<UpdateOptionListData> = [];

	title = '';
	subtitle = '';

	addedUpdateName = false;
	addedUpdatePhoto = false;
	addedAuthorizationToUseRestraints = false;
	addedAuthorizationToUseDogs = false;

	constructor(
		private dialog: MatDialog,
		private currencyPipe: CurrencyPipe,
		private optionsPipe: OptionsPipe,
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceModelData = { ...this.licenceApplicationService.licenceModelFormGroup.getRawValue() };

		const fee = this.commonApplicationService
			.getLicenceTermsAndFees(
				WorkerLicenceTypeCode.SecurityWorkerLicence,
				ApplicationTypeCode.Update,
				BusinessTypeCode.None
			)
			.find((item) => item.applicationTypeCode === ApplicationTypeCode.Update);

		const licenceFee = fee ? fee.amount ?? null : null;
		const displayFee = this.currencyPipe.transform(licenceFee, 'CAD', 'symbol-narrow', '1.0');

		const label = this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence ? 'Licence' : 'Permit';
		this.title = `Update your ${label}`;
		this.subtitle = `Making one or many of the following edits will incur a TOTAL ${displayFee} licence reprint fee`;

		if (this.hasBcscNameChanged) {
			this.addedUpdateName = true;

			this.updates.push({
				updateTypeCode: LicenceUpdateTypeCode.UpdateName,
				label: `Apply new name:<br/><b>${this.licenceHolderName}</b>`,
				allowEdit: false,
				allowView: true,
				allowDelete: false,
			});
		}
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

	onView() {
		this.onReviewNameChangeModal();
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

	onReviewNameChangeModal(): void {
		const dialogOptions: ApplyNameChangeDialogData = {
			cardHolderName: this.cardHolderName,
			licenceHolderName: this.licenceHolderName,
		};

		this.dialog.open(WorkerLicenceNameChangeUpdateAuthenticatedModalComponent, {
			data: dialogOptions,
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
						label: 'Update your photo',
						allowEdit: true,
						allowView: false,
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
						label: `Add licence category:<br/><b>${categoryDesc}</b>`,
						allowEdit: true,
						allowView: false,
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
						label: 'Add authorization to use restraints',
						allowEdit: true,
						allowView: false,
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
						label: 'Add authorization to use dogs',
						allowEdit: true,
						allowView: false,
						allowDelete: true,
					});
				}
			});
	}

	get isPermit(): boolean {
		return (
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit ||
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
		);
	}
	get isLicence(): boolean {
		return this.workerLicenceTypeCode === WorkerLicenceTypeCode.SecurityWorkerLicence;
	}
	get workerLicenceTypeCode(): WorkerLicenceTypeCode | null {
		return this.licenceModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}
	get hasGenderChanged(): boolean {
		return this.licenceModelData.personalInformationData.hasGenderChanged ?? false;
	}
	get hasBcscNameChanged(): boolean {
		return this.licenceModelData.personalInformationData.hasBcscNameChanged ?? false;
	}
	get cardHolderName(): string {
		return this.licenceModelData.personalInformationData.cardHolderName ?? '';
	}
	get licenceHolderName(): string {
		return this.licenceModelData.personalInformationData.licenceHolderName ?? '';
	}
}
