import { EditorState } from 'draft-js';
import type { DraftBlockType } from 'draft-js';
import type { Map } from 'immutable';
declare function handleReturnBlock(editorState: EditorState, block: {
    blockType: DraftBlockType;
    blockData?: Map<any, any>;
}, entity: {
    entityType?: string;
    entityData?: object;
}): EditorState;
export default handleReturnBlock;
