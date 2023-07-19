import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrrpaRoutingModule } from './crrpa-routing.module';
import { CrcComponent } from './crrpa.component';
import { InvitationCrrpaComponent } from './invitation-crrpa.component';
import { OrgAccessComponent } from './org-access.component';
import { AgreementOfTermsComponent } from './step-components/agreement-of-terms.component';
import { ApplicationSubmittedComponent } from './step-components/application-submitted.component';
import { ChecklistComponent } from './step-components/checklist.component';
import { ConsentToCrcComponent } from './step-components/consentToCrc.component';
import { ContactInformationComponent } from './step-components/contact-information.component';
import { CrrpaPaymentErrorComponent } from './step-components/crrpa-payment-error.component';
import { CrrpaPaymentFailComponent } from './step-components/crrpa-payment-fail.component';
import { CrrpaPaymentSuccessComponent } from './step-components/crrpa-payment-success.component';
import { DeclarationComponent } from './step-components/declaration.component';
import { LogInOptionsComponent } from './step-components/log-in-options.component';
import { MailingAddressComponent } from './step-components/mailing-address.component';
import { PersonalInformationComponent } from './step-components/personal-information.component';
import { PreviousNameComponent } from './step-components/previous-name.component';
import { SecurityInformationComponent } from './step-components/security-information.component';
import { SummaryComponent } from './step-components/summary.component';
import { StepApplSubmittedComponent } from './steps/step-appl-submitted.component';
import { StepEligibilityComponent } from './steps/step-eligibility.component';
import { StepLoginOptionsComponent } from './steps/step-login-options.component';
import { StepOrganizationInfoComponent } from './steps/step-organization-info.component';
import { StepPayForApplicationComponent } from './steps/step-pay-for-application.component';
import { StepPersonalInfoComponent } from './steps/step-personal-info.component';
import { StepTermsAndCondComponent } from './steps/step-terms-and-cond.component';

@NgModule({
	declarations: [
		CrcComponent,
		StepEligibilityComponent,
		StepOrganizationInfoComponent,
		StepLoginOptionsComponent,
		StepPersonalInfoComponent,
		StepTermsAndCondComponent,
		StepPayForApplicationComponent,
		StepApplSubmittedComponent,
		ContactInformationComponent,
		MailingAddressComponent,
		ChecklistComponent,
		LogInOptionsComponent,
		AgreementOfTermsComponent,
		PersonalInformationComponent,
		PreviousNameComponent,
		SummaryComponent,
		SecurityInformationComponent,
		DeclarationComponent,
		CrrpaPaymentSuccessComponent,
		CrrpaPaymentFailComponent,
		CrrpaPaymentErrorComponent,
		ApplicationSubmittedComponent,
		ConsentToCrcComponent,
		InvitationCrrpaComponent,
		OrgAccessComponent,
	],
	imports: [SharedModule, CrrpaRoutingModule],
	providers: [],
})
export class CrrpaPortalModule {}
