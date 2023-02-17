import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrApplicationRoutingModule } from './scr-application-routing.module';
import { ScrApplicationComponent } from './scr-application.component';
import { AgreementOfTermsComponent } from './step-components/agreement-of-terms.component';
import { ApplicationProgressComponent } from './step-components/application-progress.component';
import { ChecklistComponent } from './step-components/checklist.component';
import { CompletedComponent } from './step-components/completed.component';
import { ContactInformationComponent } from './step-components/contact-information.component';
import { DeclarationComponent } from './step-components/declaration.component';
import { EligibilityProblemComponent } from './step-components/eligibility-problem.component';
import { LogInOptionsComponent } from './step-components/log-in-options.component';
import { MailingAddressComponent } from './step-components/mailing-address.component';
import { PaymentComponent } from './step-components/payment.component';
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
		ScrApplicationComponent,
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
		EligibilityProblemComponent,
		LogInOptionsComponent,
		AgreementOfTermsComponent,
		PersonalInformationComponent,
		PreviousNameComponent,
		SummaryComponent,
		SecurityInformationComponent,
		DeclarationComponent,
		PaymentComponent,
		CompletedComponent,
		ApplicationProgressComponent,
	],
	imports: [SharedModule, ScrApplicationRoutingModule],
	providers: [],
})
export class ScrApplicationModule {}
