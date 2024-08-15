import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LicenceDocumentTypeCode, WorkerCategoryTypeCode } from '@app/api/models';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-business-category-amoured-car-guard',
	template: `
		<div class="text-minor-heading mt-3 mb-2">You must provide the Registrar with:</div>
		<div class="alert alert-category d-flex" role="alert">
			<ul class="m-0">
				<li>Proof you own, lease or rent an approved armoured car</li>
				<li>Proof you have liability insurance</li>
				<li>
					A copy of a safety certificate issued under
					<a
						href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/10_207_2008#section4"
						target="_blank"
					>
						section 37.04 of the Motor Vehicle Act Regulations (See also s. 4(3)(e) of the Security Services
						Regulation)</a
					>.
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
		</form>
	`,
	styles: ``,
})
export class BusinessCategoryAmouredCarGuardComponent implements OnInit, LicenceChildStepperStepComponent {
	form = this.businessApplicationService.categoryArmouredCarGuardFormGroup;
	title = '';

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(WorkerCategoryTypeCode.ArmouredCarGuard, 'WorkerCategoryTypes');
	}

	onFileUploaded(file: File): void {
		this.businessApplicationService.hasValueChanged = true;

		if (!this.businessApplicationService.isAutoSave()) {
			return;
		}

		this.businessApplicationService.addUploadDocument(LicenceDocumentTypeCode.ArmourCarGuardRegistrar, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.fileUploadComponent.removeFailedFile(file);
			},
		});
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
