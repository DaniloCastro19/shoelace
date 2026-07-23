import '../../../dist/shoelace.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import type SlPagination from './pagination.component.js';

describe('<sl-pagination>', () => {
  it('passes accessibility validation', async () => {
    const el = await fixture<SlPagination>(html`<sl-pagination></sl-pagination>`);
    await expect(el).to.be.accessible();
  });

  it('initializes with default properties', async () => {
    const el = await fixture<SlPagination>(html`<sl-pagination></sl-pagination>`);
    expect(el.page).to.equal(1);
    expect(el.total).to.equal(1);
    expect(el.disabled).to.be.false;
  });

  it('renders the correct number of buttons based on total property', async () => {
    const el = await fixture<SlPagination>(html`<sl-pagination total="5"></sl-pagination>`);
    const buttons = el.shadowRoot!.querySelectorAll('button');
    // 5 pages + prev + next = 7
    expect(buttons.length).to.equal(7);
  });

  it('disables the "previous" button when on the first page', async () => {
    const el = await fixture<SlPagination>(html`<sl-pagination page="1" total="5"></sl-pagination>`);
    const prevBtn = el.shadowRoot!.querySelector('button:first-of-type')! as HTMLButtonElement;
    expect(prevBtn.disabled).to.be.true;
  });

  it('disables the "next" button when on the last page', async () => {
    const el = await fixture<SlPagination>(html`<sl-pagination page="5" total="5"></sl-pagination>`);
    const nextBtn = el.shadowRoot!.querySelector('button:last-of-type')! as HTMLButtonElement;
    expect(nextBtn.disabled).to.be.true;
  });

  it('emits sl-change event with correct detail when a page button is clicked', async () => {
    const el = await fixture<SlPagination>(html`<sl-pagination page="1" total="5"></sl-pagination>`);

    const secondPageBtn = el.shadowRoot!.querySelectorAll('button')[2] as HTMLButtonElement;

    // Arrange listener
    const eventPromise = oneEvent(el, 'sl-change');

    // Act
    secondPageBtn.click();

    // Assert
    const event = (await eventPromise) as CustomEvent<{ page: number }>;
    expect(event.detail.page).to.equal(2);
  });

  it('disables all buttons when the disabled property is true', async () => {
    const el = await fixture<SlPagination>(html`<sl-pagination page="1" total="5" disabled></sl-pagination>`);
    const buttons = el.shadowRoot!.querySelectorAll('button');

    buttons.forEach(btn => {
      expect(btn.disabled).to.be.true;
    });
  });
});
