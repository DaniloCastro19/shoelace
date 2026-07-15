import '../../../dist/shoelace.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import type SlPagination from './pagination.component.js';

describe('<sl-pagination>', () => {
  interface pageProps {
    page: number;
  }
  it('should render the component', async () => {
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
    expect(totalBtnsRendered).to.equal(total + 2); // Total pages buttom + Prev & Next buttoms
  });

  it('disable prev button when page is the first one', async () => {
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

    const prevBtn = el.shadowRoot!.querySelectorAll('button')[0];
    expect(prevBtn.disabled).to.be.true;
  });

  it('disable next button when page is the last one', async () => {
    let page = 5;
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

    const nextBtn = el.shadowRoot!.querySelectorAll('button')[6];
    expect(nextBtn.disabled).to.be.true;
  });

  it('emit the right event with the right data when the page changes', async () => {
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

    const secondPageBtn = el.shadowRoot!.querySelectorAll('button')[2];

    setTimeout(() => (secondPageBtn as HTMLElement).click());
    const event = await oneEvent<CustomEvent<pageProps>>(el, 'sl-change');

    expect(event.detail.page).to.equal(2);
  });
});
