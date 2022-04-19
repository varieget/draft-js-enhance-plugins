import {
  EditorState,
  ContentState,
  CharacterMetadata,
  SelectionState,
  Modifier,
} from 'draft-js';
import type { ContentBlock } from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';
import { OrderedSet } from 'immutable';

function createInlineCodePlugin(): EditorPlugin {
  return {
    onChange: function (editorState) {
      let contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();

      if (!selectionState.isCollapsed()) {
        return editorState;
      }

      const focusKey = selectionState.getFocusKey();
      const focusOffset = selectionState.getFocusOffset();

      const blocks = contentState.getBlocksAsArray();
      const newBlocks = blocks.map((block) => {
        let chars = block.getCharacterList();

        block.findStyleRanges(
          (chars) => chars.hasStyle('CODE'),
          (start, end) => {
            // clear other inline styles in CODE
            let i = start;
            while (i < end) {
              chars = chars.set(
                i,
                CharacterMetadata.create({
                  style: OrderedSet(['CODE']),
                })
              );

              i++;
            }
          }
        );

        return block.set('characterList', chars) as ContentBlock;
      });

      contentState = ContentState.createFromBlockArray(newBlocks);

      blocks.forEach((block) => {
        const insertIndex: number[] = [];

        block.findStyleRanges(
          (chars) => chars.hasStyle('CODE'),
          (start, end) => {
            // selection always enclosed with spaces
            const text = block.getText().slice(Math.max(0, start - 1), end + 1);

            if (!text.startsWith(' ')) {
              insertIndex.push(start);
            }

            if (!text.endsWith(' ')) {
              insertIndex.push(end);
            }
          }
        );

        for (let i = 0; i < insertIndex.length; i++) {
          contentState = Modifier.insertText(
            contentState,
            SelectionState.createEmpty(block.getKey()).merge({
              anchorOffset: insertIndex[i] + i,
              focusOffset: insertIndex[i] + i,
            }),
            ' '
          );
        }

        const newSelectionState = contentState.getSelectionAfter();

        // force to new selection when CODE was inserted
        if (
          focusKey === newSelectionState.getFocusKey() &&
          focusOffset === insertIndex[1] &&
          focusOffset === newSelectionState.getFocusOffset() - 2
        ) {
          editorState = EditorState.forceSelection(
            editorState,
            newSelectionState
          );
        }
      });

      return EditorState.set(editorState, {
        currentContent: contentState,
      });
    },
    customStyleMap: {
      CODE: {
        margin: '0 2px',
        padding: '3px 4px',
        borderRadius: 3,
        fontFamily:
          "Menlo, Monaco, Consolas, 'Andale Mono', 'lucida console', 'Courier New', monospace",
        backgroundColor: '#f6f6f6',
      },
    },
  };
}

export default createInlineCodePlugin;
