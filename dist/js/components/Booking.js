import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
    constructor(boookingElem) {
        const thisBooking = this;

        thisBooking.render(boookingElem);
        thisBooking.initWidgets();
    }

    render(boookingElem) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = boookingElem;
        boookingElem.innerHTML = generatedHTML;
        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.widgets.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.widgets.booking.hoursAmount);
    }

    initWidgets() {
        const thisBooking = this;

        thisBooking.initWidgets = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.initWidgets = new AmountWidget(thisBooking.dom.hoursAmount);
    }

    initAmountWidget() {
        const thisCartProduct = this;

        thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
        thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
            thisCartProduct.amount = thisCartProduct.amountWidget.value;
            thisCartProduct.price = thisCartProduct.amount * thisCartProduct.priceSingle;
            thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
        })
    }
}

export default Booking;