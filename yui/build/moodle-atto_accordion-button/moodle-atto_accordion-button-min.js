YUI.add("moodle-atto_accordion-button",function(e,t){var n="atto_accordion",r={TITLEINPUT:"atto_accordion_title",CONTENTINPUT:"atto_accordion_content"},i={TITLEINPUT:".atto_accordion_title",CONTENTINPUT:".atto_accordion_content"},s='<form class="atto_form"><label for="{{elementid}}_atto_accordion_title">{{get_string "accordiontitle" component}}*</label><input class="accordion title {{CSS.TITLEINPUT}}" type="title" id="{{elementid}}_atto_accordion_title"/><br/><label for="{{elementid}}_atto_accordion_content">{{get_string "accordioncontent" component}}</label><textarea class="accordion content {{CSS.CONTENTINPUT}}" type="content" id="{{elementid}}_atto_accordion_content" rows="10"></textarea><br/><div class="mdl-align"><br/><button type="submit" class="submit">{{get_string "createaccordion" component}}</button></div></form>';e.namespace("M.atto_accordion").Button=e.Base.create("button",e.M.editor_atto.EditorPlugin,[],{_currentSelection:null,_content:null,initializer:function(){this.addButton({icon:"icon",iconComponent:"atto_accordion",callback:this._displayDialogue})},_displayDialogue:function(){this._currentSelection=this.get("host").getSelection();if(this._currentSelection===!1||this._currentSelection.collapsed)return;var e=this.getDialogue({headerContent:M.util.get_string("createaccordion",n),focusAfterHide:!0,focusOnShowSelector:i.TITLEINPUT});e.set("bodyContent",this._getDialogueContent()),e.show()},_getDialogueContent:function(){var t=e.Handlebars.compile(s);this._content=e.Node.create(t({component:n,CSS:r}));if(this._currentSelection!==!1||!this._currentSelection.collapsed){if(typeof this._currentSelection[0].commonAncestorContainer.length=="undefined")var o=this._currentSelection[0].commonAncestorContainer.textContent,u=this._currentSelection[0].commonAncestorContainer.innerHTML;else var o=this._currentSelection[0].commonAncestorContainer.data.toString(),u=o;o=o.substring(this._currentSelection[0].startOffset,this._currentSelection[0].endOffset),u=u.trim(),this._content.one(i.TITLEINPUT).set("value",o),this._content.one(i.CONTENTINPUT).set("value",u)}return this._content.one(".submit").on("click",this._createaccordion,this),this._content},_createaccordion:function(e){var t,n,r,s,o,u=this.get("host");e.preventDefault(),t=this._content.one(i.TITLEINPUT),n=this._content.one(i.CONTENTINPUT),r=t.get("value"),s=n.get("value");if(!r.trim())return;if(r!==""||s!=="")r=r.replace(/(<([^>]+)>)/ig,""),s=s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/ig,""),s=s.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/ig,""),o="[accordion][acctitle]"+r+"[/acctitle]"+s+"[/accordion]",u.setSelection(this._currentSelection),u.insertContentAtFocusPoint(o),this.getDialogue({focusAfterHide:null}).hide(),this.editor.focus(),this.markUpdated()}})},"@VERSION@",{requires:["moodle-editor_atto-plugin"]});
