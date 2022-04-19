import { RichUtils } from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';

function createSoftNewlinePlugin(): EditorPlugin {
  return {
    handleReturn: function (event, editorState, { setEditorState }) {
      const currentStyle = editorState.getCurrentInlineStyle();

      if (event.shiftKey && !currentStyle.has('CODE')) {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    },
  };
}

export default createSoftNewlinePlugin;
