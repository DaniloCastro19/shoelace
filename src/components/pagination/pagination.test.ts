import '../../../dist/shoelace.js';
import { expect, fixture, html } from '@open-wc/testing';
import type SlPagination from './pagination.component.js';

describe('<sl-pagination>', () => {
  it('should render a component', async () => {
    const el = await fixture<SlPagination>(html` <sl-pagination></sl-pagination> `);

    expect(el.page).to.equal(1);
    expect(el.total).to.equal(1);
    expect(el.disabled).to.equal(false);
  });
});
