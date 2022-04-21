import { EditorState, Modifier } from 'draft-js';
import type { DraftBlockType, EditorChangeType } from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';
import { Map } from 'immutable';

import changeInlineStyle from './modifiers/changeInlineStyle';
import changeBlockType from './modifiers/changeBlockType';
import handleReturnBlock from './modifiers/handleReturnBlock';

function createConvertPlugin(): EditorPlugin {
  return {
    handleBeforeInput: function (
      chars,
      editorState,
      eventTimeStamp,
      { setEditorState }
    ) {
      if (
        editorState.getSelection().isCollapsed() &&
        [' ', '*', '_', '~', '`'].includes(chars)
      ) {
        const contentStateWithChars = Modifier.insertText(
          editorState.getCurrentContent(),
          editorState.getSelection(),
          chars,
          editorState.getCurrentInlineStyle()
        );

        let newEditorState = EditorState.forceSelection(
          EditorState.push(
            editorState,
            contentStateWithChars,
            'insert-characters'
          ),
          contentStateWithChars.getSelectionAfter()
        );

        const contentState = newEditorState.getCurrentContent();
        const selectionState = newEditorState.getSelection();

        const focusKey = selectionState.getFocusKey();
        const focusOffset = selectionState.getFocusOffset();

        const block = contentState.getBlockForKey(focusKey);
        const text = block.getText().slice(0, focusOffset);

        let editorChangeType: Extract<
          EditorChangeType,
          'change-inline-style' | 'change-block-type'
        >;
        let inlineStyle: string[] = [];
        let markFlag = '';

        let blockType: DraftBlockType = '';

        if (/\*\*([^**]+)\*\*$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle = ['BOLD'];
          markFlag = '**';
        } else if (/_([^_]+)_$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle = ['ITALIC'];
          markFlag = '_';
        } else if (/~~([^~~]+)~~$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle = ['STRIKETHROUGH'];
          markFlag = '~~';
        } else if (/`([^`]+)`$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle = ['CODE'];
          markFlag = '`';
        } else if (/^# $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'header-one';
        } else if (/^## $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'header-two';
        } else if (/^### $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'header-three';
        } else if (/^#### $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'header-four';
        } else if (/^##### $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'header-five';
        } else if (/^###### $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'header-six';
        } else if (/^(\+|-|\*) $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'unordered-list-item';
        } else if (/^1\. $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'ordered-list-item';
        } else if (/^> $/.test(text)) {
          editorChangeType = 'change-block-type';
          blockType = 'blockquote';
        } else {
          return 'not-handled';
        }

        if (editorChangeType === 'change-inline-style') {
          if (
            block.getType() === 'atomic' ||
            block.getType() === 'code-block'
          ) {
            return 'not-handled';
          }

          const endIndex = text.length;
          const startIndex = text
            .slice(0, endIndex - markFlag.length)
            .lastIndexOf(markFlag);

          for (let offset = startIndex; offset <= endIndex; offset++) {
            if (
              block
                .getInlineStyleAt(offset)
                .some((style) => inlineStyle.includes(style as string)) ||
              block.getInlineStyleAt(offset).includes('CODE') ||
              block.getEntityAt(offset) !== null
            ) {
              return 'not-handled';
            }
          }

          newEditorState = changeInlineStyle(
            newEditorState,
            text,
            inlineStyle,
            markFlag
          );
        }

        if (editorChangeType === 'change-block-type') {
          if (block.getType() !== 'unstyled') {
            return 'not-handled';
          }

          newEditorState = changeBlockType(newEditorState, blockType);
        }

        setEditorState(newEditorState);

        return 'handled';
      }

      return 'not-handled';
    },
    handleReturn: function (event, editorState, { setEditorState }) {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();

      if (!selectionState.isCollapsed()) {
        return 'not-handled';
      }

      const focusKey = selectionState.getFocusKey();
      const focusOffset = selectionState.getFocusOffset();

      const block = contentState.getBlockForKey(focusKey);
      const text = block.getText().slice(0, focusOffset);

      if (block.getType() !== 'unstyled') {
        return 'not-handled';
      }

      let blockType = '';
      let blockData;
      let entityType;
      let entityData;

      if (/^```\w*$/.test(text)) {
        blockType = 'code-block';

        const language = text.match(/^```(\w*)$/)?.[1];
        if (language) {
          blockData = Map({
            language,
          });
        }
      } else if (/^[-|*|_]{3,}$/.test(text)) {
        blockType = 'atomic';
        entityType = 'DIVIDER';
      } else if (/^!\[([^\]]*)]\(([^)"]+)(?: "([^"]+)")?\)$/.test(text)) {
        blockType = 'atomic';
        entityType = 'IMAGE';

        const data = text.match(
          /^!\[(?<alt>[^\]]*)]\((?<src>[^)"]+)(?: "(?<title>[^"]+)")?\)$/
        )?.groups;
        if (data) {
          entityData = data;
        }
      }

      if (blockType) {
        setEditorState(
          handleReturnBlock(
            editorState,
            { blockType, blockData },
            { entityType, entityData }
          )
        );

        return 'handled';
      }

      return 'not-handled';
    },
  };
}

export default createConvertPlugin;
