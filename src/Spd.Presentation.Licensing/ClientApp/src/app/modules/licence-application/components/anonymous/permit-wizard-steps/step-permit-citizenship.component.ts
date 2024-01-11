import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import {
	CitizenshipFileUploadEmitResponse,
	CommonCitizenshipComponent,
} from '../../shared/step-components/common-citizenship.component';

@Component({
	selector: 'app-step-permit-citizenship',
	template: `
		<section class="step-section">
			<div class="step">
				<ng-container
					*ngIf="
						applicationTypeCode === applicationTypeCodes.Renewal || applicationTypeCode === applicationTypeCodes.Update
					"
				>
					<app-renewal-alert [applicationTypeCode]="applicationTypeCode"></app-renewal-alert>
				</ng-container>

				<app-step-title title="Are you a Canadian citizen?"></app-step-title>

				<app-common-citizenship
					[form]="form"
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
				></app-common-citizenship>
			</div>
		</section>
	`,
	styles: [],
})
export class StepPermitCitizenshipComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.permitApplicationService.citizenshipFormGroup;

	applicationTypeCodes = ApplicationTypeCode;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(CommonCitizenshipComponent) commonCitizenshipComponent!: CommonCitizenshipComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private permitApplicationService: PermitApplicationService,
		private hotToastService: HotToastService
	) {}

	onFileUploaded(resp: CitizenshipFileUploadEmitResponse): void {
		if (this.authenticationService.isLoggedIn()) {
			this.permitApplicationService.addUploadDocument(resp.proofTypeCode, resp.file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == resp.file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
					this.commonCitizenshipComponent.fileUploadComponent.removeFailedFile(resp.file);
				},
			});
		}
	}

	onFileRemoved(): void {
		this.permitApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
