import { CharacterMetadata, ContentState, Modifier, SelectionState, EditorState } from 'draft-js';
import { OrderedSet } from 'immutable';

function createInlineCodePlugin() {
  return {
    onChange: function (editorState) {
      var contentState = editorState.getCurrentContent();
      var selectionState = editorState.getSelection();

      if (!selectionState.isCollapsed()) {
        return editorState;
      }

      var focusKey = selectionState.getFocusKey();
      var focusOffset = selectionState.getFocusOffset();
      var blocks = contentState.getBlocksAsArray();
      var newBlocks = blocks.map(function (block) {
        var chars = block.getCharacterList();
        block.findStyleRanges(function (chars) {
          return chars.hasStyle('CODE');
        }, function (start, end) {
          // clear other inline styles in CODE
          var i = start;

          while (i < end) {
            chars = chars.set(i, CharacterMetadata.create({
              style: OrderedSet(['CODE'])
            }));
            i++;
          }
        });
        return block.set('characterList', chars);
      });
      contentState = ContentState.createFromBlockArray(newBlocks);
      blocks.forEach(function (block) {
        var insertIndex = [];
        block.findStyleRanges(function (chars) {
          return chars.hasStyle('CODE');
        }, function (start, end) {
          // selection always enclosed with spaces
          var text = block.getText().slice(Math.max(0, start - 1), end + 1);

          if (!text.startsWith(' ')) {
            insertIndex.push(start);
          }

          if (!text.endsWith(' ')) {
            insertIndex.push(end);
          }
        });

        for (var i = 0; i < insertIndex.length; i++) {
          contentState = Modifier.insertText(contentState, SelectionState.createEmpty(block.getKey()).merge({
            anchorOffset: insertIndex[i] + i,
            focusOffset: insertIndex[i] + i
          }), ' ');
        }

        var newSelectionState = contentState.getSelectionAfter(); // force to new selection when CODE was inserted

        if (focusKey === newSelectionState.getFocusKey() && focusOffset === insertIndex[1] && focusOffset === newSelectionState.getFocusOffset() - 2) {
          editorState = EditorState.forceSelection(editorState, newSelectionState);
        }
      });
      return EditorState.set(editorState, {
        currentContent: contentState
      });
    },
    customStyleMap: {
      CODE: {
        margin: '0 2px',
        padding: '3px 4px',
        borderRadius: 3,
        fontFamily: "Menlo, Monaco, Consolas, 'Andale Mono', 'lucida console', 'Courier New', monospace",
        backgroundColor: '#f6f6f6'
      }
    }
  };
}

export { createInlineCodePlugin as default };
