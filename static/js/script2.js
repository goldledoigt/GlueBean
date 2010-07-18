GlueBean = function() {
    
    var PID = false;

    var mask = false;
    
    // TODO: rewrite this to catch PID in the url
    function getUrlPid() {
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

    function RC4Stream(key, value) {
        var rc4 = new Crypt_RC4();
    	rc4.setKey(key);
    	return rc4.decrypt(value);
    }

    function toggleFieldContent(button, pressed) {
        if (pressed) {
            var str = "";
            if (button.text === "PID")
                str = PID;
            else if (button.text === "URL")
                str = "http://gluebean.com/?" + PID
            toolbar.pidField.setValue(str);
            toolbar.pidField.focus();
        }
    }

    function showHelp() {
        var ePos = Ext.fly("editor").getXY();
        var tPos = Ext.fly("toolbar").getXY();
        textTooltip.showAt([ePos[0] - 165, ePos[1]]);
        passwordTooltip.showAt([tPos[0] + 80, tPos[1] - 22]);
        urlTooltip.showAt([tPos[0] + 400, tPos[1] - 22]);
    }

    function setPID(pid) {
        PID = pid;
        editor.getLayout().setActiveItem(1);
        toolbar.lockButton.setIconClass("icon-lock");
        toolbar.pidButton.enable();
        toolbar.urlButton.enable();
        toolbar.pidField.enable();
        toolbar.pidButton.toggle(true);
        toolbar.pidField.setValue(PID);
        toolbar.pidField.focus();
    }
    
    function render() {
        editor.render("editor");
        toolbar.render("toolbar");
    }
    
    function onRender() {
        var resizer = new Ext.Resizable("editor", {
            pinned:true
            ,height:300
            ,minHeight:200
            ,handles:"s"
        });

        resizer.on({
            scope:editor
            ,resize:function(resizer, width, height, event) {
                this.setHeight(height);
            }
        });

        this.panel.on({
            resize:function(panel, adjWidth, adjHeight, width, height) {
                panel.suspendEvents();
                panel.setHeight(height-6);
                panel.resumeEvents();
            }
        });

        mask = new Ext.LoadMask(editor.body, {msg:"Please wait..."});
    }

    function toggleLock() {
        if (toolbar.lockButton.iconCls === "icon-unlock") {
            submit();
        } else if (toolbar.lockButton.iconCls === "icon-lock") {
            get();
        }
    }

    /*********************************************************************************
    ***** SUBMIT *********************************************************************
    *********************************************************************************/

    function submit() {
	    var success = function(response, options) {
	        var json = Ext.decode(response.responseText);
	        if (json.success) {
	            setPID(json.pid);
	        }
	        mask.hide();
	    };

	    var failure = function(response, options) {
	        mask.hide();
	        switch (action.failureType) {
    	        case Ext.form.Action.CLIENT_INVALID:
                    Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                    break;
                case Ext.form.Action.CONNECT_FAILURE:
                    Ext.Msg.alert('Failure', 'Ajax communication failed');
                    break;
                case Ext.form.Action.SERVER_INVALID:
                   Ext.Msg.alert('Failure', action.result.msg);
            }
	    };

        mask.show();
        var text = editor.textarea.getValue();
        var password = toolbar.password.getValue();
        var salt = "SALT";
        var blob = Base64.encode(RC4Stream(salt + password, text));
        editor.textarea.setValue(blob);
        editor.panel.update(blob);

        Ext.Ajax.request({
		    url:"index.php"
		    ,success:success
		    ,failure:failure
		    ,params:{
		        page:"save_blob"
		        ,blob:blob
		        ,salt:salt
		    }
		});        
    }
    
    /*********************************************************************************
    ***** GET ************************************************************************
    *********************************************************************************/
    
    function get() {

        var success = function(response, options) {
	        var json = Ext.decode(response.responseText);
	        if (json.success) {
	            var password = "";
                blob = RC4Stream(json.salt + password, Base64.decode(json.blob));
                editor.textarea.setValue(blob);
                editor.panel.update(blob);
                editor.getLayout().setActiveItem(0);
                toolbar.lockButton.setIconClass("icon-unlock");
	        }
        };
        
        var failure = function() {
            
        };
        
        Ext.Ajax.request({
		    url:"index.php"
		    ,success:success
		    ,failure:failure
		    ,params:{
		        page:"get_blob"
		        ,pid:PID
		    }
		});
        
    }
    
    /*********************************************************************************
    ***** TOOLTIPS *******************************************************************
    *********************************************************************************/

    var textTooltip = new Ext.ToolTip({
        anchor:"right"
        ,width:160
        ,autoHide:false
        ,closable:false
        ,html:"1 - paste your text in this area"
    });

    var passwordTooltip = new Ext.ToolTip({
        anchor:"bottom"
        ,width:140
        ,autoHide:false
        ,closable:false
        ,html:"2 - set password and lock"
    });

    var urlTooltip = new Ext.ToolTip({
        anchor:"bottom"
        ,width:180
        ,autoHide:false
        ,closable:false
        ,html:"3 - use PID to get your text back"
    });
    
    var pidTooltip = new Ext.ToolTip({
        anchor:"bottom"
        ,width:140
        ,autoHide:false
        ,closable:false
        ,html:"2 - set password and lock"
    });
    
    /*********************************************************************************
    ***** TOOLBAR ********************************************************************
    *********************************************************************************/

    var toolbar = new Ext.Panel({
        //renderTo:"toolbar"
        layout:"hbox"
        ,border:false
        ,items:[{
            xtype:"buttongroup"
            ,padding:1
            ,items:[{
                xtype:"textfield"
                ,inputType:"password"
                ,ref:"../password"
            }, {
                xtype:"spacer"
                ,width:2
            }, {
                iconCls:"icon-unlock"
                ,iconAlign:"right"
                ,ref:"../lockButton"
                ,handler:toggleLock
            }]
        }, {
            xtype:"spacer"
            ,flex:1
        }, {
            xtype:"buttongroup"
            ,padding:1
            ,items:[{
                text:"PID"
                ,toggleGroup:"pidGroup"
                ,disabled:true
                ,ref:"../pidButton"
                ,toggleHandler:toggleFieldContent
            }, {
                xtype:"spacer"
                ,width:2
            }, {
                text:"URL"
                ,toggleGroup:"pidGroup"
                ,disabled:true
                ,ref:"../urlButton"
                ,toggleHandler:toggleFieldContent
            }, {
                xtype:"spacer"
                ,width:2
            }, {
                xtype:"textfield"
                ,width:400
                ,disabled:true
                ,ref:"../pidField"
                ,selectOnFocus:true
            }, {
                xtype:"spacer"
                ,width:2
            }, {
                iconCls:"icon-help"
                ,handler:showHelp
                ,tooltip:"click to get some help"
            }]
        }]
    });
    
    /*********************************************************************************
    ***** EDITOR *********************************************************************
    *********************************************************************************/

    var editor = new Ext.Panel({
        //renderTo:"editor"
        layout:"card"
        ,height:300
        ,border:false
        ,activeItem:0
        ,layoutConfig:{
            activeItem:0
        }
        ,items:[{
            xtype:"textarea"
            ,ref:"textarea"
            ,style:"padding:0 0 5px 2px;border:none"
        }, {
            xtype:"panel"
            ,border:false
            ,ref:"panel"
            ,autoScroll:true
            ,bodyStyle:"padding:5px;background-color:#EFEFEF"
        }]
        ,listeners:{
            afterrender:onRender
        }
    });
    
    
    return Ext.apply(new Ext.util.Observable, {

        PID:false

        /*********************************************************************************
        ***** INIT ***********************************************************************
        *********************************************************************************/

        ,init:function() {
            render();
            
        }

        // scope is on editor
        ,initx:function() {
/*
            var pid = getUrlPid();
            if (pid) {
                console.log("setPID", this, window);
                setPID(pid);
            } else {
                this.textarea.focus();
            }
*/
        }

    });
    
}();

Ext.onReady(function() {
    Ext.QuickTips.init();
    GlueBean.init();
});