import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode, ServiceTypeCode } from '@app/api/models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormPhotographOfYourselfComponent } from '@app/shared/components/form-photograph-of-yourself.component';

@Component({
	selector: 'app-step-dt-photograph-of-yourself',
	template: `
		<app-step-section
			title="Passport-quality photo of the dog trainer"
			subtitle="This photo will appear on your certificate."
		>
			<app-form-photograph-of-yourself
				[serviceTypeCode]="serviceTypeDogTrainer"
				[form]="form"
				label="licence"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-photograph-of-yourself>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepDtPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	readonly serviceTypeDogTrainer = ServiceTypeCode.DogTrainerCertification;

	form: FormGroup = this.gdsdTeamApplicationService.photographOfYourselfFormGroup;

	@ViewChild(FormPhotographOfYourselfComponent) formPhotographOfYourselfComponent!: FormPhotographOfYourselfComponent;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	onFileUploaded(file: File): void {
		this.gdsdTeamApplicationService.fileUploaded(
			LicenceDocumentTypeCode.PhotoOfYourself,
			file,
			this.attachments,
			this.formPhotographOfYourselfComponent.fileUploadComponent
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
