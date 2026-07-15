import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlPagination from './pagination.component.js';

describe('<sl-pagination>', () => {
  interface pageProps {
    page: number;
  }
  it('should render a component', async () => {
    const el = await fixture<SlPagination>(html` <sl-pagination></sl-pagination> `);

    await expect(el).is.accessible();
    expect(el.shadowRoot!.querySelector('button')).to.exist;
    expect(el.page).to.equal(1);
    expect(el.total).to.equal(1);
    expect(el.disabled).to.equal(false);
  });

  it('render the right number of elements for a given total', async () => {
    let page = 1;
    const total = 5;
    const setCurrentPage = (newPage: number) => {
      page = newPage;
    };
    const el = await fixture<SlPagination>(html`
      <sl-pagination
        page=${page}
        total=${total}
        onSlChange=${(event: CustomEvent<pageProps>) => setCurrentPage(event.detail.page)}
      >
      </sl-pagination>
    `);

    
    const totalBtnsRendered = el.shadowRoot!.querySelectorAll('button').length;
    console.log(el.shadowRoot!.querySelectorAll('button'));

    expect(totalBtnsRendered).to.equal(total + 2); // Total pages buttom + Prev & Next buttoms
  });
});
