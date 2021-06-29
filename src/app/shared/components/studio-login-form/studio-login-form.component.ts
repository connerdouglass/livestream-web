import { Component, EventEmitter, Output } from "@angular/core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-studio-login-form',
    styleUrls: ['./studio-login-form.component.scss'],
    templateUrl: './studio-login-form.component.html',
})
export class StudioLoginForm {

    /**
     * Icons displayed on the compoent
     */
    public readonly icons = {
        submitting: faSpinner,
    };

    /**
     * Event emitted when we've successfully logged in
     */
    @Output('loggedIn') private logged_in = new EventEmitter<void>();

    /**
     * Data filled in by the login form
     */
    public formdata = {
        email: '',
        password: '',
    };

    /**
     * Whether or not the form is being submitted
     */
    public submitting = false;

    public constructor(
        private auth_service: AuthService,
    ) {}

    /**
     * Called when the login button is clicked
     */
    public async login() {

        // If we're already submitting, don't do it again
        if (this.submitting) return;
        this.submitting = true;

        try {

            // Login to the account
            const me = await this.auth_service.login(
                this.formdata.email,
                this.formdata.password,
            );

            // If we're logged in, trigger the event handler
            if (me) {
                this.logged_in.next();
            }

        } catch (err) {
            console.error(err);
        }

        // Done submitting
        this.submitting = false;

    }

}
