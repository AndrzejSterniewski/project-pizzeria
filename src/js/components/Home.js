import { select, templates } from "../settings";

class Home {
    constructor(homeElem) {
        const thisHome = this;

        thisHome.render(homeElem);
        thisHome.initWidgets();
    }

    render(wrapper) {
        const thisHome = this;

        const generatedHTML = templates.homePage();

        thisHome.dom = {};

        thisHome.dom.wrapper = wrapper;

        thisHome.dom.wrapper.innerHTML = generatedHTML;

        thisHome.dom.options = thisHome.dom.wrapper.querySelector(select.home.options);
        thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.home.carousel);
        thisHome.dom.gallery = thisHome.dom.wrapper.querySelector(select.home.gallery);
    }

    initWidgets() {
        // const thisHome = this;

        // const elem = thisHome.dom.carousel;
        // const flkty = new Flickity(elem, {
        //     // options
        //     cellAlign: 'left',
        //     contain: true
        // });

        // // element argument can be a selector string
        // //   for an individual element
        // const flkty = new Flickity(thisHome.dom.carousel, {
        //     // options
        // });

    }
}

export default Home;