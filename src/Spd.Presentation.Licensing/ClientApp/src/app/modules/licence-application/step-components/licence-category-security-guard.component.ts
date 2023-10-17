import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-guard',
	template: `
		<div class="fs-5 mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					<div class="fs-5 mb-2">Experience:</div>
					To qualify for a security guard security worker licence, you must meet one of the following training or
					experience requirements:
					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirement">
						<mat-radio-button class="radio-label" value="a">
							Basic Security Training Certificate issued by the Justice Institute of British Columbia (JIBC)
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" value="b">
							Proof of training or experience providing general duties as a Canadian police officer, correctional
							officer, sheriff, auxiliary, reserve, or border service officer
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" value="c">
							Certificate equivalent to the Basic Security Training course offered by JIBC
						</mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('requirement')?.dirty || form.get('requirement')?.touched) &&
							form.get('requirement')?.invalid &&
							form.get('requirement')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div *ngIf="requirement.value" @showHideTriggerSlideAnimation>
				<div class="text-minor-heading mb-2" *ngIf="requirement.value == 'b'; else uploadcopy">
					Upload a training certificate or reference letter from your employment supervisor or human resources office:
				</div>
				<ng-template #uploadcopy>
					<div class="text-minor-heading mb-2">Upload a copy of your certificate:</div>
				</ng-template>
				<div class="my-2">
					<app-file-upload
						[maxNumberOfFiles]="10"
						[files]="attachments.value"
						(filesChanged)="onFilesChanged()"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.category-radio-group > .radio-label .mdc-label {
				font-size: initial;
				color: initial;
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
	encapsulation: ViewEncapsulation.None,
})
export class LicenceCategorySecurityGuardComponent implements OnInit, OnDestroy, LicenceFormStepComponent {
	// private licenceModelLoadedSubscription!: Subscription;

	form: FormGroup = this.licenceApplicationService.categorySecurityGuardFormGroup;
	title = '';

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(SwlCategoryTypeCode.SecurityGuard, 'SwlCategoryTypes');
	}

	ngOnDestroy() {
		// this.licenceModelLoadedSubscription.unsubscribe();
	}

	isFormValid(): boolean {
		this.onFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFilesChanged(): void {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: [];
		this.form.controls['attachments'].setValue(attachments);
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
