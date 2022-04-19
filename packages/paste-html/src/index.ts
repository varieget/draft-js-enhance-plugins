import { EditorState, Modifier } from 'draft-js';
import type { ContentState } from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';

function createPasteHTMLPlugin({
  convertFromHTML,
}: {
  convertFromHTML: (html: string) => ContentState;
}): EditorPlugin {
  return {
    handlePastedText: function (text, html, editorState, { setEditorState }) {
      if (html) {
        const contentState = convertFromHTML(html);

        const blockMap = contentState.getBlockMap();
        const entityMap = contentState.getEntityMap();

        const newContentState = Modifier.replaceWithFragment(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          blockMap
        );

        setEditorState(
          EditorState.push(
            editorState,
            newContentState.set('entityMap', entityMap) as ContentState,
            'insert-fragment'
          )
        );

        return 'handled';
      }

      return 'not-handled';
    },
  };
}

export default createPasteHTMLPlugin;
