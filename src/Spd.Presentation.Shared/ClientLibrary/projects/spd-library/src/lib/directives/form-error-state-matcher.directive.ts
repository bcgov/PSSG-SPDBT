import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class FormErrorStateMatcher implements ErrorStateMatcher {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && control.invalid && control.touched);
    }
}
