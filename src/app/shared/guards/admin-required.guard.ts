import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AdminRequiredGuard implements CanActivateChild, CanActivate {

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
        const is_admin = await this.auth.is_admin$
            .pipe(take(1))
            .toPromise();

        // If we're logged in
        if (is_admin) return true;

        // Redirect to the root page
        this.router.navigate([route.data.auth_redirect ?? '/studio/login'], {
            queryParams: {
                'goto': document.location.pathname,
            },
        });
        return false;

	}

}
