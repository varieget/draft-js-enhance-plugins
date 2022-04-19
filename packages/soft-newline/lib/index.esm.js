import { RichUtils } from 'draft-js';

function createSoftNewlinePlugin() {
  return {
    handleReturn: function (event, editorState, _a) {
      var setEditorState = _a.setEditorState;
      var currentStyle = editorState.getCurrentInlineStyle();

      if (event.shiftKey && !currentStyle.has('CODE')) {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

export { createSoftNewlinePlugin as default };
