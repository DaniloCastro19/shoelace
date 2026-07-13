import SlPagination from './pagination.component.js';

export * from './pagination.component.js';
export default SlPagination;

SlPagination.define('sl-pagination');

declare global {
  interface HTMLElementTagNameMap {
    'sl-pagination': SlPagination;
  }
}
