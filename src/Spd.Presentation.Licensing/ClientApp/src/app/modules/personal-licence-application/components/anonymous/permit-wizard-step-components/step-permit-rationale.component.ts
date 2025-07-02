import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode, ServiceTypeCode } from '@app/api/models';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';

@Component({
	selector: 'app-step-permit-rationale',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
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
		          @if (form.get('rationale')?.hasError('required')) {
		            <mat-error> This is required </mat-error>
		          }
		        </mat-form-field>
		      </div>
		      <div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto mt-2">
		        <div class="text-minor-heading">Provide any documents that support your rationale (optional)</div>
		        <div class="my-2">
		          These may include a police report related to the safety concern, a protection order, a news article
		          addressing your concern, or similar documents.
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
	standalone: false,
})
export class StepPermitRationaleComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';
	matcher = new FormErrorStateMatcher();
	documentType!: LicenceDocumentTypeCode;

	form: FormGroup = this.permitApplicationService.permitRationaleFormGroup;

	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private optionsPipe: OptionsPipe,
		private permitApplicationService: PermitApplicationService
	) {}

	ngOnInit(): void {
		const name = this.serviceTypeCode === ServiceTypeCode.BodyArmourPermit ? 'body armour' : 'an armoured vehicle';
		const serviceTypeCodeDesc = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes');

		this.documentType =
			this.serviceTypeCode === ServiceTypeCode.BodyArmourPermit
				? LicenceDocumentTypeCode.BodyArmourRationale
				: LicenceDocumentTypeCode.ArmouredVehicleRationale;

		switch (this.applicationTypeCode) {
			case ApplicationTypeCode.New: {
				this.title = `Provide your rationale for requiring ${name}`;
				this.subtitle = `The information you provide will assist the Registrar in deciding whether to issue your ${serviceTypeCodeDesc}`;
				break;
			}
			default: {
				this.title = `Confirm your rationale for requiring ${name}`;
				this.subtitle = `If your purpose for requiring the ${serviceTypeCodeDesc} has changed since your previous application, please provide the updated rationale.`;
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
