class CustomInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");
        const slider = wrapper.appendChild(document.createElement("input"));
        slider.setAttribute("class", "slider");
        slider.setAttribute("id", "sldr");
        slider.setAttribute("type", "range");
        const input = wrapper.appendChild(document.createElement("input"));
        input.setAttribute("class", "input");
        input.setAttribute("type", "number");
        slider.setAttribute("id", "nmbr");
        input.setAttribute("min", 1);
        input.setAttribute("max", 10);
        this.shadowRoot.append(wrapper);
    }
}