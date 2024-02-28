import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WorkerCategoryTypeCode } from '@app/api/models';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-business-category-amoured-car-guard',
	template: `
		<div class="text-minor-heading mt-3 mb-2">You must provide the Registrar with:</div>
		<div class="alert alert-category d-flex" role="alert">
			<ul class="m-0">
				<li>Proof you own, lease or rent an approved armoured car</li>
				<li>Proof you have liability insurance</li>
				<li>
					A copy of a safety certificate issued under section 37.04 of the Motor Vehicle Act Regulations (See also s.
					4(3)(e) of the Security Services Regulation).
				</li>
			</ul>
		</div>

		<form [formGroup]="form" novalidate>
			<div class="fs-5">Upload your documents</div>
			<div class="my-2">
				<app-file-upload
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
					[maxNumberOfFiles]="10"
					[control]="attachments"
					[files]="attachments.value"
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
			</div>

			<div class="row">
				<div class="col-lg-4 col-md-12 col-sm-12">
					<mat-form-field>
						<mat-label>Document Expiry Date</mat-label>
						<input matInput [matDatepicker]="picker" formControlName="expiryDate" [errorStateMatcher]="matcher" />
						<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
						<mat-datepicker #picker startView="multi-year"></mat-datepicker>
						<mat-error *ngIf="form.get('expiryDate')?.hasError('required')">This is required</mat-error>
					</mat-form-field>
				</div>
			</div>
		</form>
	`,
	styles: ``,
})
export class BusinessCategoryAmouredCarGuardComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.businessApplicationService.categoryArmouredCarGuardFormGroup;
	title = '';

	matcher = new FormErrorStateMatcher();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private optionsPipe: OptionsPipe,
		private authenticationService: AuthenticationService,
		private businessApplicationService: BusinessApplicationService,
		private hotToastService: HotToastService
	) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.ArmouredCarGuard, 'WorkerCategoryTypes');
	}

	onFileUploaded(_file: File): void {
		// if (this.authenticationService.isLoggedIn()) {
		// 	this.businessApplicationService
		// 		.addUploadDocument(LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate, file)
		// 		.subscribe({
		// 			next: (resp: any) => {
		// 				const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
		// 				matchingFile.documentUrlId = resp.body[0].documentUrlId;
		// 			},
		// 			error: (error: any) => {
		// 				console.log('An error occurred during file upload', error);
		// 				this.hotToastService.error('An error occurred during the file upload. Please try again.');
		// 				this.fileUploadComponent.removeFailedFile(file);
		// 			},
		// 		});
		// }
	}

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
