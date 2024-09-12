import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-personal-info',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<ng-container *ngIf="isLoggedIn; else notLoggedIn">
				<app-form-personal-information
					[personalInformationFormGroup]="personalInformationFormGroup"
					[contactInformationFormGroup]="contactInformationFormGroup"
				></app-form-personal-information>
			</ng-container>
			<ng-template #notLoggedIn>
				<ng-container *ngIf="isUpdate; else isNew">
					<app-form-personal-information-renew-update-anonymous
						[form]="personalInformationFormGroup"
						[applicationTypeCode]="applicationTypeCode"
						(fileUploaded)="onFileUploaded()"
						(fileRemoved)="onFileRemoved()"
					></app-form-personal-information-renew-update-anonymous>
				</ng-container>
				<ng-template #isNew>
					<app-form-personal-information-new-anonymous
						[form]="personalInformationFormGroup"
					></app-form-personal-information-new-anonymous>
				</ng-template>

				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<mat-divider class="my-3 mat-divider-primary"></mat-divider>
						<div class="text-minor-heading mb-2">Contact Information</div>
					</div>
				</div>

				<app-form-contact-information [form]="contactInformationFormGroup"></app-form-contact-information>
			</ng-template>
		</app-step-section>
	`,
	styles: [],
})
export class StepControllingMemberPersonalInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	@Input() isLoggedIn!: boolean;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	personalInformationFormGroup = this.controllingMembersService.personalInformationFormGroup;
	contactInformationFormGroup = this.controllingMembersService.contactInformationFormGroup;

	constructor(private controllingMembersService: ControllingMemberCrcService) {}

	ngOnInit(): void {
		this.title = this.isUpdate ? 'Confirm your personal information' : 'Your personal information';

		if (!this.isLoggedIn) {
			this.subtitle = this.isUpdate ? 'Update any information that has changed since your last application' : '';
		}
	}

	isFormValid(): boolean {
		this.personalInformationFormGroup.markAllAsTouched();
		this.contactInformationFormGroup.markAllAsTouched();
		return this.personalInformationFormGroup.valid && this.contactInformationFormGroup.valid;
	}

	onFileUploaded(): void {
		this.controllingMembersService.hasValueChanged = true;
	}

	onFileRemoved(): void {
		this.controllingMembersService.hasValueChanged = true;
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
