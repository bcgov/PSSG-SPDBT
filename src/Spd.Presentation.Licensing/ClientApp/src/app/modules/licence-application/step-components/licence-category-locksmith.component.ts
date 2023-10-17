import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { SwlCategoryTypeCode } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-locksmith',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-9 col-lg-12">
							<div class="text-center">
								<span class="title" style="position: relative; top: -5px;">{{ title }}</span>
							</div>

							<mat-divider class="mt-1 mb-2"></mat-divider>

							<div class="fs-5 mb-2">Proof of experience or training required</div>

							<form [formGroup]="form" novalidate>
								<div class="alert alert-category d-flex" role="alert">
									<div>
										To qualify for a locksmith security worker licence, you must meet one of the following experience
										and training requirements. Whether a particular apprenticeship program or locksmithing course is
										approved by the registrar will be based on a review of program or course content, and training time
										for each component of the apprenticeship or course:

										<mat-radio-group
											class="category-radio-group"
											aria-label="Select an option"
											formControlName="requirement"
										>
											<mat-radio-button class="radio-label" value="a">
												A Locksmith Certificate of Qualification
												<mat-icon
													class="info-icon"
													matTooltip="Issued under the 'Industry Training Authority Act' or the 'Industry Training and Apprenticeship Act'"
												>
													info
												</mat-icon>
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="b">
												Two years experience of full-time employment as a locksmith under the supervision of a locksmith
												security worker licensee, and proof of successful completion of an approved apprenticeship
												program
												<mat-icon
													class="info-icon"
													matTooltip="You must provide a letter of recommendation and certification from your employer indicating that you are qualified to perform the services of a locksmith unsupervised. Your work experience must be from within the past five years."
												>
													info
												</mat-icon>
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="c">
												Proof of successful completion of an approved locksmithing course, proof of experience in
												full-time employment as a locksmith under the supervision of a locksmith security worker
												licensee, and a letter of recommendation and certification from your employer indicating that
												you are qualified to perform the services of a locksmith unsupervised.
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
									<div class="text-minor-heading mb-2">
										<span *ngIf="requirement.value == 'a'">Upload a copy of your certificate:</span>
										<span *ngIf="requirement.value == 'b'">
											Upload a letter of recommendation on company letterhead, and proof of successful completion of an
											approved apprenticeship program, other than that provided by the
											<i>Industry Training Authority</i>:
										</span>
										<span *ngIf="requirement.value == 'c'">
											Upload a letter of recommendation on company letterhead, proof of experience, and proof of
											successful completion of an approved course:
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
						</div>
					</div>
				</div>
			</div>
		</section>
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

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
