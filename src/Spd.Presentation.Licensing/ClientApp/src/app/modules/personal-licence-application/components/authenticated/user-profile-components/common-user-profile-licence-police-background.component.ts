import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { FormPoliceBackgroundComponent } from '@app/shared/components/form-police-background.component';

@Component({
	selector: 'app-common-user-profile-licence-police-background',
	template: `
		<mat-accordion>
			<mat-expansion-panel class="mat-expansion-panel-border mb-3" [expanded]="true" [disabled]="true">
				<mat-expansion-panel-header>
					<mat-panel-title>Police Background</mat-panel-title>
				</mat-expansion-panel-header>

				<div class="mt-3">
					<div class="py-2">{{ title }}</div>

					<app-form-police-background
						[form]="form"
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
					></app-form-police-background>
				</div>
			</mat-expansion-panel>
		</mat-accordion>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonUserProfileLicencePoliceBackgroundComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(FormPoliceBackgroundComponent)
	formPoliceBackgroundComponent!: FormPoliceBackgroundComponent;

	constructor(private workerApplicationService: WorkerApplicationService) {}

	ngOnInit(): void {
		this.title = this.workerApplicationService.getPoliceBackgroundTitle(this.applicationTypeCode);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.workerApplicationService.fileUploaded(
			LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			file,
			this.formPoliceBackgroundComponent.attachments,
			this.formPoliceBackgroundComponent.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.workerApplicationService.fileRemoved();
	}
}
