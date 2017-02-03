import { AngularModalGalleryAngularcliDemoPage } from './app.po';

describe('angular-modal-gallery-angularcli-demo App', function() {
  let page: AngularModalGalleryAngularcliDemoPage;

  beforeEach(() => {
    page = new AngularModalGalleryAngularcliDemoPage();
  });

  it('should navigate', () => {
    page.navigateTo();
    //expect(page.getParagraphText()).toEqual('app works!');
  });
});
