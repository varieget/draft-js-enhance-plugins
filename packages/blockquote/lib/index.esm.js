import { ContentBlock, genKey, EditorState, RichUtils } from 'draft-js';

function createBlockquotePlugin() {
  return {
    onChange: function (editorState) {
      // create a block at the end when blockquote is the lastBlock
      var contentState = editorState.getCurrentContent();

      if (contentState.getLastBlock().getType() === 'blockquote') {
        var block = new ContentBlock({
          key: genKey()
        });
        return EditorState.set(editorState, {
          currentContent: contentState.merge({
            blockMap: contentState.getBlockMap().set(block.getKey(), block)
          })
        });
      }

      return editorState;
    },
    handleReturn: function (event, editorState, _a) {
      var setEditorState = _a.setEditorState; // support press enter to insert new line

      var blockType = RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'blockquote') {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

export { createBlockquotePlugin as default };
