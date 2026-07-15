import { css } from 'lit';

export default css`
  :host {
    display: inline-flex;
    --item-size: 2.25rem;
  }

  :host([disabled]) {
    opacity: 0.5;
    pointer-events: none;
  }

  .pagination {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .pagination__item {
    min-width: var(--item-size);
    height: var(--item-size);
    padding: 0 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--sl-color-neutral-300);
    border-radius: var(--sl-border-radius-medium);
    background: var(--sl-color-neutral-0);
    color: var(--sl-color-neutral-700);
    font-family: inherit;
    font-size: var(--sl-font-size-small);
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
  }

  .pagination__item:hover:not(:disabled):not(.pagination__item--active) {
    background: var(--sl-color-neutral-100);
    border-color: var(--sl-color-neutral-400);
  }

  .pagination__item--active {
    background: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    font-weight: var(--sl-font-weight-semibold);
  }

  .pagination__item:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;
