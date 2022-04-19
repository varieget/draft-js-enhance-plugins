'use strict';

var draftJs = require('draft-js');
var immutable = require('immutable');

function createClearFormatPluginPlugin() {
  return {
    handleKeyCommand: function (command, editorState, eventTimeStamp, _a) {
      var setEditorState = _a.setEditorState;

      if (command === 'clear-format') {
        var selectionState = editorState.getSelection();

        if (!selectionState.isCollapsed()) {
          var contentState = editorState.getCurrentContent();
          var blockMap = contentState.getBlockMap();
          var startKey_1 = selectionState.getStartKey();
          var endKey_1 = selectionState.getEndKey();
          var newBlocks = blockMap.toSeq().skipUntil(function (_, k) {
            return k === startKey_1;
          }).takeUntil(function (_, k) {
            return k === endKey_1;
          }).concat(immutable.Map([[endKey_1, blockMap.get(endKey_1)]])).map(function (block) {
            if (!block) return block;

            if (block.getType() === 'atomic') {
              return block;
            }

            var chars = block.getCharacterList();
            var i = 0;

            while (i < block.getLength()) {
              chars = chars.set(i, draftJs.CharacterMetadata.create());
              i++;
            }

            return block.merge({
              type: 'unstyled',
              characterList: chars
            });
          });
          setEditorState(draftJs.EditorState.forceSelection(draftJs.EditorState.push(editorState, contentState.merge({
            blockMap: blockMap.merge(newBlocks),
            selectionBefore: selectionState,
            selectionAfter: selectionState
          }), 'change-block-type'), selectionState));
        }

        return 'handled';
      }

      return 'not-handled';
    }
  };
}

module.exports = createClearFormatPluginPlugin;
