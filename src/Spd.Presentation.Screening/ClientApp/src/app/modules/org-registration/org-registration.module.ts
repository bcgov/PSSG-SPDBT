import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrgRegDuplicateModalComponent } from './org-reg-duplicate-modal.component';
import { OrgRegistrationRoutingModule } from './org-registration-routing.module';
import { OrgRegistrationComponent } from './org-registration.component';
import { AgreementOfTermsComponent } from './step-components/agreement-of-terms.component';
import { CompensationQuestionComponent } from './step-components/compensation-question.component';
import { CompletedComponent } from './step-components/completed.component';
import { ContactInformationComponent } from './step-components/contact-information.component';
import { EligibilityProblemComponent } from './step-components/eligibility-problem.component';
import { MailingAddressComponent } from './step-components/mailing-address.component';
import { OrganizationInformationComponent } from './step-components/organization-information.component';
import { OrganizationNameComponent } from './step-components/organization-name.component';
import { OrganizationOptionsComponent } from './step-components/organization-options.component';
import { OrganizationProblemComponent } from './step-components/organization-problem.component';
import { PaymentQuestionComponent } from './step-components/payment-question.component';
import { RegistrationOptionsComponent } from './step-components/registration-options.component';
import { RegistrationPathSelectionComponent } from './step-components/registration-path-selection.component';
import { ScreeningsQuestionComponent } from './step-components/screenings-question.component';
import { VulnerableSectorQuestionComponent } from './step-components/vulnerable-sector-question.component';
import { StepFourComponent } from './steps/step-four.component';
import { StepOneComponent } from './steps/step-one.component';
import { StepThreeComponent } from './steps/step-three.component';
import { StepTwoComponent } from './steps/step-two.component';
import { PreRegistrationComponent } from './pre-registration.component';

@NgModule({
	declarations: [
		OrgRegistrationComponent,
		OrgRegDuplicateModalComponent,
		RegistrationPathSelectionComponent,
		OrganizationOptionsComponent,
		CompensationQuestionComponent,
		VulnerableSectorQuestionComponent,
		EligibilityProblemComponent,
		RegistrationOptionsComponent,
		OrganizationNameComponent,
		OrganizationInformationComponent,
		OrganizationProblemComponent,
		ContactInformationComponent,
		MailingAddressComponent,
		PaymentQuestionComponent,
		ScreeningsQuestionComponent,
		AgreementOfTermsComponent,
		CompletedComponent,
		StepOneComponent,
		StepTwoComponent,
		StepThreeComponent,
		StepFourComponent,
  PreRegistrationComponent,
	],
	imports: [SharedModule, OrgRegistrationRoutingModule],
	providers: [],
})
export class OrgRegistrationModule {}
