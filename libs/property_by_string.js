// Helper function that parses things like
// obj["list[0].prop"] === obj.list[0].prop
propertyByString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    while (a.length) {
        var n = a.shift();
        if (n in o)
            o = o[n];
        else 
            return;
    }
    return o;
}