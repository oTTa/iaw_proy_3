import { TurismoCliPage } from './app.po';

describe('turismo-cli App', () => {
  let page: TurismoCliPage;

  beforeEach(() => {
    page = new TurismoCliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
