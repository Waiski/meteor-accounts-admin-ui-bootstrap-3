Template.accountsAdmin.helpers({
    users: function() {
        return filteredUserQuery(Meteor.userId(), Session.get("userFilter"));
    },

    searchFilter: function() {
        return Session.get("userFilter");
    },

    myself: function(userId) {
        return myself(userId);
    },

    header: function() {
        return Template.accountHeaderCell.extend({ header: this.column.label });
    },

    columns: function() {
        return AccountsAdminUI.allColumns();
    },

    cell: function() {
        var column = this.column;
        var user = this.user;
        if (column.template) {
            if (!Template[column.template])
                throw new Meteor.error(422, 'Template ' + column.template + ' not found.');
            else
                return Template[column.template];
        } else if (column.attribute) {
            if (typeof column.attribute === 'function')
                var attributeName = column.attribute(user);
            else if (typeof column.attribute === 'string')
                var attributeName = column.attribute;
            if (attributeName) {
                return Template.accountBasicCell.extend({
                    value: propertyByString(user, attributeName)
                });
            }
        };
        // If nothing found, render an empty cell (inclusion syntax does not allow returning nothing)
        return Template.accountBasicCell.extend({ value: "" });
    }
});

var myself = function(userId) {
    return Meteor.userId() === userId;
};

Template.accountEditCell.helpers({
    myself: function(userId) {
        return myself(userId);
    }
});

Template.accountNameCell.helpers({
    email: function() {
        if (this.user.emails && this.user.emails.length)
            return this.user.emails[0].address;

        if (this.user.services) {
            //Iterate through services
            for (var serviceName in this.user.services) {
                var serviceObject = this.user.services[serviceName];
                //If an 'id' isset then assume valid service
                if (serviceObject.id) {
                    if (serviceObject.email) {
                        return serviceObject.email;
                    }
                }
            }
        }
        return "";
    }
});

// search no more than 2 times per second
var setUserFilter = _.throttle(function(template) {
    var search = template.find(".search-input-filter").value;
    Session.set("userFilter", search);
}, 500);

Template.accountsAdmin.events({
    'keyup .search-input-filter': function(event, template) {
        setUserFilter(template);
        return false;
    }
});

Template.accountEditCell.events({
    'click .glyphicon-trash': function(event, template) {
        Session.set('userInScope', this.user);
    },

    'click .glyphicon-info-sign': function(event, template) {
        Session.set('userInScope', this.user);
    },

    'click .glyphicon-pencil': function(event, template) {
        Session.set('userInScope', this.user);
    }
});

Template.accountsAdmin.rendered = function() {
    var searchElement = document.getElementsByClassName('search-input-filter');
    if(!searchElement)
        return;
    var filterValue = Session.get("userFilter");

    var pos = 0;
    if (filterValue)
        pos = filterValue.length;

    searchElement[0].focus();
    searchElement[0].setSelectionRange(pos, pos);
};