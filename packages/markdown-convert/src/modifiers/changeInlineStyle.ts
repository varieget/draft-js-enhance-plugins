import { EditorState, Modifier } from 'draft-js';
import type { ContentState } from 'draft-js';

function changeInlineStyle(
  editorState: EditorState,
  text: string,
  inlineStyle: string[],
  markFlag: string
) {
  let contentState = editorState.getCurrentContent();

  const selectionState = editorState.getSelection();
  const focusOffset = selectionState.getFocusOffset();

  const endIndex = text.length;
  const startIndex = text
    .slice(0, endIndex - markFlag.length)
    .lastIndexOf(markFlag);

  // remove markdown flag
  contentState = Modifier.replaceText(
    contentState,
    contentState.getSelectionAfter().merge({
      anchorOffset: startIndex,
    }),
    text.slice(startIndex + markFlag.length, endIndex - markFlag.length),
    editorState.getCurrentInlineStyle()
  );

  for (const style of inlineStyle) {
    contentState = Modifier.applyInlineStyle(
      contentState,
      contentState.getSelectionAfter().merge({
        anchorOffset: startIndex,
      }),
      style
    );
  }

  let newEditorState = EditorState.push(
    editorState,
    // force the focus offset to the end
    contentState.set(
      'selectionAfter',
      contentState.getSelectionAfter().merge({
        anchorOffset: focusOffset - markFlag.length * 2,
        focusOffset: focusOffset - markFlag.length * 2,
      })
    ) as ContentState,
    'change-inline-style'
  );

  for (const style of inlineStyle) {
    // remove the style with the selection at the end
    newEditorState = EditorState.setInlineStyleOverride(
      newEditorState,
      newEditorState.getCurrentInlineStyle().delete(style)
    );
  }

  return newEditorState;
}

export default changeInlineStyle;
