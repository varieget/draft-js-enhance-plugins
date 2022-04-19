'use strict';

var draftJs = require('draft-js');

function createSoftNewlinePlugin() {
  return {
    handleReturn: function (event, editorState, _a) {
      var setEditorState = _a.setEditorState;
      var currentStyle = editorState.getCurrentInlineStyle();

      if (event.shiftKey && !currentStyle.has('CODE')) {
        setEditorState(draftJs.RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

module.exports = createSoftNewlinePlugin;
