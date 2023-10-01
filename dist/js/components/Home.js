import { templates } from "../settings";

class Home {
    constructor(homeElem) {
        const thisHome = this;

        thisHome.render(homeElem);
        thisHome.initWidgets();
    }

    render(wrapper) {
        const thisHome = this;

        const generatedHTML = templates.homePage;

        thisHome.dom = {};

        thisHome.dom.wrapper = wrapper;

        thisHome.dom.wrapper.innerHTML = generatedHTML;

    }

    initWidgets() {

    }
}

export default Home;