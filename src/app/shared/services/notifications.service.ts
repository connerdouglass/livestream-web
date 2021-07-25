import { Observable } from "rxjs";

export interface NotificationsService {

    /**
     * Determines if browser notifications are supported on the platform
     */
    supported$(): Observable<boolean>;

    /**
     * Returns an observable to the subscription status of the local user to a creator ID
     * @param creator_id the creator profile ID to check for
     */
    subscribed_to$(creator_id: number): Observable<boolean>;

    /**
     * Sets the subscription status for a given creator profile
     * @param creator_id the creator id to subscribe or unsubscribe to
     * @param subscribed the subscription status to set
     */
    set_subscribed(creator_id: number, subscribed: boolean): Promise<void>;

}
