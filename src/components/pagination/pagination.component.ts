import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './pagination.styles.js';
import type { CSSResultGroup, PropertyValues } from 'lit';
/**
 * @summary A pagination control for navigating between pages of content.
 * @since 2.0
 *
 * @event sl-change - Emitted when the active page changes. detail: { page }.
 *
 * @csspart base - The component's internal wrapper.
 */
export default class SlPagination extends ShoelaceElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  private ELIPSIS_MAX_RANGE_TO_SHOW: number = 1;
  private ELLIPSIS_STRING = '...';

  @property({ type: Number, reflect: true }) page = 1;

  @property({ type: Number }) total = 1;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: String }) label = 'pagination';

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', this.label);
  }

  /* 
    Roving Tabindex Accessibility pattern:
    When the page state change, search the current --active button 
    and force the focus on it over it using updated Lit lifecycle 
  */
  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('page')) {
      const activeButton = this.renderRoot.querySelector('.pagination__item--active')! as HTMLElement;
      if (activeButton) {
        activeButton.focus();
      }
    }
  }

  private goToPage(target: number | string) {
    if (this.disabled || target === this.ELLIPSIS_STRING) {
      return;
    }

    const parsedTarget = typeof target === 'string' ? parseInt(target, 10) : target;
    if (Number.isNaN(parsedTarget)) {
      return;
    }

    const clamped = Math.max(1, Math.min(this.total || 1, Math.floor(parsedTarget)));

    if (clamped === this.page) {
      return;
    }

    this.page = clamped;
    this.dispatchEvent(new CustomEvent('sl-change', { detail: { page: this.page } }));
  }

  private canGoPrev(): boolean {
    return this.page > 1;
  }

  private canGoNext(): boolean {
    return this.page < this.total;
  }

  private handlePrev() {
    this.goToPage(this.page - 1);
  }

  private handleNext() {
    this.goToPage(this.page + 1);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.handlePrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.handleNext();
        break;
      case 'Home':
        event.preventDefault();
        this.goToPage(1);
        break;
      case 'End':
        event.preventDefault();
        this.goToPage(this.total);
        break;
    }
  }

  private getPaginationItems(): (number | string)[] {
    const total = this.total;
    const page = this.page;
    const siblings = this.ELIPSIS_MAX_RANGE_TO_SHOW;

    // Total bottoms when there are lot of pages:
    const maxVisiblePages = 5 + siblings * 2;

    // If the total is less than the greatest visible, show all numbers without ellipsis
    if (total <= maxVisiblePages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Calculate slibing indexes to decide if show or not the ellipsis
    const leftSiblingIndex = Math.max(page - siblings, 2);
    const rightSiblingIndex = Math.min(page + siblings, total - 1);

    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < total - 1;

    const items: (number | string)[] = [1];

    if (!showLeftEllipsis && showRightEllipsis) {
      // Close to the start (Ej. 1 2 3 4 5 ... 20)
      const leftItemCount = 3 + siblings * 2;
      for (let i = 2; i <= leftItemCount; i++) items.push(i);
      items.push(this.ELLIPSIS_STRING);
      items.push(total);
    } else if (showLeftEllipsis && !showRightEllipsis) {
      // Close to the end (Ej. 1 ... 16 17 18 19 20)
      items.push(this.ELLIPSIS_STRING);
      const rightItemCount = 3 + siblings * 2;
      for (let i = total - rightItemCount + 1; i <= total - 1; i++) items.push(i);
      items.push(total);
    } else {
      // We are in the middle (Ej. 1 ... 4 5 6 ... 20)
      items.push(this.ELLIPSIS_STRING);
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) items.push(i);
      items.push(this.ELLIPSIS_STRING);
      items.push(total);
    }

    return items;
  }

  render() {
    return html`
      <div
        part="base"
        class=${classMap({
          pagination: true
        })}
        @keydown=${this.handleKeyDown}
      >
        <button
          class=${classMap({
            pagination__item: true
          })}
          @click=${this.handlePrev}
          ?disabled=${!this.canGoPrev() || this.disabled}
        >
          ←
        </button>
        ${this.getPaginationItems().map(
          x => html`
            <button
              ?disabled=${x === this.ELLIPSIS_STRING || this.disabled}
              tabindex=${x === this.ELLIPSIS_STRING ? '-1' : this.page === x ? '0' : '-1'}
              class=${classMap({
                pagination__item: true,
                'pagination__item--active': this.page === x
              })}
              @click=${() => this.goToPage(x)}
            >
              ${x}
            </button>
          `
        )}
        <button
          class=${classMap({
            pagination__item: true
          })}
          @click=${this.handleNext}
          ?disabled=${!this.canGoNext() || this.disabled}
        >
          →
        </button>
      </div>
    `;
  }
}
