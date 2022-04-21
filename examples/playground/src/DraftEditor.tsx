import 'draft-js/dist/Draft.css';
import './RichEditor.css';

import { Map } from 'immutable';
import { RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import type { PluginEditorProps } from '@draft-js-plugins/editor';

function DraftEditor(props: PluginEditorProps) {
  function toggleBlockType(blockType: string) {
    props.onChange(RichUtils.toggleBlockType(props.editorState, blockType));
  }

  function toggleInlineStyle(inlineStyle: string) {
    props.onChange(RichUtils.toggleInlineStyle(props.editorState, inlineStyle));
  }

  const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
  ];

  const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
  ];

  function getBlockStyle(block: Draft.ContentBlock) {
    switch (block.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote';
      case 'code-block':
        return 'RichEditor-codeBlock';
      default:
        return '';
    }
  }

  let className = 'RichEditor-editor';
  let contentState = props.editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  return (
    <div className="RichEditor-root">
      <div className="RichEditor-controls">
        {BLOCK_TYPES.map((type) => {
          const selection = props.editorState.getSelection();
          const blockType = props.editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();

          let className = 'RichEditor-styleButton';
          if (type.style === blockType) {
            className += ' RichEditor-activeButton';
          }

          return (
            <span
              key={type.label}
              className={className}
              onMouseDown={() => toggleBlockType(type.style)}>
              {type.label}
            </span>
          );
        })}
      </div>
      <div className="RichEditor-controls">
        {INLINE_STYLES.map((type) => {
          const currentStyle = props.editorState.getCurrentInlineStyle();

          let className = 'RichEditor-styleButton';
          if (currentStyle.has(type.style)) {
            className += ' RichEditor-activeButton';
          }

          return (
            <span
              key={type.label}
              className={className}
              onMouseDown={() => toggleInlineStyle(type.style)}>
              {type.label}
            </span>
          );
        })}
      </div>
      <div className={className}>
        <Editor
          blockStyleFn={getBlockStyle}
          blockRenderMap={DefaultDraftBlockRenderMap.merge(
            Map({
              unstyled: {
                element: 'div',
                aliasedElements: ['p', 'div'],
              },
              'code-block': {
                element: 'pre',
                wrapper: <div />,
              },
            })
          )}
          placeholder="Tell a story..."
          {...props}
        />
      </div>
    </div>
  );
}

export default DraftEditor;
