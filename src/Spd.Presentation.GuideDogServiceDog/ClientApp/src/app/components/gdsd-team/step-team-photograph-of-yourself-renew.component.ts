import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ServiceTypeCode } from '@app/api/models';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-team-photograph-of-yourself-renew',
	template: `
		<app-step-section [title]="title">
			<app-form-photograph-of-yourself-update
				[form]="form"
				serviceTypeLabel="certificate"
				[serviceTypeCode]="serviceTypeGdsdTeam"
				[originalPhotoOfYourselfExpired]="originalPhotoOfYourselfExpired"
				[photographOfYourself]="photographOfYourself"
				(fileUploaded)="onFileUploaded()"
				(fileRemoved)="onFileRemoved()"
			></app-form-photograph-of-yourself-update>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepTeamPhotographOfYourselfRenewComponent implements OnInit, LicenceChildStepperStepComponent {
	readonly serviceTypeGdsdTeam = ServiceTypeCode.GdsdTeamCertification;
	title = '';
	originalPhotoOfYourselfExpired = false;
	photographOfYourself = this.gdsdTeamApplicationService.photographOfYourself;

	form: FormGroup = this.gdsdTeamApplicationService.photographOfYourselfFormGroup;

	constructor(private gdsdTeamApplicationService: GdsdTeamApplicationService) {}

	ngOnInit(): void {
		this.originalPhotoOfYourselfExpired = this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get(
			'originalLicenceData.originalPhotoOfYourselfExpired'
		)?.value;

		if (!this.originalPhotoOfYourselfExpired) {
			this.title = 'Do you want to update your photo?';
		} else {
			this.title = 'Upload a photo of yourself';
		}
	}

	onFileUploaded(): void {
		this.gdsdTeamApplicationService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.gdsdTeamApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
