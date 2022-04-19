'use strict';

var draftJs = require('draft-js');

function createBlockquotePlugin() {
  return {
    onChange: function (editorState) {
      // create a block at the end when blockquote is the lastBlock
      var contentState = editorState.getCurrentContent();

      if (contentState.getLastBlock().getType() === 'blockquote') {
        var block = new draftJs.ContentBlock({
          key: draftJs.genKey()
        });
        return draftJs.EditorState.set(editorState, {
          currentContent: contentState.merge({
            blockMap: contentState.getBlockMap().set(block.getKey(), block)
          })
        });
      }

      return editorState;
    },
    handleReturn: function (event, editorState, _a) {
      var setEditorState = _a.setEditorState; // support press enter to insert new line

      var blockType = draftJs.RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'blockquote') {
        setEditorState(draftJs.RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

module.exports = createBlockquotePlugin;
