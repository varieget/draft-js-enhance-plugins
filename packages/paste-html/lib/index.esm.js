import { Modifier, EditorState } from 'draft-js';

function createPasteHTMLPlugin(_a) {
  var convertFromHTML = _a.convertFromHTML;
  return {
    handlePastedText: function (text, html, editorState, _a) {
      var setEditorState = _a.setEditorState;

      if (html) {
        var contentState = convertFromHTML(html);
        var blockMap = contentState.getBlockMap();
        var entityMap = contentState.getEntityMap();
        var newContentState = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), blockMap);
        setEditorState(EditorState.push(editorState, newContentState.set('entityMap', entityMap), 'insert-fragment'));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

export { createPasteHTMLPlugin as default };
