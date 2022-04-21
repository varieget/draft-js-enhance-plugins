import {
  EditorState,
  SelectionState,
  Modifier,
  AtomicBlockUtils,
} from 'draft-js';
import type { DraftBlockType } from 'draft-js';
import type { Map } from 'immutable';

function handleReturnBlock(
  editorState: EditorState,
  block: { blockType: DraftBlockType; blockData?: Map<any, any> },
  entity: { entityType?: string; entityData?: object }
) {
  const { blockType, blockData } = block;
  const { entityType, entityData } = entity;

  let contentState = editorState.getCurrentContent();

  const selectionState = editorState.getSelection();
  const focusKey = selectionState.getFocusKey();
  const focusOffset = selectionState.getFocusOffset();

  // remove markdown flag
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

  let newEditorState = EditorState.push(
    editorState,
    contentState,
    'remove-range'
  );

  if (blockType === 'code-block') {
    contentState = Modifier.setBlockType(
      contentState,
      SelectionState.createEmpty(focusKey).merge({
        hasFocus: true,
      }),
      blockType
    );

    // code language
    if (blockData) {
      contentState = Modifier.mergeBlockData(
        contentState,
        SelectionState.createEmpty(focusKey).merge({
          hasFocus: true,
        }),
        blockData
      );
    }

    newEditorState = EditorState.push(
      editorState,
      contentState,
      'change-block-type'
    );
  } else if (blockType === 'atomic') {
    if (entityType) {
      contentState = contentState.createEntity(
        entityType,
        'IMMUTABLE',
        entityData
      );

      newEditorState = AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        contentState.getLastCreatedEntityKey(),
        ' '
      );
    }
  }

  return newEditorState;
}

export default handleReturnBlock;
