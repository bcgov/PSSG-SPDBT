import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-permit-rationale',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
				</ng-container>

				<app-step-title
					title="Provide your rationale for requiring body armour"
					subtitle="The information you provide will assist the Registrar in deciding whether to issue your body armour permit"
				></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
							<mat-form-field>
								<mat-label>Rationale</mat-label>
								<textarea
									matInput
									formControlName="rationale"
									style="min-height: 200px"
									[errorStateMatcher]="matcher"
								></textarea>
								<mat-error *ngIf="form.get('rationale')?.hasError('required')"> This is required </mat-error>
							</mat-form-field>
						</div>
					</div>
					<div class="row mt-2">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<div class="text-minor-heading">Provide any documents that support your rationale (optional):</div>
							<div class="my-2">
								These could be a police report which refers to the safety concern, a protection order, a news article
								about your concern, etc.
							</div>
							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="5"
								[files]="attachments.value"
							></app-file-upload>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: ``,
})
export class StepPermitRationaleComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();
	form: FormGroup = this.permitApplicationService.permitRationaleFormGroup;

	applicationTypeCodes = ApplicationTypeCode;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		// private dialog: MatDialog,
		// private authenticationService: AuthenticationService,
		private permitApplicationService: PermitApplicationService // private hotToastService: HotToastService
	) {}

	onFileUploaded(_file: File): void {
		// if (this.authenticationService.isLoggedIn()) {
		// 	this.permitApplicationService.addUploadDocument(LicenceDocumentTypeCode.ProofOfFingerprint, file).subscribe({
		// 		next: (resp: any) => {
		// 			const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
		// 			matchingFile.documentUrlId = resp.body[0].documentUrlId;
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during file upload', error);
		// 			this.hotToastService.error('An error occurred during the file upload. Please try again.');
		// 			this.fileUploadComponent.removeFailedFile(file);
		// 		},
		// 	});
		// }
	}

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
