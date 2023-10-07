import { select, templates } from "../settings.js";

class Home {
    constructor(homeElem) {
        const thisHome = this;

        thisHome.render(homeElem);
    //    thisHome.initWidgets();
    }

    render(wrapper) {
        const thisHome = this;

        const generatedHTML = templates.homePage();

        thisHome.dom = {};

        thisHome.dom.wrapper = wrapper;

        thisHome.dom.wrapper.innerHTML = generatedHTML;

        thisHome.dom.options = thisHome.dom.wrapper.querySelector(select.home.options);
        thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.home.carousel);
    }

    initWidgets() {
        const thisHome = this;

        new Flickity(thisHome.dom.carousel, {
            // options
            cellAlign: 'left',
            contain: true,
            autoPlay: true
        });
    }
}

export default Home;