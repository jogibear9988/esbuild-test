// @ts-ignore
import styles from '../assets/mystyles.css' with {type: 'css'}

export class MyComp extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [styles];
    }
}
customElements.define('my-comp', MyComp);