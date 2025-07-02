import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { PrivateInvestigatorSupRequirementCode } from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-licence-category-private-investigator-sup',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>
		
		<form [formGroup]="form" novalidate>
		  <div class="alert alert-category d-flex" role="alert">
		    <div>
		      <div class="text-minor-heading mb-2">Training:</div>
		      To qualify for a Private Investigator Under Supervision licence, you must meet one of the following training
		      requirements:
		
		      <mat-radio-group
		        class="category-radio-group"
		        aria-label="Select an option"
		        formControlName="requirementCode"
		        (change)="onChangeDocumentType($event)"
		        >
		        <mat-radio-button
							[value]="
								privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion
							"
		          >
		          Successful completion of the Private Security Training Network (PSTnetwork) online course
		          <i>Introduction to Private Investigation</i> and proof of final exam completion
		        </mat-radio-button>
		        <mat-divider class="my-2"></mat-divider>
		        <mat-radio-button
							[value]="
								privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion
							"
		          >
		          Completion of courses or demonstrated knowledge in the areas of:
		          <ul>
		            <li>Criminal law</li>
		            <li>Civil law and process</li>
		            <li>Human rights legislation</li>
		            <li>Information and privacy legislation</li>
		            <li>Evidence recognition, presentation and protocols</li>
		            <li>Interviewing techniques</li>
		            <li>Report writing</li>
		            <li>Documentary research (electronic and hard copy), and</li>
		            <li>Surveillance techniques</li>
		          </ul>
		        </mat-radio-button>
		      </mat-radio-group>
		      @if (
		        (form.get('requirementCode')?.dirty || form.get('requirementCode')?.touched) &&
		        form.get('requirementCode')?.invalid &&
		        form.get('requirementCode')?.hasError('required')
		        ) {
		        <mat-error
		          class="mat-option-error"
		          >This is required</mat-error
		          >
		        }
		      </div>
		    </div>
		
		    @if (requirementCode.value) {
		      <div @showHideTriggerSlideAnimation>
		        <div class="text-minor-heading mb-2">
		          @if (
		            requirementCode.value ===
		            privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion
		            ) {
		            <span
		              >
		              Upload proof of course completion
		            </span>
		          }
		          @if (
		            requirementCode.value ===
		            privateInvestigatorSupRequirementCodes.CategoryPrivateInvestigatorUnderSupervision_OtherCourseCompletion
		            ) {
		            <span
		              >
		              Upload document(s) providing proof of course completion or equivalent knowledge
		            </span>
		          }
		        </div>
		        <div class="my-2">
		          <app-file-upload
		            (fileUploaded)="onFileUploaded($event)"
		            (fileRemoved)="onFileRemoved()"
		            [control]="attachments"
		            [maxNumberOfFiles]="10"
		            #attachmentsRef
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
		      }
		    </form>
		`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class LicenceCategoryPrivateInvestigatorSupComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.categoryPrivateInvestigatorSupFormGroup;

	privateInvestigatorSupRequirementCodes = PrivateInvestigatorSupRequirementCode;

	@ViewChild('attachmentsRef') fileUploadComponent!: FileUploadComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	onFileUploaded(file: File): void {
		this.workerApplicationService.hasValueChanged = true;

		if (!this.workerApplicationService.isAutoSave()) {
			return;
		}

		this.workerApplicationService.addUploadDocument(this.requirementCode.value, file).subscribe({
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

	public get requirementCode(): FormControl {
		return this.form.get('requirementCode') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
