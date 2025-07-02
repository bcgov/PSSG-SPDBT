import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import {
	PrivateInvestigatorRequirementCode,
	PrivateInvestigatorTrainingCode,
} from '@app/core/code-types/model-desc.models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-licence-category-private-investigator',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>
		
		<form [formGroup]="form" novalidate>
		  <div class="alert alert-category d-flex" role="alert">
		    <div>
		      <div class="text-minor-heading mb-2">Experience:</div>
		      To qualify for a private investigator security worker licence, you must meet one of the following experience
		      requirements:
		
		      <mat-radio-group
		        class="category-radio-group"
		        aria-label="Select an option"
		        formControlName="requirementCode"
		        (change)="onChangeDocumentType($event)"
		        >
		        <mat-radio-button
		          [value]="privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_ExperienceAndCourses"
		          >
		          a) Two years of documented experience providing the services of a private investigator or private
		          investigator under supervision, AND successful completion of recognized courses in evidence gathering and
		          presentation and in the aspects of criminal and civil law that are relevant to the work of a private
		          investigator in B.C.
		          <mat-icon
		            class="info-icon"
		            matTooltip="You must provide proof of 2,000 hours of work experience within the last 5 years."
		            >
		            info
		          </mat-icon>
		        </mat-radio-button>
		        <mat-divider class="my-2"></mat-divider>
		        <mat-radio-button
							[value]="
								privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining
							"
		          >
		          b) Ten years of experience performing general police duties in a Canadian police force, AND proof of
		          registration in the Private Security Training Network online course
		          <i>Introduction to Private Investigation</i>.
		          <mat-icon
		            class="info-icon"
		            matTooltip="Course and exam must be completed within the first year of licensing"
		            >
		            info
		          </mat-icon>
		        </mat-radio-button>
		        <mat-divider class="my-2"></mat-divider>
		        <mat-radio-button
		          [value]="privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_KnowledgeAndExperience"
		          >
		          c) Knowledge and experience equivalent to that which would be obtained under paragraph (a) above.
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
		        <div class="text-minor-heading">
		          @if (
		            requirementCode.value ===
		            privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_ExperienceAndCourses
		            ) {
		            <span
		              >
		              <div class="summary-heading mb-2">Upload document(s) providing the following information:</div>
		              <span class="fs-6 fw-normal">
		                <ul>
		                  <li>The names of employers</li>
		                  <li>The names of supervising private investigator licensees</li>
		                  <li>The dates of employment, and</li>
		                  <li>The hours logged with each employer</li>
		                  <li>Proof of experience must be provided on company letterhead, dated and signed</li>
		                </ul>
		              </span>
		            </span>
		          }
		          @if (
		            requirementCode.value ===
		            privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_TenYearsPoliceExperienceAndTraining
		            ) {
		            <span
		              >
		              Upload proof of registration in the Private Security Training Network online course Introduction to Private
		              Investigation:
		            </span>
		          }
		          @if (
		            requirementCode.value ===
		            privateInvestigatorRequirementCodes.CategoryPrivateInvestigator_KnowledgeAndExperience
		            ) {
		            <span
		              >
		              Upload document(s) providing proof of relevant knowledge and experience:
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
		
		      <div class="alert alert-category d-flex mt-4" role="alert">
		        <div>
		          <div class="text-minor-heading mb-2">Training:</div>
		          You must meet one of the following training requirements:
		
		          <mat-radio-group
		            class="category-radio-group"
		            aria-label="Select an option"
		            formControlName="trainingCode"
		            (change)="onChangeTrainingDocumentType($event)"
		            >
		            <mat-radio-button
		              [value]="privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingRecognizedCourse"
		              >
		              You must have completed a recognized training course
		            </mat-radio-button>
		            <mat-divider class="my-2"></mat-divider>
		            <mat-radio-button
		              [value]="privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge"
		              >
		              You must provide proof of completing courses or demonstrating knowledge in the following areas:
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
		            (form.get('trainingCode')?.dirty || form.get('trainingCode')?.touched) &&
		            form.get('trainingCode')?.invalid &&
		            form.get('trainingCode')?.hasError('required')
		            ) {
		            <mat-error
		              class="mat-option-error"
		              >This is required</mat-error
		              >
		            }
		          </div>
		        </div>
		
		        @if (trainingCode.value) {
		          <div @showHideTriggerSlideAnimation>
		            <div class="my-2">
		              <div class="text-minor-heading mb-2">
		                @if (
		                  trainingCode.value ===
		                  privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingRecognizedCourse
		                  ) {
		                  <span
		                    >
		                    Upload a copy of your course certificate
		                  </span>
		                }
		                @if (
		                  trainingCode.value ===
		                  privateInvestigatorTrainingCodes.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge
		                  ) {
		                  <span
		                    >Upload document(s) providing proof of course completion or equivalent knowledge</span
		                    >
		                  }
		                </div>
		                <app-file-upload
		                  (fileUploaded)="onFileTrainingAdded($event)"
		                  (fileRemoved)="onFileRemoved()"
		                  [control]="trainingAttachments"
		                  [maxNumberOfFiles]="10"
		                  #trainingAttachmentsRef
		                  [files]="trainingAttachments.value"
		                ></app-file-upload>
		                @if (
		                  (form.get('trainingAttachments')?.dirty || form.get('trainingAttachments')?.touched) &&
		                  form.get('trainingAttachments')?.invalid &&
		                  form.get('trainingAttachments')?.hasError('required')
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
export class LicenceCategoryPrivateInvestigatorComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.workerApplicationService.categoryPrivateInvestigatorFormGroup;

	privateInvestigatorRequirementCodes = PrivateInvestigatorRequirementCode;
	privateInvestigatorTrainingCodes = PrivateInvestigatorTrainingCode;

	@ViewChild('attachmentsRef') fileUploadComponent!: FileUploadComponent;
	@ViewChild('trainingattachmentsRef') fileUploadTrainingComponent!: FileUploadComponent;

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

	onChangeDocumentType(_event: MatRadioChange): void {
		this.workerApplicationService.hasValueChanged = true;
		this.attachments.setValue([]);
	}

	onFileTrainingAdded(file: File): void {
		this.workerApplicationService.hasValueChanged = true;

		if (!this.workerApplicationService.isAutoSave()) {
			return;
		}

		this.workerApplicationService.addUploadDocument(this.trainingCode.value, file).subscribe({
			next: (resp: any) => {
				const matchingFile = this.trainingAttachments.value.find((item: File) => item.name == file.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				this.fileUploadTrainingComponent.removeFailedFile(file);
			},
		});
	}

	onChangeTrainingDocumentType(_event: MatRadioChange): void {
		this.workerApplicationService.hasValueChanged = true;
		this.trainingAttachments.setValue([]);
	}

	onFileRemoved(): void {
		this.workerApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	public get requirementCode(): FormControl {
		return this.form.get('requirementCode') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}

	public get trainingCode(): FormControl {
		return this.form.get('trainingCode') as FormControl;
	}

	public get trainingAttachments(): FormControl {
		return this.form.get('trainingAttachments') as FormControl;
	}

	// public get fireCourseCertificateAttachments(): FormControl {
	// 	return this.form.get('fireCourseCertificateAttachments') as FormControl;
	// }

	// public get fireVerificationLetterAttachments(): FormControl {
	// 	return this.form.get('fireVerificationLetterAttachments') as FormControl;
	// }

	// public get addFireInvestigator(): FormControl {
	// 	return this.form.get('addFireInvestigator') as FormControl;
	// }
}
