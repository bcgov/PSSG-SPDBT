import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';

@Component({
	selector: 'app-step-permit-photograph-of-yourself-anonymous',
	template: `
		<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New; else isRenewOrUpdate">
			<app-step-permit-photograph-of-yourself-new [form]="form"></app-step-permit-photograph-of-yourself-new>
		</ng-container>

		<ng-template #isRenewOrUpdate>
			<app-step-permit-photograph-of-yourself-renew-and-update
				[form]="form"
			></app-step-permit-photograph-of-yourself-renew-and-update>
		</ng-template>

		<!-- <section class="step-section">
			<div class="step">
				<app-step-title class="fs-7" [title]="title" [subtitle]="subtitle"></app-step-title>

				<div class="row mb-3" *ngIf="isRenewalOrUpdate && photographOfYourself">
					<div class="col-12 text-center">
						<div class="fs-5 mb-2">Current permit photo:</div>
						<img
							[src]="photographOfYourself"
							alt="Photograph of yourself"
							style="max-height: 200px;max-width: 200px;"
						/>
					</div>
				</div>

				<app-common-photograph-of-yourself
					[form]="form"
					name="permit"
					(fileRemoved)="onFileRemoved()"
				></app-common-photograph-of-yourself>
			</div>
		</section> -->
	`,
	styles: [],
})
export class StepPermitPhotographOfYourselfAnonymousComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	form: FormGroup = this.permitApplicationService.photographOfYourselfFormGroup;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	constructor(private permitApplicationService: PermitApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}

// 	applicationTypeCodes = ApplicationTypeCode;
// 	title = '';
// 	subtitle = '';

// 	photographOfYourself = this.permitApplicationService.photographOfYourself;

// 	form: FormGroup = this.permitApplicationService.photographOfYourselfFormGroup;

// 	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

// 	@ViewChild(CommonPhotographOfYourselfComponent)
// 	commonPhotographOfYourselfComponent!: CommonPhotographOfYourselfComponent;

// 	constructor(private permitApplicationService: PermitApplicationService) {}

// 	ngOnInit(): void {
// 		if (this.isRenewalOrUpdate) {
// 			this.title = 'Your photograph of yourself';
// 			this.subtitle = 'Update any information that has changed since your last application';
// 		} else {
// 			this.title = 'Upload a photograph of yourself';
// 			this.subtitle = 'This will appear on your permit. It must be a passport-quality photo of your face looking straight at the camera against a plain, white background. It must be from within the last year.';
// 		}
// 	}

// 	onFileRemoved(): void {
// 		this.permitApplicationService.hasValueChanged = true;
// 	}

// 	isFormValid(): boolean {
// 		this.form.markAllAsTouched();
// 		return this.form.valid;
// 	}

// 	get attachments(): FormControl {
// 		return this.form.get('attachments') as FormControl;
// 	}

// 	get isRenewalOrUpdate(): boolean {
// 		return (
// 			this.applicationTypeCode === ApplicationTypeCode.Renewal ||
// 			this.applicationTypeCode === ApplicationTypeCode.Update
// 		);
// 	}
// }
