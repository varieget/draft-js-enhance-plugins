'use strict';

var draftJs = require('draft-js');
var Prism = require('prismjs');
var PrismDecorator = require('draft-js-prism');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Prism__default = /*#__PURE__*/_interopDefaultLegacy(Prism);
var PrismDecorator__default = /*#__PURE__*/_interopDefaultLegacy(PrismDecorator);

function createCodePlugin() {
  return {
    decorators: [new PrismDecorator__default["default"]({
      prism: Prism__default["default"],
      getSyntax: function (block) {
        var language = block.getData().get('language');

        if (language && Prism__default["default"].languages[language]) {
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
          chars = chars.set(i, draftJs.CharacterMetadata.create());
          i++;
        }

        return block.set('characterList', chars);
      }); // create a block at the end when code-block is the lastBlock

      if (contentState.getLastBlock().getType() === 'code-block') {
        var block = new draftJs.ContentBlock({
          key: draftJs.genKey()
        });
        newBlocks.push(block);
      }

      var newContentState = draftJs.ContentState.createFromBlockArray(newBlocks);
      return draftJs.EditorState.set(editorState, {
        currentContent: newContentState
      });
    },
    handleReturn: function (event, editorState, _a) {
      var setEditorState = _a.setEditorState; // support press enter to insert new line

      var blockType = draftJs.RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'code-block') {
        setEditorState(draftJs.RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    },
    handlePastedText: function (text, html, editorState, _a) {
      var setEditorState = _a.setEditorState; // paste plain text to code-block

      var contentState = editorState.getCurrentContent();
      var selectionState = editorState.getSelection();
      var blockType = draftJs.RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'code-block') {
        setEditorState(draftJs.EditorState.push(editorState, draftJs.Modifier.replaceText(contentState, selectionState, text), 'insert-characters'));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

module.exports = createCodePlugin;
