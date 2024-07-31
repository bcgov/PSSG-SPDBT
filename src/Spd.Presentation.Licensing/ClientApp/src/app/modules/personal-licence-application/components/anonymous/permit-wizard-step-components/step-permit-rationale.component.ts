import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/modules/personal-licence-application/permit-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-permit-rationale',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
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
								maxlength="3000"
							></textarea>
							<mat-hint>Maximum 3000 characters</mat-hint>
							<mat-error *ngIf="form.get('rationale')?.hasError('required')"> This is required </mat-error>
						</mat-form-field>
					</div>
					<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto mt-2">
						<div class="text-minor-heading">Provide any documents that support your rationale (optional)</div>
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
		</app-step-section>
	`,
	styles: [],
})
export class StepPermitRationaleComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	matcher = new FormErrorStateMatcher();
	documentType!: LicenceDocumentTypeCode;

	form: FormGroup = this.permitApplicationService.permitRationaleFormGroup;

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private permitApplicationService: PermitApplicationService) {}

	// Provide your rationale for requiring ${name}
	// The information you provide will assist the Registrar in deciding whether to issue your body armour permit
	// What are your proposed activities in British Columbia for which you require body armour?
	// TODO Show only if permit type = Body Armour Permit 90-day exemption AND reason = temporary

	// Provide your rationale for requiring ${name}
	// The information you provide will assist the Registrar in deciding whether to issue your body armour permit
	// Please provide documented evidence of the imminent risk to your safety
	// TODO Show only if permit type = Body Armour Permit 90-day exemption AND reason = imminent risk

	ngOnInit(): void {
		const name =
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit ? 'body armour' : 'an armoured vehicle';
		const workerLicenceTypeDesc = this.optionsPipe.transform(this.workerLicenceTypeCode, 'WorkerLicenceTypes');

		this.documentType =
			this.workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit
				? LicenceDocumentTypeCode.BodyArmourRationale
				: LicenceDocumentTypeCode.ArmouredVehicleRationale;

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = `Provide your rationale for requiring ${name}`;
				this.subtitle = `The information you provide will assist the Registrar in deciding whether to issue your ${workerLicenceTypeDesc}`;
				break;
			}
			default: {
				this.title = `Confirm your rationale for requiring ${name}`;
				this.subtitle = `If the purpose for requiring your ${workerLicenceTypeDesc} has changed from your previous application, update your rationale`;
				break;
			}
		}
	}

	onFileUploaded(file: File): void {
		this.permitApplicationService.hasValueChanged = true;

		if (!this.permitApplicationService.isAutoSave()) {
			return;
		}

		this.permitApplicationService.addUploadDocument(this.documentType, file).subscribe({
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
