import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { OptionsPipe } from '../pipes/options.pipe';

@Component({
	selector: 'app-form-photograph-of-yourself',
	template: `
		<form [formGroup]="form" novalidate>
		  <div class="row my-2">
		    <div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
		      <div class="mb-3">
		        <app-alert type="info" icon="info">
		          <p>
		            Please upload a clear photo of your face, looking straight at the camera, with a plain, white
		            background.
		          </p>
		          <p>
		            We understand this may be difficult for some applicants. If you are not able to provide this type of
		            photo, please contact us and we can help find another option.
		          </p>
		
		          Photo Guidelines:
		          <ul class="mb-0">
		            <li>Please use a clear, well-lit colour photo</li>
		            <li>Make sure your full face is visible, without hats, sunglasses, or filterss</li>
		            <li>Try to use a plain white background if possible</li>
		          </ul>
		        </app-alert>
		      </div>
		
		      @if (originalPhotoOfYourselfExpired) {
		        <app-alert type="danger" icon="dangerous">
		          We require a new photo every 5 years. Please provide a new photo for your certificate.
		        </app-alert>
		      }
		
		      <app-file-upload
		        (fileUploaded)="onFileUploaded($event)"
		        (fileRemoved)="onFileRemoved()"
		        [control]="attachments"
		        [maxNumberOfFiles]="1"
		        [files]="attachments.value"
		        [accept]="accept"
		        [previewImage]="true"
		        ariaFileUploadLabel="Upload photograph of yourself"
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
		`,
	styles: [],
	standalone: false,
})
export class FormPhotographOfYourselfComponent implements OnInit, LicenceChildStepperStepComponent {
	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');
	serviceTypeDesc = 'certificate';

	@Input() form!: FormGroup;
	@Input() originalPhotoOfYourselfExpired = false;
	@Input() serviceTypeCode!: ServiceTypeCode;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe) {}

	ngOnInit(): void {
		this.serviceTypeDesc = this.optionsPipe.transform(this.serviceTypeCode, 'ServiceTypes').toLowerCase();
	}

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
