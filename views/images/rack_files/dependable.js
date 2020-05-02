
/**
 * Custom Options Templates for EE
 *
 * @category:    Aitoc
 * @package:     Aitoc_Aitoptionstemplate
 * @version      10.2.3
 * @license:     n/a
 * @copyright:   Copyright (c) 2014 AITOC, Inc. (http://www.aitoc.com)
 */
var aitdependable = {     
    _config: {},
    _dependantIds: {}, //array of all elements with row_id as a key for fastest access to them
    _changedElements: {}, //array of elements which selection may affect visibility of other elements
    _hiddenRows: {}, // array of child ids that must be hidden if nothing is selected
    _optionByRow: {},
    _hiddenSelects: {},
    _childParentLinks: {},
    wrapper_prefix: 'aitoption_wrapper_',
    selectionRemoved: false,
    requireSelectionRemoved: false,
    needToRevalidate: false,
    init: function(config)
    {
        this._config = config.data;
        var el, els, id, option_id, hidden;
        var rows = {};
        for(option_id in config.data) {
            el = $(this.wrapper_prefix + option_id);
            if(el) {
                this._dependantIds[ config.data[option_id][0].row_id ] = $(this.wrapper_prefix + option_id);
                this._optionByRow[ config.data[option_id][0].row_id ] = option_id;
            }
            //for options like text, file, data, that don't have any sub options
            //in JSON elements will be stored like [{...}] instead of {0:{...}} and will have functions and length elements added to it because of array object
            if(config.data[option_id].length) continue;
            for(var type_id in config.data[option_id]) {
                if(type_id == 0) continue;
                rows[ type_id ] = config.data[option_id][type_id];
                if(config.data[option_id].length) {
					this._childParentLinks[ config.data[option_id][type_id].row_id ] = config.data[option_id][0].row_id;
				}
            }
        }
        //making copy of base elements
        var options = this._dependantIds;
        for(var row_id in options) {
            el = options[row_id].down('div.input-box');
            if(!el) {
                continue;
            }
            if(el.down('select')) {
                var select = el.down('select')
                Event.observe(select, 'change', this.validateOnChange.bind(this))
                els = select.select('option');
                this._hiddenSelects[row_id] = els;
                for(var i=0; i < els.length; i++) {
                    id = parseInt(els[i].value);
                    // 'Please select' element doesn't have value
                    if(id==0) {continue;}
                    if(typeof(rows[id]) != 'undefined') {
                        this._dependantIds[ rows[id].row_id ] = els[i];
                        this._changedElements[ rows[ id ].row_id ] = {
                            el: els[i]
                        };
                        if(rows[ id ].child_rows != '') {
                            hidden = rows[ id ].child_rows.split(',');
                            this._changedElements[ rows[ id ].row_id ].childs = hidden;
                            this.addDependant(hidden);
                        }
                    }
                }
                continue;
            }
            if(el.down('ul.options-list')) {
                els = el.down('ul.options-list').select('li input');
                for(var i=0; i < els.length; i++) {
                    el = els[i];
                    Event.observe(el, 'change', this.validateOnChange.bind(this))
                    id = parseInt(el.value);
                    if(id==0) {continue;}
                    if(typeof(rows[id]) != 'undefined') {
                        this._dependantIds[ rows[id].row_id ] = els[i].up();
                        this._changedElements[ rows[ id ].row_id ] = {
                            el: els[i]
                        };
                        if(rows[ id ].child_rows != '') {
                            hidden = rows[ id ].child_rows.split(',');
                            this._changedElements[ rows[ id ].row_id ].childs = hidden;
                            this.addDependant(hidden);
                        }
                    }
                }
                continue;
            }
        }
        this.validate();
    },
    addDependant: function( els )
    {
        if(!els.length) {
            return false;
        }
        for(var i=0;i<els.length;i++) {
            this._hiddenRows[ els[i] ] = 1;
        }
        
    },
    validateOnChange: function(el)
    {
        this.selectionRemoved = false;
        this.requireSelectionRemoved = false;
        this.validate();
    },
    
    validate: function()
    {
        this.shown = {};
        var el, els, value;
        for(var type_id in this._changedElements) {
            if(typeof(this._changedElements[type_id].childs) == 'undefined') continue;
            el = this._changedElements[type_id].el;
            value = 0;
            if(el.checked || el.selected) {
                value = 1;
            }
            els = this._changedElements[type_id].childs;
            for(var i=0;i<els.length;i++) {
                this.setVisibility(els[i], value);
                if( this._childParentLinks[ els[i] ] ) {
                    this.setVisibility(this._childParentLinks[ els[i] ], value);
                }
            }                
        }
        for(var row_id in this.shown) {
            if(this._dependantIds[row_id]) {
                if(this._dependantIds[row_id].nodeName!='OPTION') {
                    this._dependantIds[row_id].show();
                } else {
                    this.showOption(row_id, this._dependantIds[row_id]);
                }
            }
        }
        this.hideAll(this._hiddenRows);        
    },
    
    setVisibility: function(id, value)
    {
        //to prevent disabling already shown elements - we set only positive values
        if(this.shown[ id ] == 1) {
            return false;
        }
        if(value == 1) {
            this.shown[ id ] = value;
        }
        //to prevent hiding of elements that doesn't require to be hidden - we check if this element was in this array in first place
        if(typeof(this._hiddenRows[ id ]) != 'undefined') {
            this._hiddenRows[ id ] = 1 - value;        
        }
    },
    
    hideAll: function(els)
    {
        for(var row_id in els) {
            if(els[row_id] == 1 && this._dependantIds[row_id]) {
                this.removeSelection(row_id);
                if(this._dependantIds[row_id].nodeName!='OPTION') {
                    this._dependantIds[row_id].hide();
                } else {
                    this.hideOption(row_id, this._dependantIds[row_id]);
                }
            }
        }
        //hiding empty select(s)/radio/checkboxes areas
        for(var option_id in this._config) {
            if(this._config[option_id][0] !== undefined) {
				var type = this._config[option_id][0].option_type;
			}
            if(type != 'drop_down' && type != 'multiple' && type != 'radio' && type != 'checkbox') continue;
            if(this._config[option_id].length) continue;
            var show = 0;
            for(var type_id in this._config[option_id]) {
                if(type_id == 0) continue;
                var row_id = this._config[option_id][type_id].row_id;
                if(typeof(this._hiddenRows[row_id]) == 'undefined' || this._hiddenRows[row_id] == 0) {
                    show = 1;
                }
            }
            if(show == 0) {
                this._dependantIds[this._config[option_id][0].row_id].hide();
            }
        }
        if(this.requireSelectionRemoved && !this.selectionRemoved) {
            //flag to prevent loop
            this.selectionRemoved = true;
            //recursion to hide elements that may be affected by removed selection of hidden elements
            this.validate();
        }
    },
    
    hideOption: function(row_id, el)
    {
        if(el.selected) {
            el.selected = false;
        }
        var select = el.up('select');
        if(select) {
            select.remove(el.index);
        }
    },
    
    showOption: function(row_id, el)
    {
        if(el.up('select')) {
            //option already added
            return false;
        }
        var parent_id = this._childParentLinks[row_id];
        var before = this.findPosition(el, parent_id);
        var select = this._dependantIds[parent_id].down('select');
        if(before != null) {
            select.add(el, before);
        } else {
            try {
                select.add(el, null);
            } catch(e) {
                select.add(el);
            }
        }
    },
    
    findPosition: function(el, parent_id)
    {
        var index = 0;
        var before = null;
        var length = this._hiddenSelects[parent_id].length;
        for(index=0;index<length;index++) {
            //finding position of this element in Select
            if(this._hiddenSelects[parent_id][index] == el) {
                break;
            }
        }
        for(var i=index+1;i<length;i++) {
            //finding next visible element in select
            var opt = this._hiddenSelects[parent_id][i]
            if(opt.index != -1 && opt.up('select')) {
                //and using it as 'before' where we add current element
                before = this._hiddenSelects[parent_id][i];
                break;
            }
        }
        return before;
    },
    
    removeSelection: function( row_id )
    {
        var check = false;
        if(this._changedElements[row_id]) {
            el = this._changedElements[row_id].el;
            if(el.checked) {//checkbox
                check = true;
                el.checked = false;
            }
            if(el.selected) {//select options
                check = true;
                el.selected = false;
            }
            if(check) {
                this.requireSelectionRemoved = check;
            }
            return true;
        } else {
            this.removeSelectionComplex(row_id);
        }
    },
    
    removeSelectionComplex: function( row_id )
    {
        var option_id = this._optionByRow[row_id];
        if(!option_id) {
            return false;
        }
        var type = this._config[option_id][0].option_type;
        var el = this._dependantIds[row_id];
        switch(type) {
            case 'file':
                el.down('div.input-box').innerHTML = el.down('div.input-box').innerHTML;
            break;
            case 'field':
                el.down('input').value = '';
            break;
            case 'area':
                el.down('textarea').value = '';
            break;
            case 'date':
            case 'time':
            case 'date_time':
                el.select('.datetime-picker').each(function(item){item.selectedIndex = 0;})
            break;
            case 'drop_down':
            case 'multiple':
                this.processMultiselectRemoval(el.down('select'), type);
            break;
            case 'radio':
            case 'checkbox':
                this.processCheckboxesRemoval(el);
            break;
        }
    },

    processMultiselectRemoval: function( el, type )
    {
        this.needToRevalidate = false;
        el.select('option').each(function(item){
            if(item.selected && !(type=='drop_down' && item.index==0)) {
                item.selected=false;
                // set flag to re-validate element and disable dependant options if there are any
                this.needToRevalidate = true;
            }
        }.bind(this));
        if (this.needToRevalidate) {
            // re-validate entire multiselect/select
            this.validateOnChange(el);
        }    
    },
    
    processCheckboxesRemoval: function( el )
    {
        el.select('input').each(function(item){
            if(item.checked) {
                item.checked=false;
                // re-validate and disable dependant options for particular checkbox/radio if there are any
                this.validateOnChange(item);
            }
        }.bind(this));
    }

};