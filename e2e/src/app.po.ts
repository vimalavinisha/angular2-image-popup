import { browser, by, element } from 'protractor';

export class AppPage {
  // tslint:disable-next-line:no-any
  navigateTo(): any {
    return browser.get('/');
  }

  // tslint:disable-next-line:no-any
  getParagraphText(): any {
    return element(by.css('app-root h1')).getText();
  }
}
