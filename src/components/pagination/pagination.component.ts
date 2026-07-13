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

  // ---- PUBLIC REACTIVE PROPERTIES ----
  // TODO: Declare your 4 properties here (page, total, disabled, label)
  // Hint: Look at how sl-divider or sl-badge declares theirs.
  // Which ones need { reflect: true }? Which type does each use?

  @property({ type: Number, reflect: true }) page = 1;

  @property({ type: Number }) total = 1;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: String }) label = 'pagination';

  // ---- LIFECYCLE ----
  // TODO: Override connectedCallback() to set ARIA attributes.
  // What role should a navigation landmark have?

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'navigation');
    this.setAttribute('aria-label', this.label);
  }

  // ---- CORE LOGIC ----
  // TODO: Write a goToPage(target) method that:
  //   1. Refuses to act if disabled
  //   2. Clamps target between valid bounds (think: what if someone passes 0 or 999?)
  //   3. Only acts when the page actually changes (avoids duplicate events)
  //   4. Updates the page property and emits an event with the new value

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

  // TODO: Write handlePrev() and handleNext() — these are thin wrappers.
  private handlePrev() {
    this.goToPage(this.page - 1);
  }

  private handleNext() {
    this.goToPage(this.page + 1);
  }

  // ---- KEYBOARD SUPPORT ----
  // TODO: Write a handleKeyDown(event) method.
  // Which keys should trigger navigation? Don't forget preventDefault().

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

  // ---- RENDER ----
  // TODO: Write the render() method. Your template needs:
  //   - A wrapper div with part="base", a tabindex, and keydown listener
  //   - A prev button (disabled when on page 1)
  //   - A dynamic list of numbered page buttons (use Array.from + .map())
  //   - A next button (disabled when on the last page)
  // Use classMap() to conditionally apply the active class.
  // Use aria-current="page" on the active button for accessibility.

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
        <button onclick=${this.handlePrev()}>Prev</button>
        ${Array.from([1, 2, 3, 4, 5]).map(x => {
          return `<div class="pagination__item" aria-current="page">${x}</div>`;
        })}
        <button onClick=${this.handleNext()}>Next</button>
      </div>
    `;
  }
}
