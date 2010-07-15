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
					,anchor:"0"
				}, {
					xtype:"combo"
					,fieldLabel:"Expiration"
					,anchor:"0"
				}]
				,buttons:[{
					text:"Submit"
					,iconCls:"icon-submit"
					,scale:"large"
					,iconAlign:"right"
					,width:85
					,scope:this
					,handler:this.onSubmit
				}]
			}]
		});
		
		Ext.ux.PasteArea.superclass.initComponent.call(this);
	}
	
	,onSubmit:function() {
	    
	    var success = function(form, action) {
	        
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

});