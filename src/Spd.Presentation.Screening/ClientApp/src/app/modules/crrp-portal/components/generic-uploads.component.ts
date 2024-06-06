import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	BulkHistoryListResponse,
	BulkHistoryResponse,
	BulkUploadCreateResponse,
	ValidationErr,
} from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-generic-uploads',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<h2 class="mb-2">Generic Uploads</h2>
				<div class="col-lg-8 col-md-12 col-sm-12 my-4">
					<app-file-upload
						accept=".tsv,.txt"
						[maxNumberOfFiles]="1"
						(uploadedFile)="onUploadFile($event)"
						(removeFile)="onRemoveFile($event)"
						message="Text files ending in '.TSV' or '.TXT' only"
					></app-file-upload>
				</div>
			</div>
			<ng-container *ngIf="showUploadMessages">
				<div class="row" *ngIf="validationErrs.length > 0">
					<div class="col-lg-8 col-md-12 col-sm-12">
						<app-alert type="danger" icon="error"
							><div class="mt-2 ms-2">
								File upload failed
								<ul class="mb-0 me-2">
									<li *ngFor="let err of validationErrs; let i = index" class="my-2">
										Error on line {{ err.lineNumber }}: {{ err.error }}
									</li>
								</ul>
							</div>
						</app-alert>
					</div>
				</div>
				<div class="row" *ngIf="validationErrs.length === 0">
					<div class="col-lg-8 col-md-12 col-sm-12">
						<app-alert type="success" icon="check_circle"> File upload succeeded </app-alert>
					</div>
				</div>
			</ng-container>

			<div class="row mt-4">
				<div class="col-md-12 col-sm-12">
					<h3 class="fw-normal">Previous Uploads</h3>
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="uploadedDateTime">
							<mat-header-cell *matHeaderCellDef>Uploaded On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Uploaded On:</span>
								{{ application.uploadedDateTime | formatDate : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedByUserFullName">
							<mat-header-cell *matHeaderCellDef>Uploaded By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Uploaded By:</span>
								{{ application.uploadedByUserFullName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="fileName">
							<mat-header-cell *matHeaderCellDef>File Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">File Name:</span>
								{{ application.fileName }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="batchNumber">
							<mat-header-cell *matHeaderCellDef>Batch Number</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Batch Number:</span>
								{{ application.batchNumber }}
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<mat-paginator
						[showFirstLastButtons]="true"
						[hidePageSize]="true"
						[pageIndex]="tablePaginator.pageIndex"
						[pageSize]="tablePaginator.pageSize"
						[length]="tablePaginator.length"
						(page)="onPageChanged($event)"
						aria-label="Select page"
					>
					</mat-paginator>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.mat-icon {
				min-width: 25px;
			}
		`,
	],
})
export class GenericUploadsComponent implements OnInit {
	private queryParams: any = this.utilService.getDefaultQueryParams();

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<BulkHistoryResponse> = new MatTableDataSource<BulkHistoryResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['uploadedDateTime', 'uploadedByUserFullName', 'fileName', 'batchNumber'];
	showUploadMessages = false;
	validationErrs: Array<ValidationErr> = [];

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;
	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private authUserService: AuthUserBceidService,
		private applicationService: ApplicationService,
		private utilService: UtilService,
		private dialog: MatDialog
	) {}

	ngOnInit() {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('GenericUploadsComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.authProcessService.waitUntilAuthentication$.subscribe((_subjectData: any) => {
			if (!this.authUserService.isAllowedGenericUpload) {
				this.router.navigate([CrrpRoutes.path(CrrpRoutes.HOME)]);
			}
		});

		this.loadList();
	}

	onUploadFile(files: any) {
		this.showUploadMessages = false;

		const body = {
			File: files[0],
			RequireDuplicateCheck: true,
		};

		// Check for potential duplicate
		this.applicationService
			.apiOrgsOrgIdApplicationsBulkPost({ orgId: this.authUserService.bceidUserInfoProfile?.orgId!, body })
			.pipe()
			.subscribe((resp: BulkUploadCreateResponse) => {
				this.validationErrs = resp.validationErrs ?? [];
				const duplicateCheckResponses =
					resp.duplicateCheckResponses?.filter((item) => item.hasPotentialDuplicate) ?? [];

				// if validation errors or not a duplicate, show result of error messages or success message
				if (this.validationErrs.length > 0 || duplicateCheckResponses.length == 0) {
					this.showUploadMessages = true;
					if (this.validationErrs.length == 0 && duplicateCheckResponses.length == 0) {
						this.removeFileFromView(); // on success, remove file from upload area
					}
					this.loadList();
					return;
				}

				let dupMessage = '';
				const potentialDuplicateInTsvList =
					duplicateCheckResponses.filter((item) => item.hasPotentialDuplicateInTsv) ?? [];

				if (potentialDuplicateInTsvList.length > 0) {
					let dupRows = '';
					potentialDuplicateInTsvList.forEach((item) => {
						dupRows += `<li>Line: ${item.lineNumber} - ${item.firstName} ${item.lastName}</li>`;
					});

					if (potentialDuplicateInTsvList.length == 1) {
						dupMessage += `A duplicate entry for the following individual was found in this file:<br/><ul>${dupRows}</ul>`;
					} else {
						dupMessage += `Duplicate entries for the following individuals were found in this file:<br/><ul>${dupRows}</ul>`;
					}
				}

				const potentialDuplicateInDbList =
					duplicateCheckResponses.filter((item) => item.hasPotentialDuplicateInDb) ?? [];
				if (potentialDuplicateInDbList.length > 0) {
					let dupRows = '';
					potentialDuplicateInDbList.forEach((item) => {
						dupRows += `<li>Line: ${item.lineNumber} - ${item.firstName} ${item.lastName}</li>`;
					});

					if (potentialDuplicateInDbList.length == 1) {
						dupMessage += `This individual already has an active record in our database:<br/><ul>${dupRows}</ul>`;
					} else {
						dupMessage += `The following individuals already have an active record in our database:<br/><ul>${dupRows}</ul>`;
					}
				}

				let dialogTitle = '';
				let dialogMessage = '';

				dialogTitle = `Potential duplicate${duplicateCheckResponses.length > 1 ? 's' : ''} detected`;
				dialogMessage = `${dupMessage}How would you like to proceed?`;

				const data: DialogOptions = {
					title: dialogTitle,
					message: dialogMessage,
					actionText: 'Submit',
					cancelText: 'Cancel',
				};

				this.dialog
					.open(DialogComponent, { data })
					.afterClosed()
					.subscribe((response: boolean) => {
						if (response) {
							this.saveBulkUpload(files[0]);
						} else {
							this.removeFileFromView(); // on cancel, remove file from upload area
						}
					});
			});
	}

	onRemoveFile(_files: any) {
		this.showUploadMessages = false;
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	private removeFileFromView(): void {
		this.fileUploadComponent.removeAllFiles();
	}

	private saveBulkUpload(file: any): void {
		const body = {
			File: file,
			RequireDuplicateCheck: false,
		};

		this.applicationService
			.apiOrgsOrgIdApplicationsBulkPost({ orgId: this.authUserService.bceidUserInfoProfile?.orgId!, body })
			.pipe()
			.subscribe((_resp: BulkUploadCreateResponse) => {
				this.showUploadMessages = true;
				this.removeFileFromView(); // on success, remove file from upload area
				this.loadList();
			}); // should be no errors since this file has already been processed
	}

	private loadList(): void {
		this.applicationService
			.apiOrgsOrgIdApplicationsBulkHistoryGet({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: BulkHistoryListResponse) => {
				this.dataSource.data = res.bulkUploadHistorys as Array<BulkHistoryResponse>;
				this.tablePaginator = { ...res.pagination };
			});
	}
}
