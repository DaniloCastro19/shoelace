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

  private goToPage(target: number) {
    if (this.disabled) {
      return;
    }

    const clamped = Math.max(1, Math.min(this.total || 1, Math.floor(target)));

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
        ${Array.from({ length: this.total }, (_, index) => index + 1).map(x => {
          return html`
            <button
              disabled=${this.disabled}
              tabindex=${this.page === x ? '0' : '-1'}
              class=${classMap({
                pagination__item: true,
                'pagination__item--active': this.page === x
              })}
              @click=${() => this.goToPage(x)}
            >
              ${x}
            </button>
          `;
        })}
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
