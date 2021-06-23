import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter, Input,
    NgZone,
    Output,
    ViewChild
} from '@angular/core';

/** Logged in user data */
export interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string
    photo_url?: string
    auth_date: number;
    hash: string;
}
  
export type LOGIN_BUTTON_SIZE = 'medium' | 'large' | 'small';
  
/** Configuration for a login button */
export interface WidgetConfiguration {
    // Login button size. Default: large
    buttonStyle?: LOGIN_BUTTON_SIZE;
    // Show user photo near the button. Default: true
    showUserPhoto?: boolean;
    // Radius of buttons corners(0-20). Default: 20
    cornerRadius?: number;
    // Request for write access. Default: false
    accessToWriteMessages?: boolean
}

const TELEGRAM_WIDGET_VERSION = 15;
const randomSeed = parseInt(`${Math.random() * 1e7}`);

@Component({
    selector: 'app-telegram-login-button',
    template: `<div #scriptContainer></div>`
})
export class TelegramLoginButtonComponent implements AfterViewInit {

    @ViewChild('scriptContainer', {static: true}) public scriptContainer!: ElementRef;

    @Output() public login: EventEmitter<User> = new EventEmitter<User>();
    @Output() public load: EventEmitter<void> = new EventEmitter<void>();
    @Output() public loadError: EventEmitter<void> = new EventEmitter<void>();

    @Input() public botName!: string;
    @Input() public config?: WidgetConfiguration = {};

    private defaultConfigs = {
        'src': `https://telegram.org/js/telegram-widget.js?${TELEGRAM_WIDGET_VERSION}`,
        'data-onauth': `onTelegramLogin${randomSeed}(user)`,
        'onerror': `onTelegramWidgetLoadFail${randomSeed}()`,
        'onload': `onTelegramWidgetLoad${randomSeed}()`
    };

    public constructor(
        private ngZone: NgZone,
    ) {}

    public ngAfterViewInit() {
        const scriptAttrs = this.compileConfigs();
        const script = document.createElement('script');

        for (let key in scriptAttrs) {
            if (scriptAttrs.hasOwnProperty(key)) {
                script.setAttribute(key, scriptAttrs[key]);
            }
        }

        (window as any)[`onTelegramLogin${randomSeed}`] = (data: any) => this.ngZone.run(() => this.login.emit(data));
        (window as any)['onTelegramWidgetLoad' + randomSeed] = () => this.ngZone.run(() => this.load.emit());
        (window as any)['onTelegramWidgetLoadFail' + randomSeed] = () => this.ngZone.run(() => this.loadError.emit());

        this.scriptContainer.nativeElement.innerHTML = '';
        this.scriptContainer.nativeElement.appendChild(script);
    }

    private compileConfigs(): {[key: string]: any} {
        const configs: {[key: string]: any} = this.defaultConfigs ?? {};

        if (!this.botName) {
            throw new Error('Telegram widget: bot name not present!');
        }

        configs['data-telegram-login'] = this.botName

        if (this.config?.accessToWriteMessages) {
            configs['data-request-access'] = 'write';
        }

        if (this.config?.cornerRadius) {
            configs['data-radius'] = `${this.config.cornerRadius}`;
        }

        if (this.config?.showUserPhoto === false) {
            configs['data-userpic'] = 'false';
        }

        if (this.config?.buttonStyle) {
            configs['data-size'] = this.config.buttonStyle;
        } else {
            configs['data-size'] = 'large';
        }

        return configs;
    }
}