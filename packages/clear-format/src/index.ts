import { EditorState, ContentState, CharacterMetadata } from 'draft-js';
import type { BlockMap } from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';
import { Map } from 'immutable';

function createClearFormatPluginPlugin(): EditorPlugin {
  return {
    handleKeyCommand: function (
      command,
      editorState,
      eventTimeStamp,
      { setEditorState }
    ) {
      if (command === 'clear-format') {
        const selectionState = editorState.getSelection();

        if (!selectionState.isCollapsed()) {
          const contentState = editorState.getCurrentContent();

          const blockMap = contentState.getBlockMap();
          const startKey = selectionState.getStartKey();
          const endKey = selectionState.getEndKey();

          const newBlocks = blockMap
            .toSeq()
            .skipUntil((_, k) => k === startKey)
            .takeUntil((_, k) => k === endKey)
            .concat(Map([[endKey, blockMap.get(endKey)]]))
            .map((block) => {
              if (!block) return block;

              if (block.getType() === 'atomic') {
                return block;
              }

              let chars = block.getCharacterList();

              let i = 0;
              while (i < block.getLength()) {
                chars = chars.set(i, CharacterMetadata.create());
                i++;
              }

              return block.merge({
                type: 'unstyled',
                characterList: chars,
              });
            }) as BlockMap;

          setEditorState(
            EditorState.forceSelection(
              EditorState.push(
                editorState,
                contentState.merge({
                  blockMap: blockMap.merge(newBlocks),
                  selectionBefore: selectionState,
                  selectionAfter: selectionState,
                }) as ContentState,
                'change-block-type'
              ),
              selectionState
            )
          );
        }

        return 'handled';
      }

      return 'not-handled';
    },
  };
}

export default createClearFormatPluginPlugin;
