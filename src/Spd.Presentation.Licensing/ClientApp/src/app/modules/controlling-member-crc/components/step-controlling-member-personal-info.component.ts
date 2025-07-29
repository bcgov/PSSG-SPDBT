import { Component, Input, OnInit } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { ControllingMemberCrcService } from '@app/core/services/controlling-member-crc.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-controlling-member-personal-info',
	template: `
		<app-step-section [heading]="title" [subheading]="subtitle">
			@if (isLoggedIn) {
				<app-form-personal-information
					[personalInformationFormGroup]="personalInformationFormGroup"
					[contactInformationFormGroup]="contactInformationFormGroup"
				></app-form-personal-information>
			} @else {
				@if (isUpdate) {
					<app-form-personal-information-renew-update-anonymous
						[form]="personalInformationFormGroup"
						[applicationTypeCode]="applicationTypeCode"
						(fileUploaded)="onFileUploaded()"
						(fileRemoved)="onFileRemoved()"
					></app-form-personal-information-renew-update-anonymous>
				} @else {
					<app-form-personal-information-new-anonymous
						[form]="personalInformationFormGroup"
					></app-form-personal-information-new-anonymous>
				}
				<div class="row my-2">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="text-primary-color fs-6">Contact Information</div>
					</div>
				</div>
				<app-form-contact-information [form]="contactInformationFormGroup"></app-form-contact-information>
			}
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepControllingMemberPersonalInfoComponent implements OnInit, LicenceChildStepperStepComponent {
	title = '';
	subtitle = '';

	@Input() isLoggedIn!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

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
