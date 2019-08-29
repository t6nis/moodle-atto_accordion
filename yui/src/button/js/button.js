// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_accordion
 * @copyright  2014 Tõnis Tartes <tonis.tartes@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_accordion-button
 */

/**
 * Atto text editor accordion plugin.
 *
 * @namespace M.atto_accordion
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_accordion',
    CSS = {
        TITLEINPUT: 'atto_accordion_title',
        CONTENTINPUT: 'atto_accordion_content'
    },
    SELECTORS = {
        TITLEINPUT: '.atto_accordion_title',
        CONTENTINPUT: '.atto_accordion_content'
    },
    TEMPLATE = '' +
            '<form class="atto_form">' +
                '<label for="{{elementid}}_atto_accordion_title">{{get_string "accordiontitle" component}}*</label>' +
                '<input class="accordion title {{CSS.TITLEINPUT}}" type="title" id="{{elementid}}_atto_accordion_title"/><br/>' +
                '<label for="{{elementid}}_atto_accordion_content">{{get_string "accordioncontent" component}}</label>' +
                '<textarea class="accordion content {{CSS.CONTENTINPUT}}" type="content" id="{{elementid}}_atto_accordion_content" rows="10"></textarea>' +
                '<br/>' +
                '<div class="mdl-align">' +
                    '<br/>' +
                    '<button type="submit" class="submit">{{get_string "createaccordion" component}}</button>' +
                '</div>' +
            '</form>';
    
Y.namespace('M.atto_accordion').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    
    /**
     * A reference to the current selection at the time that the dialogue
     * was opened.
     *
     * @property _currentSelection
     * @type Range
     * @private
     */
    _currentSelection: null,

    /**
     * A reference to the dialogue content.
     *
     * @property _content
     * @type Node
     * @private
     */
    _content: null,
    
    initializer: function() {
        this.addButton({
            icon: 'icon',
            iconComponent: 'atto_accordion',
            callback: this._displayDialogue
        });
    },
    /**
     * Display the link editor.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function() {
        // Store the current selection.
        this._currentSelection = this.get('host').getSelection();
       
        if (this._currentSelection === false || this._currentSelection.collapsed) {
            return;
        }

        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('createaccordion', COMPONENTNAME),
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.TITLEINPUT
        });

        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent());

        dialogue.show();
    },

    /**
     * Generates the content of the dialogue.
     *
     * @method _getDialogueContent
     * @return {Node} Node containing the dialogue content
     * @private
     */
    _getDialogueContent: function() {

        var template = Y.Handlebars.compile(TEMPLATE);
        this._content = Y.Node.create(template({
            component: COMPONENTNAME,
            CSS: CSS
        }));

        //Set title from selection
        if (this._currentSelection !== false || !this._currentSelection.collapsed) {
            if (typeof this._currentSelection[0].commonAncestorContainer.length === 'undefined') {
                var title = this._currentSelection[0].commonAncestorContainer.textContent;
                var content = this._currentSelection[0].commonAncestorContainer.innerHTML;
            } else {
                var title = this._currentSelection[0].commonAncestorContainer.data.toString();
                var content = title;
            }
            title = title.substring(this._currentSelection[0].startOffset, this._currentSelection[0].endOffset);
            content = content.trim();
            this._content.one(SELECTORS.TITLEINPUT).set('value', title);
            this._content.one(SELECTORS.CONTENTINPUT).set('value', content);
        }
        
        this._content.one('.submit').on('click', this._createaccordion, this);

        return this._content;
    },
    
    /**
     * The link was inserted, so make changes to the editor source.
     *
     * @method _setLink
     * @param {EventFacade} e
     * @private
     */
    _createaccordion: function(e) {
        var inputtitle,
            inputcontent,
            titlevalue,
            contentvalue,
            content;

        var host = this.get('host');
                
        e.preventDefault();
        
        inputtitle = this._content.one(SELECTORS.TITLEINPUT);
        inputcontent = this._content.one(SELECTORS.CONTENTINPUT);
        
        titlevalue = inputtitle.get('value');
        contentvalue = inputcontent.get('value');
        
        if (!titlevalue.trim()) {
            return;
        }
        
        if (titlevalue !== '' || contentvalue !== '') {
            titlevalue = titlevalue.replace(/(<([^>]+)>)/ig,"");
            contentvalue = contentvalue.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/ig,""); //Clear script tags from content
            contentvalue = contentvalue.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/ig,""); //Clear iframe tags from content
            content = '[accordion][acctitle]'+titlevalue+'[/acctitle]'+contentvalue+'[/accordion]';
            
            host.setSelection(this._currentSelection);
            host.insertContentAtFocusPoint(content);
            
            this.getDialogue({
                focusAfterHide: null
            }).hide();
            this.editor.focus();
            this.markUpdated();
        }
    }
});
