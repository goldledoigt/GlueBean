/*!
 * Ext JS Library 3.2.1
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns('Ext.ux.form');

Ext.ux.form.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            delete this.store.baseParams.query;
            this.store.load({params:{start:0, limit:30}});
            this.hasSearch = false;
            this.triggers[0].hide();
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
        this.store.setBaseParam("query", v);
        this.store.load({params:{start:0, limit:30}});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});

Ext.reg("searchfield", Ext.ux.form.SearchField);
