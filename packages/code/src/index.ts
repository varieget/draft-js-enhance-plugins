import {
  EditorState,
  ContentState,
  ContentBlock,
  CharacterMetadata,
  RichUtils,
  Modifier,
  genKey,
} from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';

import Prism from 'prismjs';
import PrismDecorator from 'draft-js-prism';

function createCodePlugin(): EditorPlugin {
  return {
    decorators: [
      new PrismDecorator({
        prism: Prism,
        getSyntax: (block) => {
          const language = block.getData().get('language') as string;

          if (language && Prism.languages[language]) {
            return language;
          }

          return null;
        },
      }),
    ],
    onChange: function (editorState) {
      const contentState = editorState.getCurrentContent();
      const blocks = contentState.getBlocksAsArray();

      // clear inline styles in code-block
      const newBlocks = blocks.map((block) => {
        if (block.getType() !== 'code-block') return block;

        let chars = block.getCharacterList();

        let i = 0;
        while (i < block.getLength()) {
          chars = chars.set(i, CharacterMetadata.create());
          i++;
        }

        return block.set('characterList', chars) as ContentBlock;
      });

      // create a block at the end when code-block is the lastBlock
      if (contentState.getLastBlock().getType() === 'code-block') {
        const block = new ContentBlock({
          key: genKey(),
        });

        newBlocks.push(block);
      }

      const newContentState = ContentState.createFromBlockArray(newBlocks);

      return EditorState.set(editorState, {
        currentContent: newContentState,
      });
    },
    handleReturn: function (event, editorState, { setEditorState }) {
      // support press enter to insert new line
      const blockType = RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'code-block') {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      return 'not-handled';
    },
    handlePastedText: function (text, html, editorState, { setEditorState }) {
      // paste plain text to code-block
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();

      const blockType = RichUtils.getCurrentBlockType(editorState);

      if (blockType === 'code-block') {
        setEditorState(
          EditorState.push(
            editorState,
            Modifier.replaceText(contentState, selectionState, text),
            'insert-characters'
          )
        );

        return 'handled';
      }

      return 'not-handled';
    },
  };
}

export default createCodePlugin;
