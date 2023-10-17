import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { OptionsPipe } from 'src/app/shared/pipes/options.pipe';
import { LicenceApplicationService, LicenceFormStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-licence-category-security-alarm-installer',
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
										To qualify for a security alarm installer security worker licence, you must meet one of the
										following experience requirements:

										<mat-radio-group
											class="category-radio-group"
											aria-label="Select an option"
											formControlName="requirement"
										>
											<mat-radio-button class="radio-label" value="a">
												Trades Qualification Certificate
											</mat-radio-button>
											<mat-divider class="my-2"></mat-divider>
											<mat-radio-button class="radio-label" value="b">
												Experience or training equivalent to the Trades Qualification Certificate
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
										<span *ngIf="requirement.value == 'a'"> Upload a copy of your certificate: </span>
										<span *ngIf="requirement.value == 'b'">
											Upload document(s) providing proof of equivalent training:
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
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class LicenceCategorySecurityAlarmInstallerComponent implements OnInit, LicenceFormStepComponent {
	form: FormGroup = this.licenceApplicationService.categorySecurityAlarmInstallerFormGroup;
	title = '';

	@Input() option: string | null = null;
	@Input() index: number = 0;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private optionsPipe: OptionsPipe, private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		this.title = this.optionsPipe.transform(this.option, 'SwlCategoryTypes');
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
