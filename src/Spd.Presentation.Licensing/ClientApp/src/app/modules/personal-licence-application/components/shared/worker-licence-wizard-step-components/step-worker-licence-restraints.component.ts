import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode, RestraintDocumentTypes } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-worker-licence-restraints',
	template: `
		<app-step-section
		  heading="Are you requesting authorization to use restraints (such has handcuffs)?"
		  [subheading]="subtitle"
		  >
		  <form [formGroup]="form" novalidate>
		    <div class="row">
		      <div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
		        <mat-radio-group aria-label="Select an option" formControlName="carryAndUseRestraints">
		          <mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
		          <mat-divider class="my-2"></mat-divider>
		          <mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
		        </mat-radio-group>
		        @if (
		          (form.get('carryAndUseRestraints')?.dirty || form.get('carryAndUseRestraints')?.touched) &&
		          form.get('carryAndUseRestraints')?.invalid &&
		          form.get('carryAndUseRestraints')?.hasError('required')
		          ) {
		          <mat-error
		            class="mat-option-error"
		            >This is required</mat-error
		            >
		          }
		        </div>
		      </div>
		
		      @if (carryAndUseRestraints.value === booleanTypeCodes.Yes) {
		        <div class="row" @showHideTriggerSlideAnimation>
		          <div class="offset-md-2 col-md-8 col-sm-12">
		            <mat-divider class="mb-3 mt-4 mat-divider-primary"></mat-divider>
		            <div class="text-minor-heading mb-2">Proof of qualification</div>
		            <mat-radio-group
		              class="category-radio-group"
		              aria-label="Select an option"
		              formControlName="carryAndUseRestraintsDocument"
		              (change)="onChangeDocumentType($event)"
		              >
		              @for (doc of restraintDocumentTypes; track doc; let i = $index) {
		                <mat-radio-button class="radio-label" [value]="doc.code">
		                  {{ doc.desc }}
		                </mat-radio-button>
		              }
		            </mat-radio-group>
		            @if (
		              (form.get('carryAndUseRestraintsDocument')?.dirty ||
		              form.get('carryAndUseRestraintsDocument')?.touched) &&
		              form.get('carryAndUseRestraintsDocument')?.invalid &&
		              form.get('carryAndUseRestraintsDocument')?.hasError('required')
		              ) {
		              <mat-error
		                class="mat-option-error"
		                >This is required</mat-error
		                >
		              }
		              <div class="text-minor-heading mt-4 mb-2">Upload your proof of qualification</div>
		              <div class="my-2">
		                <app-file-upload
		                  (fileUploaded)="onFileUploaded($event)"
		                  (fileRemoved)="onFileRemoved()"
		                  [control]="attachments"
		                  [maxNumberOfFiles]="10"
		                  [files]="attachments.value"
		                ></app-file-upload>
		                @if (
		                  (form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
		                  form.get('attachments')?.invalid &&
		                  form.get('attachments')?.hasError('required')
		                  ) {
		                  <mat-error
		                    class="mat-option-error"
		                    >This is required</mat-error
		                    >
		                  }
		                </div>
		              </div>
		            </div>
		          }
		        </form>
		      </app-step-section>
		`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class StepWorkerLicenceRestraintsComponent implements OnInit, LicenceChildStepperStepComponent {
	subtitle = '';

	booleanTypeCodes = BooleanTypeCode;
	restraintDocumentTypes = RestraintDocumentTypes;

	form: FormGroup = this.workerApplicationService.restraintsAuthorizationFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.subtitle = this.isRenewalOrUpdate ? 'Update any information that has changed since your last application' : '';
	}

	onFileUploaded(file: File): void {
		this.workerApplicationService.hasValueChanged = true;

		if (!this.workerApplicationService.isAutoSave()) {
			return;
		}

		this.workerApplicationService.addUploadDocument(this.carryAndUseRestraintsDocument.value, file).subscribe({
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
		this.workerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onChangeDocumentType(_event: MatRadioChange): void {
		this.workerApplicationService.hasValueChanged = true;
		this.attachments.setValue([]);
	}

	get carryAndUseRestraints(): FormControl {
		return this.form.get('carryAndUseRestraints') as FormControl;
	}
	get carryAndUseRestraintsDocument(): FormControl {
		return this.form.get('carryAndUseRestraintsDocument') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get isRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
			this.applicationTypeCode === ApplicationTypeCode.Update
		);
	}
}
