AccountsAdminUI = {
    settings: {
        defaultColumns: [
            {
                label: "",
                inInfo: false,
                template: "accountEditCell"
            },
            {
                label: "Name",
                attribute: "profile.name",
                editable: true,
                template: "accountNameCell"
            },
            {
                label: "Email",
                attribute: function(user) {
                    if (user.emails && user.emails.length)
                        return "emails[0].address";
                    if (user.services) {
                        //Iterate through services
                        for (var serviceName in user.services) {
                            var serviceObject = user.services[serviceName];
                            //If an 'id' isset then assume valid service
                            if (serviceObject.id && serviceObject.email) 
                                return "services." + serviceName + ".email";
                        }
                    }
                    return false;
                },
                editable: false
            },
            {
                label: "Roles",
                attribute: "roles",
                editable: true
            }
        ],

        columns: []
    },

    allColumns: function() {
        return this.settings.defaultColumns.concat(this.settings.columns);
    },

    config: function(appConfig) {
        this.settings = _.extend(this.settings, appConfig);
    }
}