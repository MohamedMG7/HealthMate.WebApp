import { Injectable, ApplicationRef, ComponentRef, Injector } from '@angular/core';
import { createComponent } from '@angular/core';
import { PopupMessageComponent } from '../shared/popup-message/popup-message.component';

@Injectable({ providedIn: 'root' })
export class PopupMessageService {
  constructor(private appRef: ApplicationRef, private injector: Injector) {}

  private show(message: string, type: 'success' | 'error' | 'info', imageUrl: string = '') {
    const compRef: ComponentRef<PopupMessageComponent> = createComponent(PopupMessageComponent, {
      environmentInjector: this.appRef.injector
    });

    compRef.instance.message = message;
    compRef.instance.type = type;
    compRef.instance.imageUrl = imageUrl;

    this.appRef.attachView(compRef.hostView);
    const domElem = (compRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    setTimeout(() => {
      this.appRef.detachView(compRef.hostView);
      compRef.destroy();
    }, 3000);
  }

  showSuccess(message: string) {
    this.show(message, 'success', '../../assets/images/popup-success.png');
  }

  showFailure(message: string) {
    this.show(message, 'error', '../../assets/images/popup-faliure.png');
  }
}
