import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerAnimation, showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode, RestraintDocumentTypes } from 'src/app/core/code-types/model-desc.models';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-restraints-authorization',
	template: `
		<section [ngClass]="isCalledFromModal ? 'step-section-modal' : 'step-section p-3'">
			<div class="step">
				<app-step-title
					*ngIf="!isCalledFromModal"
					title="Do you want to request authorization to use restraints?"
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row" *ngIf="!isCalledFromModal">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="carryAndUseRetraints">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('carryAndUseRetraints')?.dirty || form.get('carryAndUseRetraints')?.touched) &&
										form.get('carryAndUseRetraints')?.invalid &&
										form.get('carryAndUseRetraints')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div class="row" *ngIf="carryAndUseRetraints.value == booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
							<div [ngClass]="isCalledFromModal ? 'col-12' : 'offset-md-2 col-md-8 col-sm-12'">
								<mat-divider class="mb-3 mt-4 mat-divider-primary" *ngIf="!isCalledFromModal"></mat-divider>

								<div class="text-minor-heading my-2">Document type:</div>
								<mat-radio-group
									class="category-radio-group"
									aria-label="Select an option"
									formControlName="carryAndUseRetraintsDocument"
								>
									<ng-container *ngFor="let doc of restraintDocumentTypes; let i = index">
										<mat-radio-button class="radio-label" [value]="doc.code">
											{{ doc.desc }}
										</mat-radio-button>
									</ng-container>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('carryAndUseRetraintsDocument')?.dirty ||
											form.get('carryAndUseRetraintsDocument')?.touched) &&
										form.get('carryAndUseRetraintsDocument')?.invalid &&
										form.get('carryAndUseRetraintsDocument')?.hasError('required')
									"
									>This is required</mat-error
								>

								<div class="text-minor-heading mt-4 mb-2">Upload your proof of qualification:</div>

								<div class="my-2">
									<app-file-upload
										(filesChanged)="onFilesChanged()"
										[control]="attachments"
										[maxNumberOfFiles]="10"
										[files]="attachments.value"
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
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerAnimation, showHideTriggerSlideAnimation],
})
export class RestraintsAuthorizationComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	restraintDocumentTypes = RestraintDocumentTypes;

	form: FormGroup = this.licenceApplicationService.restraintsAuthorizationFormGroup;

	@Input() isCalledFromModal: boolean = false;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	ngOnInit(): void {
		if (this.isCalledFromModal) {
			this.form.patchValue({
				carryAndUseRetraints: BooleanTypeCode.Yes,
			});
		}
	}

	onFilesChanged(): void {
		this.licenceApplicationService.hasDocumentsChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get carryAndUseRetraints(): FormControl {
		return this.form.get('carryAndUseRetraints') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
