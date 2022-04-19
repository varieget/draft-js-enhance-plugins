import { EditorState, ContentBlock, RichUtils, genKey } from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';

function createBlockquotePlugin(): EditorPlugin {
  return {
    onChange: function (editorState) {
      // create a block at the end when blockquote is the lastBlock
      const contentState = editorState.getCurrentContent();

      if (contentState.getLastBlock().getType() === 'blockquote') {
        const block = new ContentBlock({
          key: genKey(),
        });

        return EditorState.set(editorState, {
          currentContent: contentState.merge({
            blockMap: contentState.getBlockMap().set(block.getKey(), block),
          }),
        });
      }

      return editorState;
    },
    handleReturn: function (event, editorState, { setEditorState }) {
      // support press enter to insert new line
      const blockType = RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'blockquote') {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    },
  };
}

export default createBlockquotePlugin;
