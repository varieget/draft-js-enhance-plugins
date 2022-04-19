# DraftJS Blockquote Plugin

_This is a plugin for the `@draft-js-plugins/editor`._

## Feature

- Press enter to insert new line in the same block

## TODO

- [ ] Support depth value
- [ ] Press <kbd>tab</kbd> or <kbd>shift</kbd>+<kbd>tab</kbd> to adjust the depth

## Usage

```tsx
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createBlockquotePlugin from '@draft-js-enhance-plugins/blockquote';

const blockquotePlugin = createBlockquotePlugin();

const plugins = [blockquotePlugin];

function Example() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      plugins={plugins}
    />
  );
}
```
