import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SwlCategoryTypeCode } from 'src/app/api/models';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { LocksmithRequirementCode } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-locksmith',
	template: `
		<div class="text-minor-heading mb-2">Proof of experience or training required</div>

		<form [formGroup]="form" novalidate>
			<div class="alert alert-category d-flex" role="alert">
				<div>
					To qualify for a locksmith security worker licence, you must meet one of the following experience and training
					requirements. Whether a particular apprenticeship program or locksmithing course is approved by the registrar
					will be based on a review of program or course content, and training time for each component of the
					apprenticeship or course:

					<mat-radio-group class="category-radio-group" aria-label="Select an option" formControlName="requirementCode">
						<mat-radio-button class="radio-label" [value]="locksmithRequirementCodes.CertificateOfQualification">
							A Locksmith Certificate of Qualification
							<mat-icon
								class="info-icon"
								matTooltip="Issued under the 'Industry Training Authority Act' or the 'Industry Training and Apprenticeship Act'"
							>
								info
							</mat-icon>
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" [value]="locksmithRequirementCodes.ExperienceAndApprenticeship">
							Two years experience of full-time employment as a locksmith under the supervision of a locksmith security
							worker licensee, and proof of successful completion of an approved apprenticeship program
							<mat-icon
								class="info-icon"
								matTooltip="You must provide a letter of recommendation and certification from your employer indicating that you are qualified to perform the services of a locksmith unsupervised. Your work experience must be from within the past five years."
							>
								info
							</mat-icon>
						</mat-radio-button>
						<mat-divider class="my-2"></mat-divider>
						<mat-radio-button class="radio-label" [value]="locksmithRequirementCodes.ApprovedLocksmithCourse">
							Proof of successful completion of an approved locksmithing course, proof of experience in full-time
							employment as a locksmith under the supervision of a locksmith security worker licensee, and a letter of
							recommendation and certification from your employer indicating that you are qualified to perform the
							services of a locksmith unsupervised.
						</mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('requirementCode')?.dirty || form.get('requirementCode')?.touched) &&
							form.get('requirementCode')?.invalid &&
							form.get('requirementCode')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div *ngIf="requirementCode.value" @showHideTriggerSlideAnimation>
				<div class="fs-6 fw-bold mb-2">
					<span *ngIf="requirementCode.value == locksmithRequirementCodes.CertificateOfQualification">
						Upload a copy of your certificate:
					</span>
					<span *ngIf="requirementCode.value == locksmithRequirementCodes.ExperienceAndApprenticeship">
						Upload a letter of recommendation:
						<div class="fw-normal mb-2">
							This letter must be on company letterhead, and proof of successful completion of an approved
							apprenticeship program, other than that provided by the <i>Industry Training Authority</i>.
						</div>
					</span>
					<span *ngIf="requirementCode.value == locksmithRequirementCodes.ApprovedLocksmithCourse">
						Upload a letter of recommendation:
						<div class="fw-normal mb-2">
							This letter must be on company letterhead, proof of experience, and proof of successful completion of an
							approved course.
						</div>
					</span>
				</div>
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
})
export class LicenceCategoryLocksmithComponent implements OnInit, LicenceFormStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryLocksmithFormGroup;
	title = '';

	swlCategoryTypeCodes = SwlCategoryTypeCode;
	matcher = new FormErrorStateMatcher();

	locksmithRequirementCodes = LocksmithRequirementCode;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(SwlCategoryTypeCode.Locksmith, 'SwlCategoryTypes');
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

	public get requirementCode(): FormControl {
		return this.form.get('requirementCode') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
