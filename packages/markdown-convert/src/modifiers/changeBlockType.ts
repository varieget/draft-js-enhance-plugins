import { EditorState, SelectionState, Modifier } from 'draft-js';
import type { DraftBlockType } from 'draft-js';

function changeBlockType(editorState: EditorState, blockType: DraftBlockType) {
  let contentState = editorState.getCurrentContent();

  const selectionState = editorState.getSelection();
  const focusKey = selectionState.getFocusKey();
  const focusOffset = selectionState.getFocusOffset();

  // rremove markdown flags
  contentState = Modifier.removeRange(
    contentState,
    new SelectionState({
      anchorKey: focusKey,
      anchorOffset: 0,
      focusKey,
      focusOffset,
    }),
    'backward'
  );

  // set the block type
  contentState = Modifier.setBlockType(
    contentState,
    SelectionState.createEmpty(focusKey).merge({
      hasFocus: true,
    }),
    blockType
  );

  return EditorState.push(editorState, contentState, 'change-block-type');
}

export default changeBlockType;
