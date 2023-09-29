import { select, templates, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
    constructor(boookingElem) {
        const thisBooking = this;

        thisBooking.render(boookingElem);
        thisBooking.initWidgets();
        thisBooking.getData();
        thisBooking.selectedTable = null;
    }

    getData() {
        const thisBooking = this;

        const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
        const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

        const params = {
            booking: [
                startDateParam,
                endDateParam
            ],
            eventsCurrent: [
                settings.db.notRepeatParam,
                startDateParam,
                endDateParam
            ],
            eventsRepeat: [
                settings.db.repeatParam,
                endDateParam
            ],
        };

        const urls = {
            bookings: settings.db.url + '/' + settings.db.bookings
                + '?' + params.booking.join('&'),
            eventsCurrent: settings.db.url + '/' + settings.db.events
                + '?' + params.eventsCurrent.join('&'),
            eventsRepeat: settings.db.url + '/' + settings.db.events
                + '?' + params.eventsRepeat.join('&')
        }

        Promise.all([
            fetch(urls.bookings),
            fetch(urls.eventsCurrent),
            fetch(urls.eventsRepeat),
        ])
            .then(function (allResponses) {
                const bookingsResponse = allResponses[0];
                const eventsCurrentResponse = allResponses[1];
                const eventsRepeatResponse = allResponses[2];
                return Promise.all([
                    bookingsResponse.json(),
                    eventsCurrentResponse.json(),
                    eventsRepeatResponse.json(),
                ]);
            })
            .then(function ([bookings, eventsCurrent, eventsRepeat]) {
                // console.log(bookings);
                // console.log(eventsCurrent);
                // console.log(eventsRepeat);
                thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
            })

    }

    parseData(bookings, eventsCurrent, eventsRepeat) {
        const thisBooking = this;

        thisBooking.booked = {};

        for (let item of bookings) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        for (let item of eventsCurrent) {
            thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }

        const minDate = thisBooking.datePicker.minDate;
        const maxDate = thisBooking.datePicker.maxDate;

        for (let item of eventsRepeat) {
            if (item.repeat == 'daily') {
                for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
                    thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
                }
            }
        }
        thisBooking.updateDOM();
    }

    makeBooked(date, hour, duration, table) {
        const thisBooking = this;

        if (typeof thisBooking.booked[date] == 'undefined') {
            thisBooking.booked[date] = {};
        }

        const startHour = utils.hourToNumber(hour);

        for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {

            if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
                thisBooking.booked[date][hourBlock] = [];
            }

            thisBooking.booked[date][hourBlock].push(table);
        }
    }

    updateDOM() {
        const thisBooking = this;

        thisBooking.date = thisBooking.datePicker.value;
        thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

        let allAvailable = false;

        if (
            typeof thisBooking.booked[thisBooking.date] == 'undefined'
            ||
            typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
        ) {
            allAvailable = true;
        }

        for (let table of thisBooking.dom.tables) {
            let tableId = table.getAttribute(settings.booking.tableIdAttribute);
            if (!isNaN(tableId)) {
                tableId = parseInt(tableId);
            }

            if (
                !allAvailable &&
                thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
            ) {
                table.classList.add(classNames.booking.tableBooked);
            } else {
                table.classList.remove(classNames.booking.tableBooked);
            }
        }
    }

    render(wrapper) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();

        thisBooking.dom = {};

        thisBooking.dom.wrapper = wrapper;

        thisBooking.dom.wrapper.innerHTML = generatedHTML;

        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

        thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

        thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
        thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);

        /* NEW */
        thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.cart.phone);
        thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.cart.address);
        thisBooking.dom.starters = thisBooking.dom.wrapper.querySelector(select.booking.starters);
        thisBooking.dom.bookTableButton = thisBooking.dom.wrapper.querySelector(select.booking.bookTable);
    }

    /* NEW */
    sendBooking() {
        const thisBooking = this;

        const url = settings.db.url + '/' + settings.db.bookings;
        const payload = {
            date: thisBooking.dom.datePicker,
           // data wybrana w datePickerze,
            hour: thisBooking.dom.hourPicker,
            // godzina wybrana w hourPickerze(w formacie HH: ss),
            table: thisBooking.selectedTable.value,
            // numer wybranego stolika(lub null jeśli nic nie wybrano),
            duration: thisBooking.dom.hoursAmount,
            // liczba godzin wybrana przez klienta,
            ppl: thisBooking.dom.peopleAmount,
            // liczba osób wybrana przez klienta,
            phone: thisBooking.dom.phone,
            // numer telefonu z formularza,
            address: thisBooking.dom.address,
            // adres z formularza
            starters: [],
        }

        console.log('payload', payload);

        thisBooking.starters.addEventListener('check', function(event){
            event.target.checked ? thisBooking.starters.push(event.target.value) : thisBooking.starters.splice('event.target', 1);
        });

        console.log(thisBooking.dom.starters);

        const options = {
            method: 'POST',
            headers: {
                'COntent-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        };

        fetch(url, options)
            .then(function (response) {
                return response.json();
            }).then(function (parsedResponse) {
                console.log('parsedResponse', parsedResponse);
            });
    }

    initWidgets() {
        const thisBooking = this;

        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

        thisBooking.dom.wrapper.addEventListener('updated', function () {
            thisBooking.updateDOM();
        })

        /* 4. initTables after click on div with tables */
        thisBooking.dom.floorPlan.addEventListener('click', function (event) {
            event.preventDefault();
            thisBooking.initTables(event);
        });

        /* NEW */
        thisBooking.dom.bookTableButton.addEventListener('click', function(event){
            event.preventDefault();
            thisBooking.sendBooking();
        })
    }

    initTables(event) {
        const thisBooking = this;

        if (!event.target.classList.contains(classNames.booking.table))
            return;

        const table = event.target;

        if (table.classList.contains(classNames.booking.tableBooked)) {
            alert('table booked');
            return;
        }

        const tableId = table.getAttribute(settings.booking.tableIdAttribute);
        if (table.classList.contains(classNames.booking.tableSelected)) {
            table.classList.remove(classNames.booking.tableSelected);
            thisBooking.selectedTable = null;
        } else {
            if (thisBooking.selectedTable) {
                const selectedTable = thisBooking.dom.floorPlan.querySelector(select.booking.tableSelected);
                selectedTable.classList.remove(classNames.booking.tableSelected);
            }
            thisBooking.selectedTable = tableId;
            table.classList.add(classNames.booking.tableSelected);
        }

    }
}

export default Booking;
