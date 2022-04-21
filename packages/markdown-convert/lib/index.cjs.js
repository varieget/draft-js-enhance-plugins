'use strict';

var draftJs = require('draft-js');
var immutable = require('immutable');

function changeInlineStyle(editorState, text, inlineStyle, markFlag) {
  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();
  var focusOffset = selectionState.getFocusOffset();
  var endIndex = text.length;
  var startIndex = text.slice(0, endIndex - markFlag.length).lastIndexOf(markFlag); // remove markdown flag

  contentState = draftJs.Modifier.replaceText(contentState, contentState.getSelectionAfter().merge({
    anchorOffset: startIndex
  }), text.slice(startIndex + markFlag.length, endIndex - markFlag.length), editorState.getCurrentInlineStyle());

  for (var _i = 0, inlineStyle_1 = inlineStyle; _i < inlineStyle_1.length; _i++) {
    var style = inlineStyle_1[_i];
    contentState = draftJs.Modifier.applyInlineStyle(contentState, contentState.getSelectionAfter().merge({
      anchorOffset: startIndex
    }), style);
  }

  var newEditorState = draftJs.EditorState.push(editorState, // force the focus offset to the end
  contentState.set('selectionAfter', contentState.getSelectionAfter().merge({
    anchorOffset: focusOffset - markFlag.length * 2,
    focusOffset: focusOffset - markFlag.length * 2
  })), 'change-inline-style');

  for (var _a = 0, inlineStyle_2 = inlineStyle; _a < inlineStyle_2.length; _a++) {
    var style = inlineStyle_2[_a]; // remove the style with the selection at the end

    newEditorState = draftJs.EditorState.setInlineStyleOverride(newEditorState, newEditorState.getCurrentInlineStyle().delete(style));
  }

  return newEditorState;
}

function changeBlockType(editorState, blockType) {
  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();
  var focusKey = selectionState.getFocusKey();
  var focusOffset = selectionState.getFocusOffset(); // rremove markdown flags

  contentState = draftJs.Modifier.removeRange(contentState, new draftJs.SelectionState({
    anchorKey: focusKey,
    anchorOffset: 0,
    focusKey: focusKey,
    focusOffset: focusOffset
  }), 'backward'); // set the block type

  contentState = draftJs.Modifier.setBlockType(contentState, draftJs.SelectionState.createEmpty(focusKey).merge({
    hasFocus: true
  }), blockType);
  return draftJs.EditorState.push(editorState, contentState, 'change-block-type');
}

function handleReturnBlock(editorState, block, entity) {
  var blockType = block.blockType,
      blockData = block.blockData;
  var entityType = entity.entityType,
      entityData = entity.entityData;
  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();
  var focusKey = selectionState.getFocusKey();
  var focusOffset = selectionState.getFocusOffset(); // remove markdown flag

  contentState = draftJs.Modifier.removeRange(contentState, new draftJs.SelectionState({
    anchorKey: focusKey,
    anchorOffset: 0,
    focusKey: focusKey,
    focusOffset: focusOffset
  }), 'backward');
  var newEditorState = draftJs.EditorState.push(editorState, contentState, 'remove-range');

  if (blockType === 'code-block') {
    contentState = draftJs.Modifier.setBlockType(contentState, draftJs.SelectionState.createEmpty(focusKey).merge({
      hasFocus: true
    }), blockType); // code language

    if (blockData) {
      contentState = draftJs.Modifier.mergeBlockData(contentState, draftJs.SelectionState.createEmpty(focusKey).merge({
        hasFocus: true
      }), blockData);
    }

    newEditorState = draftJs.EditorState.push(editorState, contentState, 'change-block-type');
  } else if (blockType === 'atomic') {
    if (entityType) {
      contentState = contentState.createEntity(entityType, 'IMMUTABLE', entityData);
      newEditorState = draftJs.AtomicBlockUtils.insertAtomicBlock(newEditorState, contentState.getLastCreatedEntityKey(), ' ');
    }
  }

  return newEditorState;
}

function createConvertPlugin() {
  return {
    handleBeforeInput: function (chars, editorState, eventTimeStamp, _a) {
      var setEditorState = _a.setEditorState;

      if (editorState.getSelection().isCollapsed() && [' ', '*', '_', '~', '`'].includes(chars)) {
        var contentStateWithChars = draftJs.Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), chars, editorState.getCurrentInlineStyle());
        var newEditorState = draftJs.EditorState.forceSelection(draftJs.EditorState.push(editorState, contentStateWithChars, 'insert-characters'), contentStateWithChars.getSelectionAfter());
        var contentState = newEditorState.getCurrentContent();
        var selectionState = newEditorState.getSelection();
        var focusKey = selectionState.getFocusKey();
        var focusOffset = selectionState.getFocusOffset();
        var block = contentState.getBlockForKey(focusKey);
        var text = block.getText().slice(0, focusOffset);
        var editorChangeType = void 0;
        var inlineStyle_1 = [];
        var markFlag = '';
        var blockType = '';

        if (/\*\*([^**]+)\*\*$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle_1 = ['BOLD'];
          markFlag = '**';
        } else if (/_([^_]+)_$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle_1 = ['ITALIC'];
          markFlag = '_';
        } else if (/~~([^~~]+)~~$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle_1 = ['STRIKETHROUGH'];
          markFlag = '~~';
        } else if (/`([^`]+)`$/.test(text)) {
          editorChangeType = 'change-inline-style';
          inlineStyle_1 = ['CODE'];
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
          if (block.getType() === 'atomic' || block.getType() === 'code-block') {
            return 'not-handled';
          }

          var endIndex = text.length;
          var startIndex = text.slice(0, endIndex - markFlag.length).lastIndexOf(markFlag);

          for (var offset = startIndex; offset <= endIndex; offset++) {
            if (block.getInlineStyleAt(offset).some(function (style) {
              return inlineStyle_1.includes(style);
            }) || block.getInlineStyleAt(offset).includes('CODE') || block.getEntityAt(offset) !== null) {
              return 'not-handled';
            }
          }

          newEditorState = changeInlineStyle(newEditorState, text, inlineStyle_1, markFlag);
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
    handleReturn: function (event, editorState, _a) {
      var _b, _c;

      var setEditorState = _a.setEditorState;
      var contentState = editorState.getCurrentContent();
      var selectionState = editorState.getSelection();

      if (!selectionState.isCollapsed()) {
        return 'not-handled';
      }

      var focusKey = selectionState.getFocusKey();
      var focusOffset = selectionState.getFocusOffset();
      var block = contentState.getBlockForKey(focusKey);
      var text = block.getText().slice(0, focusOffset);

      if (block.getType() !== 'unstyled') {
        return 'not-handled';
      }

      var blockType = '';
      var blockData;
      var entityType;
      var entityData;

      if (/^```\w*$/.test(text)) {
        blockType = 'code-block';
        var language = (_b = text.match(/^```(\w*)$/)) === null || _b === void 0 ? void 0 : _b[1];

        if (language) {
          blockData = immutable.Map({
            language: language
          });
        }
      } else if (/^[-|*|_]{3,}$/.test(text)) {
        blockType = 'atomic';
        entityType = 'DIVIDER';
      } else if (/^!\[([^\]]*)]\(([^)"]+)(?: "([^"]+)")?\)$/.test(text)) {
        blockType = 'atomic';
        entityType = 'IMAGE';
        var data = (_c = text.match(/^!\[(?<alt>[^\]]*)]\((?<src>[^)"]+)(?: "(?<title>[^"]+)")?\)$/)) === null || _c === void 0 ? void 0 : _c.groups;

        if (data) {
          entityData = data;
        }
      }

      if (blockType) {
        setEditorState(handleReturnBlock(editorState, {
          blockType: blockType,
          blockData: blockData
        }, {
          entityType: entityType,
          entityData: entityData
        }));
        return 'handled';
      }

      return 'not-handled';
    }
  };
}

module.exports = createConvertPlugin;
