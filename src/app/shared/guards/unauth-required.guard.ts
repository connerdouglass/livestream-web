import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UnauthRequiredGuard implements CanActivateChild, CanActivate {

	public constructor(
		private auth: AuthService,
		private router: Router) {}

	public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return this.handleActivation(childRoute);
	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return this.handleActivation(route);
	}

	private async handleActivation(route: ActivatedRouteSnapshot): Promise<boolean> {

        // Get the login state
        const logged_in = await this.auth.logged_in$
            .pipe(take(1))
            .toPromise();

        // If we're not logged in
        if (!logged_in) return true;

        // Redirect to the login page
        this.router.navigate([route.data.auth_redirect ?? '/login']);
        return false;

	}

}
