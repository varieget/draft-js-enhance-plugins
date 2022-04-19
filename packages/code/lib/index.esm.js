import { CharacterMetadata, ContentBlock, genKey, ContentState, EditorState, RichUtils, Modifier } from 'draft-js';
import Prism from 'prismjs';
import PrismDecorator from 'draft-js-prism';

function createCodePlugin() {
  return {
    decorators: [new PrismDecorator({
      prism: Prism,
      getSyntax: function (block) {
        var language = block.getData().get('language');

        if (language && Prism.languages[language]) {
          return language;
        }

        return null;
      }
    })],
    onChange: function (editorState) {
      var contentState = editorState.getCurrentContent();
      var blocks = contentState.getBlocksAsArray(); // clear inline styles in code-block

      var newBlocks = blocks.map(function (block) {
        if (block.getType() !== 'code-block') return block;
        var chars = block.getCharacterList();
        var i = 0;

        while (i < block.getLength()) {
          chars = chars.set(i, CharacterMetadata.create());
          i++;
        }

        return block.set('characterList', chars);
      }); // create a block at the end when code-block is the lastBlock

      if (contentState.getLastBlock().getType() === 'code-block') {
        var block = new ContentBlock({
          key: genKey()
        });
        newBlocks.push(block);
      }

      var newContentState = ContentState.createFromBlockArray(newBlocks);
      return EditorState.set(editorState, {
        currentContent: newContentState
      });
    },
    handleReturn: function (event, editorState, _a) {
      var setEditorState = _a.setEditorState; // support press enter to insert new line

      var blockType = RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'code-block') {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    },
    handlePastedText: function (text, html, editorState, _a) {
      var setEditorState = _a.setEditorState; // paste plain text to code-block

      var contentState = editorState.getCurrentContent();
      var selectionState = editorState.getSelection();
      var blockType = RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'code-block') {
        setEditorState(EditorState.push(editorState, Modifier.replaceText(contentState, selectionState, text), 'insert-characters'));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

export { createCodePlugin as default };
