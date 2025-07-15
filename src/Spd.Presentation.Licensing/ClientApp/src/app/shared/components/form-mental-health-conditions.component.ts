import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FileUploadComponent } from './file-upload.component';

@Component({
	selector: 'app-form-mental-health-conditions',
	template: `
		<form [formGroup]="form" novalidate>
		  <div class="row">
		    <div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'mx-auto' : ''">
		      <mat-radio-group aria-label="Select an option" formControlName="isTreatedForMHC">
		        <div [ngClass]="isWizardStep ? '' : 'd-flex justify-content-start'">
		          <mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
		          @if (isWizardStep) {
		            <mat-divider class="my-2"></mat-divider>
		          }
		          <mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
		        </div>
		      </mat-radio-group>
		      @if (
		        (form.get('isTreatedForMHC')?.dirty || form.get('isTreatedForMHC')?.touched) &&
		        form.get('isTreatedForMHC')?.invalid &&
		        form.get('isTreatedForMHC')?.hasError('required')
		        ) {
		        <mat-error
		          class="mat-option-error"
		          >This is required</mat-error
		          >
		        }
		      </div>
		    </div>
		
		    @if (isTreatedForMHC.value === booleanTypeCodes.Yes) {
		      <div class="row my-4" @showHideTriggerSlideAnimation>
		        <div [ngClass]="isWizardStep ? 'col-md-8 col-sm-12 mx-auto' : 'col-12'">
		          <mat-divider class="mb-3 mat-divider-primary"></mat-divider>
		          <p>
		            If you don't have a completed form, you can download it and give it to your doctor to fill out, or your
		            doctor can
		            <a
		              aria-label="Navigate to Mental Health Condition form"
		              [href]="mentalHealthConditionsFormUrl"
		              target="_blank"
		              >
		              download it</a
		              >
		              and complete it on a computer if you give them the required information. For more details, see the
		              <a aria-label="Navigate to Security Services Act site" [href]="securityServicesActUrl" target="_blank">
		                Security Services Act</a
		                >, s. 3, Security Services Regulation, s. 4(1)(e).
		              </p>
		              <div class="text-minor-heading my-2">Upload your mental health condition form</div>
		              <app-file-upload
		                (fileUploaded)="onFileUploaded($event)"
		                (fileRemoved)="onFileRemoved()"
		                [control]="attachments"
		                [maxNumberOfFiles]="1"
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
export class FormMentalHealthConditionsComponent {
	mentalHealthConditionsFormUrl = SPD_CONSTANTS.urls.mentalHealthConditionsFormUrl;
	securityServicesActUrl = SPD_CONSTANTS.urls.securityServicesActUrl;
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;
	@Input() isWizardStep = false;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	get isTreatedForMHC(): FormControl {
		return this.form.get('isTreatedForMHC') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
