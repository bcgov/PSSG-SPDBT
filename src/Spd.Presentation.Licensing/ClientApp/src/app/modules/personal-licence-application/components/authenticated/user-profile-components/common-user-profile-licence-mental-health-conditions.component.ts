import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormMentalHealthConditionsComponent } from '@app/shared/components/form-mental-health-conditions.component';

@Component({
	selector: 'app-common-user-profile-licence-mental-health-conditions',
	template: `
		<mat-accordion>
			<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
				<mat-expansion-panel-header>
					<mat-panel-title>Mental Health Condition</mat-panel-title>
				</mat-expansion-panel-header>

				<div class="mt-3">
					<div class="py-2">{{ title }}</div>
					<app-alert type="info" icon="" [showBorder]="false" *ngIf="subtitle">
						{{ subtitle }}
					</app-alert>

					<app-form-mental-health-conditions
						[applicationTypeCode]="applicationTypeCode"
						[form]="form"
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
					></app-form-mental-health-conditions>
				</div>
			</mat-expansion-panel>
		</mat-accordion>
	`,
	styles: [],
})
export class CommonUserProfileLicenceMentalHealthConditionsComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	title = '';
	subtitle = '';

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FormMentalHealthConditionsComponent)
	formMentalHealthConditionsComponent!: FormMentalHealthConditionsComponent;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		[this.title, this.subtitle] = this.licenceApplicationService.getMentalHealthConditionsTitle(
			this.applicationTypeCode,
			this.hasPreviousMhcFormUpload.value
		);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.licenceApplicationService.fileUploaded(
			LicenceDocumentTypeCode.MentalHealthCondition,
			file,
			this.formMentalHealthConditionsComponent.attachments,
			this.formMentalHealthConditionsComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.licenceApplicationService.fileRemoved();
	}

	get hasPreviousMhcFormUpload(): FormControl {
		return this.form.get('hasPreviousMhcFormUpload') as FormControl;
	}
}
