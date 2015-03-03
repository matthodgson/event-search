(function ($) {

    Drupal.behaviors.eventSearch = {
        attach: function() {

            var ROW_SELECTOR = Drupal.settings.eventSearch.rowSelector,
                ROW_START_DATE_CLASS = Drupal.settings.eventSearch.rowStartDate,
                ROW_END_DATE_CLASS = Drupal.settings.eventSearch.rowEndDate,
                SEARCH_TARGET_SELECTOR = Drupal.settings.eventSearch.searchTarget,
                MAX_MONTHS_TO_DISPLAY = Drupal.settings.eventSearch.numberOfMonths,
                START_DATE_INPUT = '#edit-date-start',
                END_DATE_INPUT = '#edit-date-end';

            generateMonths(MAX_MONTHS_TO_DISPLAY);

            $('.month-list span.month').click( function() {
                var firstDay = new Date($(this).attr('data-date'));
                var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
                $(START_DATE_INPUT).datepicker( "setDate", firstDay );
                $(END_DATE_INPUT).datepicker( "setDate", lastDay );
                filterEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT, ROW_START_DATE_CLASS, ROW_END_DATE_CLASS);
            });

            $('.month-list span.view-all').click( function() {
                allEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT);
                filterEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT, ROW_START_DATE_CLASS, ROW_END_DATE_CLASS);
            });

            $('.month-list span.past-events').click( function() {
                pastEvents(START_DATE_INPUT, END_DATE_INPUT);
                filterEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT, ROW_START_DATE_CLASS, ROW_END_DATE_CLASS);
            });

            $('.qs-input.event-name').keyup( function() {
                $(this).quicksearch(ROW_SELECTOR, {
                    selector: SEARCH_TARGET_SELECTOR
                });
                $(START_DATE_INPUT).val('mm/dd/yyyy');
                $(END_DATE_INPUT).val('mm/dd/yyyy');
            });

            var endDateEntered = false;

            $(START_DATE_INPUT).datepicker({
                dateFormat: 'mm/dd/yy',
                defaultDate: 0,
                minDate: null,
                showButtonPanel: false,
                onClose: function () {
                    if ( $(START_DATE_INPUT).val().length > 0 ) {
                        if ( $(END_DATE_INPUT).val().length > 0 ) {
                            filterEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT, ROW_START_DATE_CLASS, ROW_END_DATE_CLASS);
                        }
                    }
                }
            });

            $(END_DATE_INPUT).datepicker({
                dateFormat: 'mm/dd/yy',
                defaultDate: 0,
                minDate: 0,
                showButtonPanel: false,
                onClose: function () {
                    if ( $(END_DATE_INPUT).val().length > 0 ) {
                        if ( $(START_DATE_INPUT).val().length > 0 ) {
                            filterEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT, ROW_START_DATE_CLASS, ROW_END_DATE_CLASS);
                        }
                    }
                }
            });

            allEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT);
            filterEvents(ROW_SELECTOR, START_DATE_INPUT, END_DATE_INPUT, ROW_START_DATE_CLASS, ROW_END_DATE_CLASS);
        }
    };

    function generateMonths(maxMonths) {
        var theMonths = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
            today = new Date(),
            aMonth = today.getMonth(),
            year = today.getFullYear(),
            i;

        for (i = 0; i < maxMonths; i++) {
            $('.month-list').append('<span class="month" data-date="' + new Date(theMonths[aMonth] + ' 01, ' + year) + '">' + theMonths[aMonth] + '</span>');
            aMonth++;

            if (aMonth > 11) {
                aMonth = 0;
                year = year+1;
            }
        }
    }

    function allEvents(rowSelector, startDateInput, endDateInput) {
        if ($(startDateInput).length != 0) {
            var today = new Date();
            $(rowSelector).show();
            $(startDateInput).datepicker( "setDate", today );
            $(endDateInput).datepicker( "setDate", new Date(today.getFullYear() + 2, today.getMonth(), 0) );
        }
    }

    function pastEvents(startDateInput, endDateInput) {
        if ($(startDateInput).length != 0) {
            $(startDateInput).datepicker( "setDate", new Date("January 1, 2014") );
            $(endDateInput).datepicker( "setDate", new Date() );
        }
    }

    function filterEvents(rowSelector, startDateInput, endDateInput, rowStartDateClass, rowEndDateClass) {
        if ($(startDateInput).length != 0) {
            $(rowSelector).each( function() {
                var startDate = new Date(Date.parse($(this).find(rowStartDateClass + ' span:first').text()));
                var endDate = new Date(Date.parse($(this).find(rowEndDateClass).text()));
                var pickerStart = new Date(Date.parse($(startDateInput).datepicker( "getDate" )));
                var pickerEnd = new Date(Date.parse($(endDateInput).datepicker( "getDate" )));

                if ( $(this).find(rowEndDateClass).length ) {
                    if (pickerStart <= startDate && pickerEnd >= startDate) {
                        $(this).show();
                    } else if (pickerEnd >= startDate && pickerEnd <= endDate) {
                        $(this).show();
                    } else if (pickerStart >= startDate && pickerStart <= endDate) {
                        $(this).show();
                    } else if (pickerEnd >= startDate && pickerEnd <= endDate) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                } else {
                    if (startDate >= pickerStart && startDate <= pickerEnd) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });
        }
    }
})(jQuery);