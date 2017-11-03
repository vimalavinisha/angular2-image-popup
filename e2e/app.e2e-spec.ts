import { AppPage } from './app.po';

describe('angular-modal-gallery App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should do nothing at the moment :)', () => {
    page.navigateTo();
    // expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
