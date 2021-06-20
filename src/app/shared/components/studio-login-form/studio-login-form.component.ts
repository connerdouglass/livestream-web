import { Component, EventEmitter, Output } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-studio-login-form',
    styleUrls: ['./studio-login-form.component.scss'],
    templateUrl: './studio-login-form.component.html',
})
export class StudioLoginForm {

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

    public constructor(
        private auth_service: AuthService,
    ) {}

    public async login() {

        await this.auth_service.login(
            this.formdata.email,
            this.formdata.password,
        );

    }

}
