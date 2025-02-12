import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormPhotographOfYourselfComponent } from '@app/shared/components/form-photograph-of-yourself.component';

@Component({
	selector: 'app-step-gdsd-photograph-of-yourself',
	template: `
		<app-step-section
			title="Passport-Quality Photo of Yourself"
			subtitle="This must be a photo of the handler and will appear on your certificate."
		>
			<app-form-photograph-of-yourself
				[serviceTypeCode]="serviceTypeCode"
				[form]="form"
				label="licence"
				(fileUploaded)="onFileUploaded($event)"
				(fileRemoved)="onFileRemoved()"
			></app-form-photograph-of-yourself>
			<!-- // TODO gdsd photo 
				[originalPhotoOfYourselfExpired]="originalPhotoOfYourselfExpired"
				[photographOfYourself]="photographOfYourself" -->
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	serviceTypeCode = ServiceTypeCode.GdsdTeamCertification;
	form: FormGroup = this.gdsdApplicationService.photographOfYourselfFormGroup;

	@ViewChild(FormPhotographOfYourselfComponent) formPhotographOfYourselfComponent!: FormPhotographOfYourselfComponent;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	onFileUploaded(_file: File): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.gdsdApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
