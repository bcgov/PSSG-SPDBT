import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BulkHistoryListResponse, BulkHistoryResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-generic-uploads',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<h2 class="mb-2 fw-normal">Generic Uploads</h2>
				<div class="col-md-6 col-sm-12 my-4">
					<app-file-upload
						accept=".tsv"
						[maxNumberOfFiles]="1"
						(uploadedFile)="onUploadFile($event)"
						message="Text files ending in '.TSV' only"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>This is required</mat-error
					>
					<!--   *ngIf="showErrors"-->
				</div>
				<div class="col-md-6 col-sm-12 my-4">
					<div class="alert alert-warning d-flex" role="alert">
						<mat-icon class="d-none d-xl-block alert-icon mt-2 me-2">error</mat-icon>
						<div class="mt-2 ms-2">
							File upload failed
							<ul class="mb-0 me-4">
								<li class="my-2">Error on line 6: City Name cannot contain numbers</li>
								<li class="my-2">Error on line 9: Postal Code min 5 characters, max 12 characters</li>
							</ul>
						</div>
					</div>
					<div class="alert alert-success d-flex" role="alert">
						<mat-icon class="d-none d-xl-block alert-icon me-2">check_circle</mat-icon>
						File upload succeeded
					</div>
				</div>
			</div>

			<div class="row mt-4">
				<div class="col-md-12 col-sm-12">
					<h3 class="fw-normal">Previous Uploads</h3>
					<mat-table [dataSource]="dataSource">
						<ng-container matColumnDef="uploadedDateTime">
							<mat-header-cell *matHeaderCellDef>Uploaded On</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Uploaded On:</span>
								{{ application.createdOn | date : constants.date.dateTimeFormat }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="uploadedByUserFullName">
							<mat-header-cell *matHeaderCellDef>Uploaded By</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Uploaded By:</span>
								{{ application | fullname }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="fileName">
							<mat-header-cell *matHeaderCellDef>File Name</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">File Name:</span>
								{{ application.applicationNumber }}
							</mat-cell>
						</ng-container>

						<ng-container matColumnDef="batchNumber">
							<mat-header-cell *matHeaderCellDef>Batch Number</mat-header-cell>
							<mat-cell *matCellDef="let application">
								<span class="mobile-label">Batch Number:</span>
								{{ application.applicationNumber }}
							</mat-cell>
						</ng-container>

						<mat-header-row *matHeaderRowDef="columns; sticky: true"></mat-header-row>
						<mat-row *matRowDef="let row; columns: columns"></mat-row>
					</mat-table>
					<mat-paginator
						[showFirstLastButtons]="true"
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
	styles: [],
})
export class GenericUploadsComponent implements OnInit {
	private queryParams: any = this.utilService.getDefaultQueryParams();

	constants = SPD_CONSTANTS;
	dataSource: MatTableDataSource<BulkHistoryResponse> = new MatTableDataSource<BulkHistoryResponse>([]);
	tablePaginator = this.utilService.getDefaultTablePaginatorConfig();
	columns: string[] = ['uploadedDateTime', 'uploadedByUserFullName', 'fileName', 'batchNumber'];

	form: FormGroup = this.formBuilder.group({
		attachments: new FormControl('', [Validators.required]),
	});

	showErrors = false;

	@ViewChild('paginator') paginator!: MatPaginator;

	constructor(
		private router: Router,
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private applicationService: ApplicationService,
		private utilService: UtilService
	) {}

	ngOnInit() {
		this.authenticationService.waitUntilAuthentication$.subscribe((_subjectData: any) => {
			const genericUploadEnabled = this.authenticationService.genericUploadEnabled;
			if (!genericUploadEnabled) {
				this.router.navigate([CrrpRoutes.crrpPath(CrrpRoutes.HOME)]);
			}
		});

		this.loadList();
	}

	onUploadFile(evt: any) {
		console.log('onUploadFile', evt);
		this.showErrors = true;
		// const attachments =
		// 	this.fileUploadComponent.files && this.fileUploadComponent.files.length > 0
		// 		? this.fileUploadComponent.files[0]
		// 		: '';
		// this.form.controls['attachments'].setValue(attachments);

		// const currentFiles = [...this.form.get('files')?.value];
		// currentFiles.push(...evt.addedFiles);
		// this.form.get('files')?.setValue(currentFiles);
		this.form.get('attachments')?.setValue(evt.addedFiles);
	}

	onPageChanged(page: PageEvent): void {
		this.queryParams.page = page.pageIndex;
		this.loadList();
	}

	private loadList(): void {
		this.applicationService
			.apiOrgsOrgIdApplicationsBulkHistoryGet({
				orgId: this.authenticationService.loggedInUserInfo?.orgId!,
				...this.queryParams,
			})
			.pipe()
			.subscribe((res: BulkHistoryListResponse) => {
				this.dataSource.data = res.bulkUploadHistorys as Array<BulkHistoryResponse>;
				this.tablePaginator = { ...res.pagination };
			});
	}
}
