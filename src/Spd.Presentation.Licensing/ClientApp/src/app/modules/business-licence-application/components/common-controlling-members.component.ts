import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
	ApplicationInviteStatusCode,
	BizMemberResponse,
	ControllingMemberAppInviteTypeCode,
	ControllingMemberInvitesCreateResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	NonSwlContactInfo,
	ServiceTypeCode,
	SwlContactInfo,
} from '@app/api/models';
import { BizMembersService } from '@app/api/services';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { DialogComponent, DialogOptions } from '@app/shared/components/dialog.component';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import {
	LookupByLicenceNumberDialogData,
	ModalLookupByLicenceNumberComponent,
} from '@app/shared/components/modal-lookup-by-licence-number.component';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { HotToastService } from '@ngxpert/hot-toast';
import { take, tap } from 'rxjs';
import { BusinessLicenceApplicationRoutes } from '../business-license-application-routes';
import {
	MemberWithoutSWLDialogData,
	ModalMemberWithoutSwlEditComponent,
} from './modal-member-without-swl-edit.component';

@Component({
	selector: 'app-common-controlling-members',
	template: `
		<form [formGroup]="form" novalidate>
			<mat-accordion multi="true">
				<mat-expansion-panel class="mat-expansion-panel-border my-2 w-100" [expanded]="defaultExpanded">
					<mat-expansion-panel-header>
						<mat-panel-title>Members with a Security Worker Licence</mat-panel-title>
					</mat-expansion-panel-header>

					<div class="row mt-2" *ngIf="controllingMembersWithSwlExist; else noControllingMembersWithSwlExist">
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
									<mat-cell class="mat-column-action1" *matCellDef="let member; let i = index">
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
					<ng-template #noControllingMembersWithSwlExist>
						<div class="fs-5 my-3">No controlling members with a Security Worker Licence exist</div>
					</ng-template>

					<div class="row mt-3" *ngIf="!isMaxNumberOfControllingMembers">
						<div class="col-md-12 mb-2" [ngClass]="isWizard ? 'col-lg-7 col-xl-6' : 'col-lg-6 col-xl-5'">
							<a
								class="large"
								tabindex="0"
								(click)="onAddMemberWithSWL()"
								(keydown)="onKeydownAddMemberWithSWL($event)"
								*ngIf="!isReadonly"
							>
								Add Member with a Security Worker Licence
							</a>
						</div>
					</div>
				</mat-expansion-panel>

				<mat-expansion-panel class="mat-expansion-panel-border my-3 w-100" [expanded]="defaultExpanded">
					<mat-expansion-panel-header>
						<mat-panel-title>Members without a Security Worker Licence</mat-panel-title>
					</mat-expansion-panel-header>

					<div class="row mt-2" *ngIf="controllingMembersWithoutSwlExist; else noControllingMembersWithoutSwlExist">
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
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Email</mat-header-cell>
									<mat-cell class="mat-cell-email" *matCellDef="let member">
										<span class="mobile-label">Email:</span>
										{{ member.emailAddress | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="inviteStatusCode">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef>Invitation Status</mat-header-cell>
									<mat-cell class="mat-column-inviteStatusCode" *matCellDef="let member">
										<span class="mobile-label">Invitation Status:</span>
										{{ member.inviteStatusCode | default }}
									</mat-cell>
								</ng-container>

								<ng-container matColumnDef="action1">
									<mat-header-cell class="mat-table-header-cell" *matHeaderCellDef></mat-header-cell>
									<mat-cell class="mat-column-action1" *matCellDef="let member">
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
											<ng-container *ngIf="isAllowUpdateInvitation(member.inviteStatusCode)">
												<a
													tabindex="0"
													class="w-100 invitation-button"
													aria-label="Send update invitation"
													(click)="onSendUpdateInvitation(member)"
													(keydown)="onKeydownSendUpdateInvitation($event, member)"
												>
													Send Update Invitation
												</a>
											</ng-container>
										</ng-container>
										<ng-template #noEmailAddress>
											<ng-container *ngIf="allowNewInvitationsToBeSent">
												<a
													class="w-100 invitation-button"
													aria-label="Download Consent to Criminal Record Check document"
													download="business-memberauthconsent"
													matTooltip="Download Consent to Criminal Record Check document"
													[href]="downloadFilePath"
												>
													Download Manual Form
												</a>
											</ng-container>
										</ng-template>
									</mat-cell>
								</ng-container>

								<mat-header-row *matHeaderRowDef="columnsWithoutSWL; sticky: true"></mat-header-row>
								<mat-row class="mat-data-row invitation-row" *matRowDef="let row; columns: columnsWithoutSWL"></mat-row>
							</mat-table>
						</div>
						<ng-container *ngIf="canSendUpdateInvitations">
							<app-alert type="info" icon="info">
								When an update invitation is issued, the controlling member will receive a link to an online application
								form via email. They can update personal information and consent to a criminal record check.
							</app-alert>
						</ng-container>
						<ng-container *ngIf="isApplDraftOrWaitingForPayment">
							<app-alert type="warning" icon="warning">
								We must receive criminal record check consent forms from each individual listed here before the business
								licence application will be reviewed.
							</app-alert>
						</ng-container>
					</div>
					<ng-template #noControllingMembersWithoutSwlExist>
						<div class="fs-5 my-3">No controlling members without a Security Worker Licence exist</div>
					</ng-template>

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
									aria-label="Add a Member without a Security Worker Licence"
									(click)="onAddMemberWithoutSWL()"
									(keydown)="onKeydownAddMemberWithoutSWL($event)"
									*ngIf="!isReadonly"
								>
									Add Member without a Security Worker Licence
								</a>
							</div>
						</ng-template>
					</div>
				</mat-expansion-panel>
			</mat-accordion>

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

			<div class="mt-3" *ngIf="(form.dirty || form.touched) && form.invalid && form.hasError('controllingmembersmin')">
				<mat-error class="mat-option-error">At least one controlling member is required</mat-error>
			</div>
		</form>
	`,
	styles: [
		`
			.invitation-row {
				min-height: 64px !important;
			}

			.invitation-button {
				text-align: center !important;
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
				min-width: 180px;
				max-width: 180px;
				.table-button {
					min-width: 130px;
				}
			}
		`,
	],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class CommonControllingMembersComponent implements OnInit, LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	downloadFilePath = SPD_CONSTANTS.files.businessMemberAuthConsentManualForm;

	bizId!: string;
	form = this.businessApplicationService.controllingMembersFormGroup;

	@Input() defaultExpanded = false;
	@Input() isWizard = false;
	@Input() isApplDraftOrWaitingForPayment = false;
	@Input() isApplExists = false;
	@Input() isLicenceExists = false;
	@Input() isReadonly = false;

	isBcBusinessAddress = true;
	allowDocumentUpload = false;

	allowNewInvitationsToBeSent = false;
	allowUpdateInvitationsToBeSent = false;

	dataSourceWithSWL!: MatTableDataSource<any>;
	columnsWithSWL: string[] = ['licenceHolderName', 'licenceNumber', 'licenceStatusCode', 'expiryDate', 'action1'];

	dataSourceWithoutSWL!: MatTableDataSource<NonSwlContactInfo>;
	columnsWithoutSWL!: string[];

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private dialog: MatDialog,
		private utilService: UtilService,
		private optionsPipe: OptionsPipe,
		private authUserBceidService: AuthUserBceidService,
		private hotToastService: HotToastService,
		private bizMembersService: BizMembersService,
		private businessApplicationService: BusinessApplicationService
	) {}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}

		this.bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		this.isBcBusinessAddress = this.businessApplicationService.isBcBusinessAddress();

		//  'action1' - EDIT
		//  'action2' - REMOVE
		//  'action3' - INVITATIONS/DOWNLOAD

		// When in the wizard, the user cannot view the status or send / resend invitations.
		// This should occur automatically for the user when submitting the application.
		if (this.isWizard) {
			// In the wizard, the user cannot manually send invitations - remove 'action3'
			this.columnsWithoutSWL = ['licenceHolderName', 'email', 'action1', 'action2'];
		} else {
			if (this.isApplExists) {
				// User should not be in here for Draft
				if (this.isApplDraftOrWaitingForPayment) {
					// If appl exists in Draft or Payment Pending, you can send invitations
					this.allowNewInvitationsToBeSent = true;
					this.allowUpdateInvitationsToBeSent = false;

					// Only allow Edit in the wizard - remove 'action1'.
					// This way we can ensure invites are sent correctly.
					// Reduce complexity - don't have to handle user updates to email
					this.columnsWithoutSWL = ['licenceHolderName', 'email', 'inviteStatusCode', 'action2', 'action3'];
				} else {
					// if appl is in progress (after payment but no licence yet),
					// it is readonly and you cannot send invitations
					this.allowNewInvitationsToBeSent = false;
					this.allowUpdateInvitationsToBeSent = false;

					// if appl is in progress (after payment but no licence yet), it is readonly
					this.columnsWithoutSWL = ['licenceHolderName', 'email', 'inviteStatusCode'];
					this.columnsWithSWL = ['licenceHolderName', 'licenceNumber', 'licenceStatusCode', 'expiryDate'];
				}
			} else {
				// If no appl exists, you can make any changes but only send Update Invitations
				this.allowNewInvitationsToBeSent = false;
				this.allowUpdateInvitationsToBeSent = this.isLicenceExists;

				this.columnsWithoutSWL = ['licenceHolderName', 'email', 'action1', 'action2', 'action3'];
			}
		}

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

	onRemoveMember(bizContactId: string, isWithSwl: boolean, index: number) {
		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message: 'Are you sure you want to remove this member?',
			actionText: 'Remove',
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
			lookupServiceTypeCode: ServiceTypeCode.SecurityWorkerLicence,
			notValidSwlMessage: `'Cancel' to exit this dialog and then add them as a member without a security worker licence to proceed.`,
			isExpiredLicenceSearch: false,
			isLoggedIn: true,
			selectButtonLabel: 'Save',
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
					// Manager can't add employee if they are already listed as a employee
					const membersWithSwlArray = this.membersWithSwlList.value ?? [];
					const found = membersWithSwlArray.find((item: any) => item.licenceNumber === memberData.licenceNumber);
					if (found) {
						this.memberAlreadyListed();
						return;
					}

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

	isAllowUpdateInvitation(inviteStatusCode?: ApplicationInviteStatusCode): boolean {
		return this.canSendUpdateInvitations && inviteStatusCode === ApplicationInviteStatusCode.Completed;
	}

	onSendUpdateInvitation(member: NonSwlContactInfo): void {
		const message = `Does this controlling member need to report an update to their criminal record check?<br><br>A link will be sent to <b>${member.emailAddress}</b> so they can submit their information directly to the Security Programs Division.`;

		const data: DialogOptions = {
			icon: 'warning',
			title: 'Confirmation',
			message,
			actionText: 'Send',
			cancelText: 'Cancel',
		};

		this.dialog
			.open(DialogComponent, { data })
			.afterClosed()
			.subscribe((response: boolean) => {
				if (response) {
					this.businessApplicationService
						.sendControllingMembersWithoutSwlInvitation(member.bizContactId!, ControllingMemberAppInviteTypeCode.Update)
						.pipe(
							tap((_resp: ControllingMemberInvitesCreateResponse) => {
								if (_resp.createSuccess) {
									this.hotToastService.success('Invitation was successfully sent');

									if (!member.inviteStatusCode) {
										const memberIndex = this.membersWithoutSwlList.value.findIndex(
											(item: any) => item.bizContactId == member.bizContactId!
										);
										const memberData = this.membersWithoutSwlList.value.find(
											(item: any) => item.bizContactId == member.bizContactId!
										);
										// After sending invite - set status to Draft
										memberData.inviteStatusCode = ApplicationInviteStatusCode.Draft;
										this.patchMemberData(memberIndex, memberData);
										this.dataSourceWithoutSWL.data = this.membersWithoutSwlList.value;
									}
								}
							}),
							take(1)
						)
						.subscribe();
				}
			});
	}

	onKeydownSendUpdateInvitation(event: KeyboardEvent, member: NonSwlContactInfo) {
		if (event.key === 'Tab' || event.key === 'Shift') return; // If navigating, do not select

		this.onSendUpdateInvitation(member);
	}

	onAddMemberWithoutSWL(): void {
		this.memberDialogWithoutSWL(null, true);
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

	get canSendUpdateInvitations(): boolean {
		return !this.isWizard && this.allowUpdateInvitationsToBeSent;
	}

	private memberAlreadyListed(): void {
		const data: DialogOptions = {
			icon: 'error',
			title: 'Error',
			message: `This licence holder is already listed as a controlling member.`,
			cancelText: 'Close',
		};

		this.dialog.open(DialogComponent, { data });
	}

	private controllingMemberChanged(): void {
		// document upload only needed in wizard flow
		if (!this.isWizard) {
			return;
		}

		this.allowDocumentUpload = true;
		this.form.patchValue({ attachmentIsRequired: !this.isBcBusinessAddress });
	}

	private memberDialogWithoutSWL(dialogOptions: NonSwlContactInfo | null, isCreate: boolean): void {
		const dialogData: MemberWithoutSWLDialogData = dialogOptions ?? {};
		dialogData.bizId = this.bizId;
		dialogData.allowNewInvitationsToBeSent = this.allowNewInvitationsToBeSent;

		this.dialog
			.open(ModalMemberWithoutSwlEditComponent, {
				width: '800px',
				data: dialogData,
				autoFocus: true,
			})
			.afterClosed()
			.subscribe((resp: any) => {
				const memberData = resp?.data;

				if (memberData) {
					if (isCreate) {
						this.controllingMemberChanged();

						this.membersWithoutSwlList.push(this.newMemberRow(memberData.bizContactId!, memberData));
						this.dataSourceWithoutSWL.data = this.membersWithoutSwlList.value;

						if (this.allowNewInvitationsToBeSent && memberData.emailAddress) {
							this.hotToastService.success(
								'The member has been successfully added and an invitation has been sent.<br><br><strong>The controlling member will receive a link to an online application form via email. They must provide personal information and consent to a criminal record check.</strong>',
								{
									autoClose: false,
									dismissible: true,
								}
							);
						} else {
							this.hotToastService.success('The member has been successfully added');
						}
					} else {
						const memberIndex = this.membersWithoutSwlList.value.findIndex(
							(item: any) => item.bizContactId == dialogData.bizContactId!
						);
						this.patchMemberData(memberIndex, memberData);
						this.dataSourceWithoutSWL.data = this.membersWithoutSwlList.value;

						this.hotToastService.success('The member has been successfully updated');
					}
				}
			});
	}

	private newMemberRow(bizContactId: string, memberData: any): FormGroup {
		return this.formBuilder.group({
			licenceHolderName: [
				memberData.licenceHolderName ?? this.utilService.getFullName(memberData.givenName, memberData.surname),
			],
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
			licenceHolderName: [
				memberData.licenceHolderName ?? this.utilService.getFullName(memberData.givenName, memberData.surname),
			],
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
