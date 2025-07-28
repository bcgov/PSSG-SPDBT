import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode, LicenceResponse, ServiceTypeCode } from '@app/api/models';
import { FormAccessCodeAnonymousComponent } from '@app/shared/components/form-access-code-anonymous.component';

@Component({
	selector: 'app-form-mdra-licence-access-code',
	template: `
		<app-form-access-code-anonymous
			(linkSuccess)="onLinkSuccess($event)"
			[form]="form"
			[serviceTypeCode]="serviceTypeCode"
			[applicationTypeCode]="applicationTypeCode"
		></app-form-access-code-anonymous>
	`,
	styles: [],
	standalone: false,
})
export class FormMdraLicenceAccessCodeComponent {
	@Input() form!: FormGroup;
	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() linkSuccess: EventEmitter<LicenceResponse> = new EventEmitter<LicenceResponse>();

	@ViewChild(FormAccessCodeAnonymousComponent) formAccessCodeComponent!: FormAccessCodeAnonymousComponent;

	onLinkSuccess(linkLicence: LicenceResponse): void {
		this.linkSuccess.emit(linkLicence);
	}

	searchByAccessCode(): void {
		this.formAccessCodeComponent.searchByAccessCode();
	}
}
