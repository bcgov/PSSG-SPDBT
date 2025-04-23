import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode, LicenceDocumentTypeCode } from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';

@Component({
	selector: 'app-step-business-licence-controlling-member-invites',
	template: `
		<app-step-section title="Controlling members and business managers request summary">
			<div class="row">
				<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
					<app-alert type="warning" icon="warning">
						Invitations to consent to a criminal record check will be sent to these controlling members and business
						managers when you submit your business licence application. Your application will not proceed until we
						receive consent forms from all controlling members and business managers.
					</app-alert>
				</div>
			</div>

			<div class="row mb-3" *ngIf="membersWithoutSwlArray.length > 0">
				<div class="offset-md-3 col-md-6 col-sm-12">
					<div class="row">
						<ng-container *ngFor="let member of membersWithoutSwlArray; let i = index; last as isLast">
							<div class="col-md-6 col-sm-12 summary-text-data mt-2">{{ member.givenName }} {{ member.surname }}</div>
							<div class="col-md-6 col-sm-12 summary-text-data mt-0 mt-md-2">
								<ng-container *ngIf="member.emailAddress; else noEmailAddress">
									{{ member.emailAddress | default }}
								</ng-container>
								<ng-template #noEmailAddress>
									<a
										aria-label="Download Consent to Criminal Record Check document"
										download="business-memberauthconsent"
										matTooltip="Download Consent to Criminal Record Check document"
										[href]="downloadFilePath"
									>
										Download Manual Form
									</a>
								</ng-template>
							</div>
							<mat-divider *ngIf="!isLast" class="my-2"></mat-divider>
						</ng-container>
					</div>
				</div>
			</div>

			<div class="mt-2" *ngIf="requireDocumentUpload" @showHideTriggerSlideAnimation>
				<mat-divider class="mat-divider-main my-3"></mat-divider>
				<div class="text-minor-heading lh-base mb-2">
					Upload a copy of the corporate registry documents for your business in the province in which you are
					originally registered
					<span *ngIf="!attachmentIsRequired.value" class="optional-label">(optional)</span>
				</div>
				<app-file-upload
					(fileUploaded)="onFileUploaded($event)"
					(fileRemoved)="onFileRemoved()"
					[control]="attachments"
					[maxNumberOfFiles]="10"
					[files]="attachments.value"
				></app-file-upload>
				<mat-error
					class="mat-option-error d-block"
					*ngIf="
						(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
						form.get('attachments')?.invalid &&
						form.get('attachments')?.hasError('required')
					"
					>This is required</mat-error
				>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepBusinessLicenceControllingMemberInvitesComponent implements OnInit, LicenceChildStepperStepComponent {
	downloadFilePath = SPD_CONSTANTS.files.businessMemberAuthConsentManualForm;

	requireDocumentUpload = false;

	controllingMembersFormGroup = this.businessApplicationService.controllingMembersFormGroup;
	businessMembersFormGroup = this.businessApplicationService.businessMembersFormGroup;

	form = this.businessApplicationService.corporateRegistryDocumentFormGroup;

	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	ngOnInit(): void {
		this.requireDocumentUpload = this.applicationTypeCode === ApplicationTypeCode.Renewal;
	}

	isFormValid(): boolean {
		return true;
	}

	onFileUploaded(file: File): void {
		this.businessApplicationService.hasValueChanged = true;

		if (!this.businessApplicationService.isAutoSave()) {
			return;
		}

		this.businessApplicationService
			.addUploadDocument(LicenceDocumentTypeCode.CorporateRegistryDocument, file)
			.subscribe({
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

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	get membersWithoutSwlArray(): Array<any> {
		return this.controllingMembersFormGroup.get('membersWithoutSwl')?.value ?? [];
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get attachmentIsRequired(): FormControl {
		return this.form.get('attachmentIsRequired') as FormControl;
	}
}
