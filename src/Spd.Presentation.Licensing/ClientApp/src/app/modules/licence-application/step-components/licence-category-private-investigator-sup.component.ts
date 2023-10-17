import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-private-investigator-sup',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<div class="step-container">
					<div class="row">
						<div class="offset-xxl-2 col-xxl-8 offset-xl-1 col-xl-9 col-lg-12">
							<div class="text-center">
								<mat-chip-option [selectable]="false" class="mat-chip-green me-3">
									Category #{{ index }}
								</mat-chip-option>
								<span class="title" style="position: relative; top: -5px;">{{ title }}</span>
							</div>

							<mat-divider class="mt-1 mb-2"></mat-divider>

							<div class="fs-5 mb-2">Proof of experience or training required</div>

							<form [formGroup]="form" novalidate>
								<div class="alert alert-category d-flex" role="alert">
									<div>
										<div class="fs-5 mb-2">Experience:</div>
										To qualify for a private investigator under supervision licence, you must meet one of the following
										experience requirements:

										<mat-radio-group
											class="category-radio-group"
											aria-label="Select an option"
											formControlName="requirement"
										>
											<mat-radio-button class="radio-label" value="a">
												Successful completion of the Private Security Training Network (PSTnetwork) online course
												<i>Introduction to Private Investigation</i> and proof of final exam completion
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="b">
												Completion of courses or demonstrated knowledge in the areas of:
												<ul>
													<li>Criminal law</li>
													<li>Civil law and process</li>
													<li>Human rights legislation</li>
													<li>Information and privacy legislation</li>
													<li>Evidence recognition, presentation and protocols</li>
													<li>Interviewing techniques</li>
													<li>Report writing</li>
													<li>Documentary research (electronic and hard copy), and</li>
													<li>Surveillance techniques</li>
												</ul>
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
										<span *ngIf="requirement.value == 'a'"> Upload proof of course and exam completion: </span>
										<span *ngIf="requirement.value == 'b'">
											Upload document(s) providing proof of course completion or equivalent knowledge:
										</span>
									</div>

									<div class="my-2">
										<app-file-upload
											[maxNumberOfFiles]="10"
											#attachmentsRef
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

									<!-- <div class="row" *ngIf="requirement.value == 'a'">
										<div class="col-lg-4 col-md-12 col-sm-12">
											<mat-form-field>
												<mat-label>Document Expiry Date</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="documentExpiryDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('documentExpiryDate')?.hasError('required')"
													>This is required</mat-error
												>
											</mat-form-field>
										</div>
									</div> -->
								</div>

								<div class="alert alert-category d-flex mt-4" role="alert">
									<div>
										<div class="fs-5 mb-2">Training:</div>
										You must provide proof of successfully completing any of the above two listed course requirements.
									</div>
								</div>

								<div class="text-minor-heading mb-2">Upload proof of course completion:</div>

								<div class="my-2">
									<app-file-upload
										[maxNumberOfFiles]="10"
										#trainingattachmentsRef
										[files]="trainingattachments.value"
										(filesChanged)="onTrainingFilesChanged()"
									></app-file-upload>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(form.get('trainingattachments')?.dirty || form.get('trainingattachments')?.touched) &&
											form.get('trainingattachments')?.invalid &&
											form.get('trainingattachments')?.hasError('required')
										"
										>This is required</mat-error
									>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class LicenceCategoryPrivateInvestigatorSupComponent implements OnInit, LicenceFormStepComponent {
	form: FormGroup = this.licenceApplicationService.categoryPrivateInvestigatorUnderSupervisionFormGroup;
	matcher = new FormErrorStateMatcher();
	title = '';

	@Input() option: string | null = null;
	@Input() index: number = 0;

	@ViewChild('attachmentsRef') fileUploadComponent1!: FileUploadComponent;
	@ViewChild('trainingattachmentsRef') fileUploadComponent2!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(this.option, 'SwlCategoryTypes');
	}

	isFormValid(): boolean {
		this.onFilesChanged();
		this.onTrainingFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFilesChanged(): void {
		const attachments =
			this.fileUploadComponent1?.files && this.fileUploadComponent1?.files.length > 0
				? this.fileUploadComponent1.files
				: [];
		this.form.controls['attachments'].setValue(attachments);
	}

	onTrainingFilesChanged(): void {
		const attachments =
			this.fileUploadComponent2?.files && this.fileUploadComponent2?.files.length > 0
				? this.fileUploadComponent2.files
				: [];
		this.form.controls['trainingattachments'].setValue(attachments);
	}

	public get requirement(): FormControl {
		return this.form.get('requirement') as FormControl;
	}

	public get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}

	public get trainingattachments(): FormControl {
		return this.form.get('trainingattachments') as FormControl;
	}
}
