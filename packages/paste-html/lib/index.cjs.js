'use strict';

var draftJs = require('draft-js');

function createPasteHTMLPlugin(_a) {
  var convertFromHTML = _a.convertFromHTML;
  return {
    handlePastedText: function (text, html, editorState, _a) {
      var setEditorState = _a.setEditorState;

      if (html) {
        var contentState = convertFromHTML(html);
        var blockMap = contentState.getBlockMap();
        var entityMap = contentState.getEntityMap();
        var newContentState = draftJs.Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);
        setEditorState(draftJs.EditorState.push(editorState, newContentState.set('entityMap', entityMap), 'insert-fragment'));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

module.exports = createPasteHTMLPlugin;
