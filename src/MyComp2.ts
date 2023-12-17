// @ts-ignore
import styles from '../assets/mystyles.css' with {type: 'css'}
// @ts-ignore
import styles2 from '../assets/mystyles2.css' with {type: 'css'}

export class MyComp2 extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [styles, styles2];
    }
}
customElements.define('my-comp2', MyComp2);