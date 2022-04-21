import { EditorState } from 'draft-js';
import type { DraftBlockType } from 'draft-js';
declare function changeBlockType(editorState: EditorState, blockType: DraftBlockType): EditorState;
export default changeBlockType;
