Ext.onReady(function() {

	console.log("spartasss !!");

    var getPid = function() {
        var s = window.location.search;
        s = s.split("?")[1];
        if (s && s.length) {
            s = s.split("&");
            for (var i = 0, l = s.length; i < l; i++) {
                var v = s[i].split("=");
                if (v[0] === "pid")
                    return v[1];
            }
        }
        return false;
    }
	
	new Ext.ux.PasteArea({
		height:400
		,width:800
		,pid:getPid()
	}).render(Ext.getBody());

});