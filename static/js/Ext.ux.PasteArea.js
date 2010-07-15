Ext.ux.PasteArea = Ext.extend(Ext.form.FormPanel, {
	
	initComponent:function() {
		
		Ext.apply(this, {
			layout:"border"
			,items:[{
				region:"center"
				,layout:"card"
				,ref:"cardPanel"
				,id:"xxxxxxxxxxxxxxxxxxxxx"
				,margins:"5"
				,activeItem:0
				,tbar:[{
    				text:"Edit"
    				,iconCls:"icon-edit"
    				,enableToggle:true
    				,scope:this
    				,toggleHandler:this.toggleEdit
    			}]
				,items:[{
					html:"pof"
				}, {
					xtype:"textarea"
					,ref:"../textarea"
					,name:"blob"
				}]
			}, {
				region:"east"
				,layout:"form"
				,width:300
				,margins:"5 5 5 0"
				,padding:"5"
				,items:[{
					xtype:"textfield"
					,fieldLabel:"Password"
					,inputType:"password"
					,ref:"../password"
					,submitValue:false
					,anchor:"0"
				}, {
					xtype:"combo"
					,fieldLabel:"Expiry"
					,anchor:"0"
					,name:"expiry"
				}, {
				    xtype:"hidden"
				    ,name:"salt"
				    ,ref:"../salt"
				    ,value:"pof"
				}]
				,buttons:[{
					text:"Submit"
					,iconCls:"icon-submit"
					,scale:"large"
					,iconAlign:"right"
					,width:85
					,scope:this
					,handler:this.onSubmit
				}, {
				    text:"Decode"
					,iconCls:"icon-decode"
					,scale:"large"
					,iconAlign:"right"
					,width:85
					,scope:this
					,handler:this.onDecode
				}]
			}]
		});
		
		Ext.ux.PasteArea.superclass.initComponent.call(this);
		
		this.getForm().on({
		    scope:this
		    ,beforeaction:function() {
		        var value = this.textarea.getValue();		        
                value = this.RC4Stream(this.salt.getValue() + this.password.getValue(), value);
                value = Base64.encode(value);
		        this.textarea.setValue(value);
		    }
		});

		this.on({
		    afterrender:function() {
		        console.log(this.pid);
		        if (this.pid) this.getBlob();
		    }
		})

	}

	,onSubmit:function() {
	    
	    var success = function(form, action) {
	        console.log(arguments);
	        var json = Ext.decode(action.response.responseText);
	        if (json.success) {
	            this.pid = json.pid;
	        }
	    };

	    var failure = function(form, action) {
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

		this.getForm().submit({
		    url:"index.php"
		    ,params:{
		        page:"save_blob"
		    }
		    ,success:success
		    ,failure:failure
		});
	}

    ,toggleEdit:function(button, pressed) {
        console.log("toggle", this.cardPanel);
        var index = pressed ? 1 : 0;
        this.cardPanel.getLayout().setActiveItem(index);
        this.cardPanel.doLayout();
    }

    ,getBlob:function() {
        
        var callback = function(options, success, response) {
            var json = Ext.decode(response.responseText);
            if (json.success) {
                this.blob = json.blob;
                this.salt = json.salt;
            }
        }
        
        Ext.Ajax.request({
            url:"index.php"
            ,params:{
                page:"get_blob"
                ,pid:this.pid
            }
            ,scope:this
            ,callback:callback
        });
    }

    ,RC4Stream:function(key, value) {
        var rc4 = new Crypt_RC4();
    	rc4.setKey(key);
    	return rc4.decrypt(value);
    }

    ,onDecode:function() {
        console.log("BLOB", this.blob);
        value = Base64.decode(this.blob);
        console.log("VALUE", value);
        value = this.RC4Stream(this.salt + this.password.getValue(), value);
        this.textarea.setValue(value);
    }

});