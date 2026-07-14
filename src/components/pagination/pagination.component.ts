import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';
import componentStyles from '../../styles/component.styles.js';
import ShoelaceElement from '../../internal/shoelace-element.js';
import styles from './pagination.styles.js';
import type { CSSResultGroup } from 'lit';

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
        tabindex=${this.disabled ? '-1' : '0'}
        @keydown=${this.handleKeyDown}
      >
        <button @click=${this.handlePrev}>Prev</button>
        ${Array.from({length: this.total}, (_ , index) => index + 1).map(x => {
          return html`
            <button 
              class=${classMap({
              pagination__item: true
            })}
            @click=${() => this.goToPage(x)}>
              ${x}
            </button>
          `
        })}
        <button @click=${this.handleNext}>Next</button>
      </div>
    `;
  }
}
