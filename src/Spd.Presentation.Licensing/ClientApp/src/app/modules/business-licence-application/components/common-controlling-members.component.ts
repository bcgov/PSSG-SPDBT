import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
	ApplicationPortalStatusCode,
	BizMemberResponse,
	ControllingMemberInvitesCreateResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	NonSwlContactInfo,
	SwlContactInfo,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BizMembersService } from '@app/api/services';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import { take, tap } from 'rxjs';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from '../../../shared/components/modal-lookup-by-licence-number.component';
import { ModalMemberWithoutSwlEditComponent } from './modal-member-without-swl-edit.component';

@Component({
	selector: 'app-common-controlling-members',
	template: `
		<form [formGroup]="form" novalidate>
			<mat-accordion multi="true">
				<mat-expansion-panel class="mat-expansion-panel-border my-2 w-100" [expanded]="defaultExpanded">
					<mat-expansion-panel-header>
						<mat-panel-title>Controlling Members with a Security Worker Licence</mat-panel-title>
					</mat-expansion-panel-header>

					<ng-container *ngIf="!controllingMembersExist">
						<div class="fs-5 my-3">No controlling members with a Security Worker Licence exist</div>
					</ng-container>

					<div class="row mt-2" *ngIf="controllingMembersWithSwlExist">
						<div class="col-12">
							<mat-table [dataSource]="dataSourceWithSWL">
								<ng-container matColumnDef="licenceHolderName">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Full Name</mat-header-cell>
									<mat-cell *matCellDef="let member">
										<span class="mobile-label">Full Name:</span>
										{{ member.licenceHolderName | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="licenceNumber">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>
										Security Worker Licence Number
									</mat-header-cell>
									<mat-cell *matCellDef="let member">
										<span class="mobile-label">Security Worker Licence Number:</span>
										{{ member.licenceNumber | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="licenceStatusCode">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Licence Status</mat-header-cell>
									<mat-cell *matCellDef="let member">
										<span class="mobile-label">Status:</span>
										{{ member.licenceStatusCode | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="expiryDate">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Expiry Date</mat-header-cell>
									<mat-cell *matCellDef="let member">
										<span class="mobile-label">Expiry Date:</span>
										{{ member.expiryDate | formatDate | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action1">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let member; let i = index">
										<button
											mat-flat-button
											class="table-button w-auto"
											style="color: var(--color-red);"
											aria-label="Remove controlling member"
											(click)="onRemoveMember(member.bizContactId, true, i)"
										>
											<mat-icon>delete_outline</mat-icon>Remove
										</button>
									</mat-cell>
								</ng-container>

								<mat-header-row *matHeaderRowDef="columnsWithSWL; sticky: true"></mat-header-row>
								<mat-row class="mat-data-row" *matRowDef="let row; columns: columnsWithSWL"></mat-row>
							</mat-table>
						</div>
					</div>

					<div class="row mt-3" *ngIf="!isMaxNumberOfControllingMembers">
						<div class="col-md-12 mb-2" [ngClass]="isWizard ? 'col-lg-7 col-xl-6' : 'col-lg-6 col-xl-5'">
							<a
								class="large"
								tabindex="0"
								(click)="onAddMemberWithSWL()"
								(keydown)="onKeydownAddMemberWithSWL($event)"
							>
								Add Member with a Security Worker Licence
							</a>
						</div>
					</div>
				</mat-expansion-panel>

				<mat-expansion-panel class="mat-expansion-panel-border my-3 w-100" [expanded]="defaultExpanded">
					<mat-expansion-panel-header>
						<mat-panel-title>Controlling Members without a Security Worker Licence</mat-panel-title>
					</mat-expansion-panel-header>

					<ng-container *ngIf="!controllingMembersWithoutSwlExist">
						<div class="fs-5 my-3">No controlling members without a Security Worker Licence exist</div>
					</ng-container>

					<div class="row mt-2" *ngIf="controllingMembersWithoutSwlExist">
						<div class="col-12 mb-3">
							<mat-table [dataSource]="dataSourceWithoutSWL">
								<ng-container matColumnDef="licenceHolderName">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Full Name</mat-header-cell>
									<mat-cell *matCellDef="let member">
										<span class="mobile-label">Full Name:</span>
										{{ member.licenceHolderName | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="email">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef> Email </mat-header-cell>
									<mat-cell class="mat-cell-email" *matCellDef="let member">
										<span class="mobile-label">Email:</span>
										{{ member.emailAddress | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="inviteStatusCode">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef> Status </mat-header-cell>
									<mat-cell *matCellDef="let member">
										<span class="mobile-label">Status:</span>
										{{ getMemberWithoutSwlStatus(member) | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action1">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let member">
										<button
											mat-flat-button
											class="table-button"
											style="color: var(--color-green);"
											aria-label="Edit controlling member"
											(click)="onEditMemberWithoutSWL(member)"
										>
											<mat-icon>edit</mat-icon>Edit
										</button>
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action2">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let member; let i = index">
										<button
											mat-flat-button
											class="table-button w-auto"
											style="color: var(--color-red);"
											aria-label="Remove controlling member"
											(click)="onRemoveMember(member.bizContactId, false, i)"
										>
											<mat-icon>delete_outline</mat-icon>Remove
										</button>
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action3">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell *matCellDef="let member">
										<ng-container *ngIf="member.emailAddress; else noEmailAddress">
											<button
												mat-stroked-button
												class="w-100 invitation-button"
												aria-label="Send invitation"
												(click)="onSendInvitation(member)"
											>
												{{ getInvitationButtonLabel(member.controllingMemberAppStatusCode) }}
											</button>
										</ng-container>
										<ng-template #noEmailAddress>
											<a
												mat-stroked-button
												class="w-100"
												aria-label="Download Business Member Auth Consent"
												download="Business Member Auth Consent"
												matTooltip="Download Business Member Auth Consent"
												[href]="downloadFilePath"
												><mat-icon>download</mat-icon>Manual Form</a
											>
										</ng-template>
									</mat-cell>
								</ng-container>

								<mat-header-row *matHeaderRowDef="columnsWithoutSWL; sticky: true"></mat-header-row>
								<mat-row class="mat-data-row invitation-row" *matRowDef="let row; columns: columnsWithoutSWL"></mat-row>
							</mat-table>
						</div>
						<app-alert type="info" icon="">
							<p>
								By clicking <strong>Send</strong> or <strong>Update Invitation</strong>, a link to an online application
								form will be sent to the controlling member via email. They must provide personal information and
								consent to a criminal record check.
							</p>
							<p>
								We must receive criminal record check consent forms from each individual listed here before the business
								licence application will be reviewed.
							</p>
						</app-alert>
					</div>

					<div class="row">
						<ng-container *ngIf="isMaxNumberOfControllingMembers; else CanAddMember2">
							<div class="col-12">
								<app-alert type="warning" icon="warning">
									<div>The maximum number of controlling members has been reached</div>
								</app-alert>
							</div>
						</ng-container>
						<ng-template #CanAddMember2>
							<div class="col-md-12 mb-2" [ngClass]="isWizard ? 'col-lg-7 col-xl-6' : 'col-lg-6 col-xl-5'">
								<a
									class="large"
									tabindex="0"
									(click)="onAddMemberWithoutSWL()"
									(keydown)="onKeydownAddMemberWithoutSWL($event)"
								>
									Add Member without a Security Worker Licence
								</a>
							</div>
						</ng-template>
					</div>

					<div class="mt-2" *ngIf="allowDocumentUpload" @showHideTriggerSlideAnimation>
						<mat-divider class="mat-divider-main my-3"></mat-divider>
						<div class="text-minor-heading lh-base mb-2">
							Upload a copy of the corporate registry documents for your business in the province in which you are
							originally registered
							<span *ngIf="!attachmentIsRequired.value" class="optional-label">(optional)</span>
						</div>
						<app-file-upload
							(fileUploaded)="onFileUploaded($event)"
							(fileRemoved)="onFileRemoved()"
							[control]="attachments"
							[maxNumberOfFiles]="10"
							[files]="attachments.value"
						></app-file-upload>
						<mat-error
							class="mat-option-error d-block"
							*ngIf="
								(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
								form.get('attachments')?.invalid &&
								form.get('attachments')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>

					<div
						class="mt-3"
						*ngIf="(form.dirty || form.touched) && form.invalid && form.hasError('controllingmembersmin')"
					>
						<mat-error class="mat-option-error">At least one controlling member is required</mat-error>
					</div>
				</mat-expansion-panel>
			</mat-accordion>
		</form>
	`,
	styles: [
		`
			.invitation-row {
				min-height: 64px !important;
			}

			.invitation-button {
				height: fit-content;
			}

			.mat-column-action1 {
				min-width: 150px;
				max-width: 150px;
				.table-button {
					min-width: 130px;
				}
			}
			.mat-column-action2 {
				min-width: 150px;
				max-width: 150px;
				.table-button {
					min-width: 130px;
				}
			}
			.mat-column-action3 {
				min-width: 200px;
				max-width: 200px;
				.table-button {
					min-width: 130px;
				}
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
})
export class CommonControllingMembersComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	downloadFilePath = SPD_CONSTANTS.files.businessMemberAuthConsentManualForm;

	bizId!: string;
	form = this.businessApplicationService.controllingMembersFormGroup;

	@Input() defaultExpanded = false;
	@Input() isWizard = false;

	isBcBusinessAddress = true;
	allowDocumentUpload = false;

	dataSourceWithSWL!: MatTableDataSource<any>;
	columnsWithSWL: string[] = ['licenceHolderName', 'licenceNumber', 'licenceStatusCode', 'expiryDate', 'action1'];

	dataSourceWithoutSWL!: MatTableDataSource<NonSwlContactInfo>;
	columnsWithoutSWL: string[] = ['licenceHolderName', 'email', 'inviteStatusCode', 'action1', 'action2', 'action3'];

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private formBuilder: FormBuilder,
		private dialog: MatDialog,
		private optionsPipe: OptionsPipe,
		private authUserBceidService: AuthUserBceidService,
		private hotToastService: HotToastService,
		private bizMembersService: BizMembersService,
		private businessApplicationService: BusinessApplicationService
	) {}

	ngOnInit(): void {
		this.bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		this.isBcBusinessAddress = this.businessApplicationService.isBcBusinessAddress();

		this.dataSourceWithSWL = new MatTableDataSource(this.membersWithSwlList.value);
		this.dataSourceWithoutSWL = new MatTableDataSource(this.membersWithoutSwlList.value);
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	getMemberWithoutSwlStatus(member: NonSwlContactInfo): string | null {
		if (member.controllingMemberAppStatusCode) {
			return `${this.optionsPipe.transform(
				member.controllingMemberAppStatusCode,
				'ApplicationPortalStatuses'
			)} Application`;
		}
		if (member.inviteStatusCode) {
			return `${this.optionsPipe.transform(member.inviteStatusCode, 'ApplicationInviteStatuses')} Invitation`;
		}
		return null;
	}

	getInvitationButtonLabel(controllingMemberAppStatusCode?: ApplicationPortalStatusCode): string {
		if (controllingMemberAppStatusCode === ApplicationPortalStatusCode.CompletedCleared) {
			return 'Send Update Invitation';
		}
		return 'Send New Invitation';
	}

	onRemoveMember(bizContactId: string, isWithSwl: boolean, index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this member?',
			actionText: 'Yes, remove',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				this.controllingMemberChanged();

				if (response) {
					this.bizMembersService
						.apiBusinessBizIdMembersBizContactIdDelete({
							bizId: this.bizId,
							bizContactId,
						})
						.subscribe((_resp: any) => {
							if (isWithSwl) {
								this.membersWithSwlList.removeAt(index);
								this.dataSourceWithSWL.data = this.membersWithSwlList.value;
							} else {
								this.membersWithoutSwlList.removeAt(index);
								this.dataSourceWithoutSWL.data = this.membersWithoutSwlList.value;
							}

							this.hotToastService.success('The member has been successfully removed');
						});
				}
			});
	}

	onAddMemberWithSWL(): void {
		const dialogOptions: LookupByLicenceNumberDialogData = {
			title: 'Add Member with Security Worker Licence',
			lookupWorkerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence,
			notValidSwlMessage: `'Cancel' to exit this dialog and then add them as a member without a security worker licence to proceed.`,
			isExpiredLicenceSearch: false,
			isLoggedIn: true,
		};
		this.dialog
			.open(ModalLookupByLicenceNumberComponent, {
				width: '800px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData: LicenceResponse = resp?.data;
				if (memberData) {
					this.controllingMemberChanged();

					const body = {
						bizContactId: null,
						contactId: memberData.licenceHolderId,
						licenceId: memberData.licenceId,
					} as SwlContactInfo;

					this.bizMembersService
						.apiBusinessBizIdSwlControllingMembersPost({
							bizId: this.bizId,
							body,
						})
						.subscribe((resp: BizMemberResponse) => {
							this.membersWithSwlList.push(this.newMemberRow(resp.bizContactId!, memberData));
							this.dataSourceWithSWL.data = this.membersWithSwlList.value;

							this.hotToastService.success('The member has been successfully added');
						});
				}
			});
	}

	onKeydownAddMemberWithSWL(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onAddMemberWithSWL();
	}

	onEditMemberWithoutSWL(member: NonSwlContactInfo): void {
		this.memberDialogWithoutSWL(member, false);
	}

	onSendInvitation(member: NonSwlContactInfo): void {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: `Are you sure you send an invitation to ${member.emailAddress}?`,
			actionText: 'Yes',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.businessApplicationService
						.sendControllingMembersWithoutSwlInvitation(member.bizContactId!, member.controllingMemberAppStatusCode)
						.pipe(
							tap((_resp: ControllingMemberInvitesCreateResponse) => {
								if (_resp.createSuccess) {
									this.hotToastService.success('Invitation was successfully sent');
									// TODO update status to 'Sent' ?
								}
							}),
							take(1)
						)
						.subscribe();
				}
			});
	}

	onAddMemberWithoutSWL(): void {
		this.memberDialogWithoutSWL({}, true);
	}

	onKeydownAddMemberWithoutSWL(event: KeyboardEvent) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onAddMemberWithoutSWL();
	}

	onFileUploaded(file: File): void {
		this.businessApplicationService.hasValueChanged = true;

		if (!this.businessApplicationService.isAutoSave()) {
			return;
		}

		this.businessApplicationService
			.addUploadDocument(LicenceDocumentTypeCode.CorporateRegistryDocument, file)
			.subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.fileUploadComponent.removeFailedFile(file);
				},
			});
	}

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	// TODO isCrcWithoutSwlReadonly remove?
	// isCrcWithoutSwlReadonly(member: ControllingMemberContactInfo): boolean {
	// 	return (
	// 		!member.inviteStatusCode ||
	// 		member.inviteStatusCode === ApplicationInviteStatusCode.Draft ||
	// 		member.inviteStatusCode === ApplicationInviteStatusCode.Sent
	// 	);
	// }

	private controllingMemberChanged(): void {
		// document upload only needed in wizard flow
		if (!this.isWizard) {
			return;
		}

		this.allowDocumentUpload = true;
		this.form.patchValue({ attachmentIsRequired: !this.isBcBusinessAddress });
	}

	private memberDialogWithoutSWL(dialogOptions: any, isCreate: boolean): void {
		this.dialog
			.open(ModalMemberWithoutSwlEditComponent, {
				width: '800px',
				data: dialogOptions,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData = resp?.data;
				if (memberData) {
					if (isCreate) {
						this.bizMembersService
							.apiBusinessBizIdNonSwlControllingMembersPost({
								bizId: this.bizId,
								body: memberData,
							})
							.subscribe((resp: BizMemberResponse) => {
								this.controllingMemberChanged();
								this.membersWithoutSwlList.push(this.newMemberRow(resp.bizContactId!, memberData));
								this.dataSourceWithoutSWL.data = this.membersWithoutSwlList.value;

								this.hotToastService.success('The member has been successfully added');
							});
					} else {
						this.bizMembersService
							.apiBusinessBizIdNonSwlControllingMembersBizContactIdPut({
								bizId: this.bizId,
								bizContactId: dialogOptions.bizContactId!,
								body: memberData,
							})
							.subscribe((_resp: BizMemberResponse) => {
								const memberIndex = this.membersWithoutSwlList.value.findIndex(
									(item: any) => item.bizContactId == dialogOptions.bizContactId!
								);
								this.patchMemberData(memberIndex, memberData);
								this.dataSourceWithoutSWL.data = this.membersWithoutSwlList.value;

								this.hotToastService.success('The member has been successfully updated');
							});
					}
				}
			});
	}

	private newMemberRow(bizContactId: string, memberData: any): FormGroup {
		return this.formBuilder.group({
			licenceHolderName: [memberData.licenceHolderName ?? `${memberData.givenName} ${memberData.surname}`],
			bizContactId: bizContactId,
			contactId: [memberData.licenceHolderId],
			givenName: [memberData.givenName],
			middleName1: [memberData.middleName1],
			middleName2: [memberData.middleName2],
			surname: [memberData.surname],
			emailAddress: [memberData.emailAddress],
			noEmailAddress: [memberData.noEmailAddress],
			phoneNumber: [memberData.phoneNumber],
			licenceId: [memberData.licenceId],
			licenceNumber: [memberData.licenceNumber],
			licenceStatusCode: [memberData.licenceStatusCode],
			licenceTermCode: [memberData.licenceTermCode],
			expiryDate: [memberData.expiryDate],
			inviteStatusCode: [memberData.inviteStatusCode],
		});
	}

	private patchMemberData(memberIndex: number, memberData: any) {
		if (memberIndex < 0) {
			return;
		}

		this.membersWithoutSwlList.at(memberIndex).patchValue({
			licenceHolderName: memberData.licenceHolderName ?? `${memberData.givenName} ${memberData.surname}`,
			bizContactId: memberData.bizContactId,
			givenName: memberData.givenName,
			middleName1: memberData.middleName1,
			middleName2: memberData.middleName2,
			surname: memberData.surname,
			emailAddress: memberData.emailAddress,
			noEmailAddress: memberData.noEmailAddress,
			licenceId: memberData.licenceId,
			licenceNumber: memberData.licenceNumber,
			licenceStatusCode: memberData.licenceStatusCode,
			licenceTermCode: memberData.licenceTermCode,
			expiryDate: memberData.expiryDate,
			inviteStatusCode: memberData.inviteStatusCode,
		});
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
	get attachmentIsRequired(): FormControl {
		return this.form.get('attachmentIsRequired') as FormControl;
	}
	get membersWithSwlList(): FormArray {
		return <FormArray>this.form.get('membersWithSwl');
	}
	get membersWithoutSwlList(): FormArray {
		return <FormArray>this.form.get('membersWithoutSwl');
	}
	get controllingMembersExist(): boolean {
		return this.dataSourceWithSWL.data.length > 0 || this.dataSourceWithoutSWL.data.length > 0;
	}
	get controllingMembersWithSwlExist(): boolean {
		return this.dataSourceWithSWL.data.length > 0;
	}
	get controllingMembersWithoutSwlExist(): boolean {
		return this.dataSourceWithoutSWL.data.length > 0;
	}
	get numberOfControllingMembers(): number {
		return this.dataSourceWithSWL.data.length + this.dataSourceWithoutSWL.data.length;
	}
	get isMaxNumberOfControllingMembers(): boolean {
		return this.numberOfControllingMembers >= SPD_CONSTANTS.maxCount.controllingMembers;
	}
}
