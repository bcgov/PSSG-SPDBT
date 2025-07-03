import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-team-accredited-school-id-card',
	template: `
		<app-step-section heading="Accredited School Identification Card">
		  <form [formGroup]="form" novalidate>
		    <div class="row my-2">
		      <div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
		        <div class="text-minor-heading mb-2">
		          Upload a copy of your valid identification card from the accredited school or a letter from the accredited
		          school identifying the individual and dog as an active working team
		        </div>
		        <app-file-upload
		          (fileUploaded)="onFileUploaded($event)"
		          (fileRemoved)="onFileRemoved()"
		          [control]="attachments"
		          [maxNumberOfFiles]="10"
		          [files]="attachments.value"
		          [previewImage]="true"
		          ariaFileUploadLabel="Upload valid identification card from the accredited school"
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
		    </form>
		  </app-step-section>
		`,
	styles: [],
	standalone: false,
})
export class StepTeamAccreditedSchoolIdCardComponent {
	form: FormGroup = this.gdsdTeamApplicationService.accreditedSchoolIdCardFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	onFileUploaded(file: File): void {
		this.gdsdTeamApplicationService.fileUploaded(
			LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.gdsdTeamApplicationService.fileRemoved();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
