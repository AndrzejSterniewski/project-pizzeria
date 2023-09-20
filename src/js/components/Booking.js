import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
    constructor(boookingElem) {
        const thisWidget = this;

        thisWidget.render(boookingElem);
        thisWidget.initWidgets();
    }
    render(boookingElem) {
        const thisWidget = this;

        const generatedHTML = templates.bookingWidget();
        thisWidget.dom = {};
        thisWidget.dom.wrapper = boookingElem;
        boookingElem.innerHTML = generatedHTML;
        thisWidget.dom.peopleAmount = thisWidget.dom.wrapper.querySelector(select.widgets.booking.peopleAmount);
        thisWidget.dom.hoursAmount = thisWidget.dom.wrapper.querySelector(select.widgets.booking.hoursAmount);
        thisWidget.dom.datePicker = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisWidget.dom.hourPicker = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    }
    initWidgets() {
        const thisWidget = this;

        thisWidget.initWidgets = new AmountWidget(thisWidget.dom.peopleAmount);
        thisWidget.initWidgets = new AmountWidget(thisWidget.dom.hoursAmount);
        thisWidget.initWidgets = new AmountWidget(thisWidget.dom.datePicker);
        thisWidget.initWidgets = new AmountWidget(thisWidget.dom.hourPicker);
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