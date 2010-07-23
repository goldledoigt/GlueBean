GlueBean = function() {
    
    var PID = false;

    var mask = false;
    
    var historyPidTpl = new Ext.XTemplate(
        '<div><a style="font-size:12px">{pid}</a></div>'
        ,'<div style="font-size:10px">{blob}{[values.blob.length === 80 ? "..." : ""]}</div>'
        ,{compiled:true}
    );

    var historyDetailsTpl = new Ext.Template(
        '<div><a>{name}</a></div>'
        ,'<div>{syntax} | <a class="date-init">{date_init}</a></div>'
        ,{compiled:true}
    );

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

    function toggleLock() {
        if (toolbar.lockButton.iconCls === "icon-unlock") {
            submit();
        } else if (toolbar.lockButton.iconCls === "icon-lock") {
            get();
        }
    }

    function render() {
        toolbar.render("toolbar");
        details.render("details");
        editor.render("editor");
        history.render("history");
    }

    function historyPidRenderer(value, metaData, record) {
        return historyPidTpl.apply(record.data);
    }

    function historyDetailsRenderer(value, metaData, record) {
        return historyDetailsTpl.apply(record.data);
    }

    function toggleMode(mode) {
        if (mode === "readonly") {
            details.nameField.disable();
            details.syntaxField.disable();
            details.expireField.disable();
            details.emailField.disable();
        } else if (mode === "edit") {
            details.nameField.enable();
            details.syntaxField.enable();
            details.expireField.enable();
            details.emailField.enable();
        }
    }

    /*********************************************************************************
    ***** ONRENDER *******************************************************************
    *********************************************************************************/

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
        
        var pid = getUrlPid();
        if (pid) {
            console.log("setPID", this, window);
            setPID(pid);
            get();
            toggleMode("readonly");
        } else {
            this.textarea.focus();
        }
     
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});

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
        var name = details.nameField.getValue();
        var syntax = details.syntaxField.getValue();
        var expire = details.expireField.getValue();
        var email = details.emailField.getValue();
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
		        ,name:name
		        ,syntax:syntax
		        ,expire:expire
		        ,email:email
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
	            /*
	            var password = "";
                blob = RC4Stream(json.salt + password, Base64.decode(json.blob));
                editor.textarea.setValue(blob);
                editor.panel.update(blob);
                editor.getLayout().setActiveItem(0);
                toolbar.lockButton.setIconClass("icon-unlock");
                */
//                editor.textarea.setValue(json.blob);
                editor.panel.update(json.blob);
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

    /*********************************************************************************
    ***** DETAILS ********************************************************************
    *********************************************************************************/

    var details = new Ext.form.FieldSet({
        title:"Details"
        ,autoHeight:true
        ,collapsible:true
        ,collapsed:false
        ,bodyStyle:"padding:0 5px"
        ,items:[{
            layout:"column"
            ,border:false
            ,items:[{
                columnWidth:.5
                ,layout:"form"
                ,autoHeight:true
                ,border:false
                ,labelWidth:90
                ,items:[{
                    xtype:"textfield"
                    ,anchor:"-40"
                    ,fieldLabel:"Name / Title"
                    ,ref:"../../nameField"
                }, {
                    xtype:"combo"
                    ,anchor:"-40"
                    ,mode:"local"
                    ,fieldLabel:"Post expiration"
                    ,ref:"../../expireField"
                    ,displayField:"expire"
                    ,store:new Ext.data.ArrayStore({
                        fields:["expire"]
                        ,data:[["Never"], ["10 Minutes"], ["1 Hour"], ["1 Day"], ["1 Month"]]
                    })
                }]
            }, {
                columnWidth:.5
                ,layout:"form"
                ,border:false
                ,labelWidth:60
                ,items:[{
                    xtype:"textfield"
                    ,anchor:"-20"
                    ,fieldLabel:"Email"
                    ,ref:"../../emailField"
                }, {
                    xtype:"combo"
                    ,anchor:"-20"
                    ,mode:"local"
                    ,fieldLabel:"Syntax"
                    ,ref:"../../syntaxField"
                    ,displayField:"syntax"
                    ,store:new Ext.data.ArrayStore({
                        fields:["syntax"]
                        ,data:[["CSS"], ["HTML"], ["JavaScript"], ["PHP"], ["Python"]]
                    })
                }]
            }]
        }]
    });

    /*********************************************************************************
    ***** HISTORY ********************************************************************
    *********************************************************************************/

    var historyStore = new Ext.data.JsonStore({
        url:"index.php"
        ,autoLoad:{params:{start:0, limit:20}}
        ,root:"data"
        ,totalProperty:"count"
        ,fields:["pid", "blob", "date_init", "salt", "name", "syntax"]
        ,baseParams:{page:"list_blob"}
    });

    var historyToolbar = new Ext.PagingToolbar({
        pageSize:30
        ,store:historyStore
        ,displayInfo:true
        ,plugins:new Ext.ux.ProgressBarPager()
        ,items:["-", " ",
            new Ext.ux.form.SearchField({
                width:299
                ,store:historyStore
                ,emptyText:"search by user, syntax or pid"
            }), " ", "-"
        ]
    });

    var history = new Ext.form.FieldSet({
        title:"History"
        ,autoHeight:true
        ,collapsible:true
        ,collapsed:true
        ,items:[{
            xtype:"grid"
            ,height:300
            ,stripeRows:true
            ,hideHeaders:true
            ,trackMouseOver:false
            ,store:historyStore
            ,tbar:historyToolbar
            ,viewConfig:{forceFit:true}
            ,selModel:new Ext.grid.RowSelectionModel({singleSelect:true})
            ,columns:[
                {header:"Pid", dataIndex:"pid", renderer:historyPidRenderer}
                ,{header:"Details", dataIndex:"name", width:150, fixed:true, renderer:historyDetailsRenderer}
            ]
            ,listeners:{
                rowclick:function(grid, rowIndex) {
                    var pid = grid.getStore().getAt(rowIndex).get("pid");
                    console.log("PID", pid);
                }
            }
        }]
    });

    
    return Ext.apply(new Ext.util.Observable, {

        PID:false

        ,init:function() {
            render();
        }

    });
    
}();

Ext.onReady(function() {
    Ext.QuickTips.init();
    GlueBean.init();
});