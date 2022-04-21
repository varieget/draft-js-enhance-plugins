import 'prismjs/themes/prism.css';

import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

import {
  EditorState,
  ContentState,
  KeyBindingUtil,
  getDefaultKeyBinding,
  convertFromHTML,
} from 'draft-js';
import DraftEditor from './DraftEditor';

import createBlockquotePlugin from '@draft-js-enhance-plugins/blockquote';
import createClearFormatPlugin from '@draft-js-enhance-plugins/clear-format';
import createCodePlugin from '@draft-js-enhance-plugins/code';
import createInlineCodePlugin from '@draft-js-enhance-plugins/inline-code';
import createPasteHTMLPlugin from '@draft-js-enhance-plugins/paste-html';
import createSoftNewlinePlugin from '@draft-js-enhance-plugins/soft-newline';

const blockquotePlugin = createBlockquotePlugin();
const clearFormatPlugin = createClearFormatPlugin();
const codePlugin = createCodePlugin();
const inlineCodePlugin = createInlineCodePlugin();
const pasteHTMLPlugin = createPasteHTMLPlugin({
  convertFromHTML(html: string) {
    // Need advanced usage?
    // See: https://www.npmjs.com/package/draft-convert
    const blocksFromHTML = convertFromHTML(html);

    return ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
  },
});
const softNewlinePlugin = createSoftNewlinePlugin();

const plugins = [
  blockquotePlugin,
  clearFormatPlugin,
  codePlugin,
  inlineCodePlugin,
  pasteHTMLPlugin,
  softNewlinePlugin,
];

function Example() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const mapKeyToEditorCommand = (event: React.KeyboardEvent) => {
    if (event.key === '/' && KeyBindingUtil.hasCommandModifier(event)) {
      // cmd + '/'
      return 'clear-format';
    }

    return getDefaultKeyBinding(event);
  };

  return (
    <DraftEditor
      editorState={editorState}
      onChange={setEditorState}
      keyBindingFn={mapKeyToEditorCommand}
      plugins={plugins}
    />
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>
);
