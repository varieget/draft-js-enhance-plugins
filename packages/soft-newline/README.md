# DraftJS Soft Newline Plugin

_This is a plugin for the `@draft-js-plugins/editor`._

## Feature

Press <kbd>tab</kbd>+<kbd>enter</kbd> to insert soft newline. No new `unstyled` block will be created.

Refer to [`insertSoftNewline`](https://draftjs.org/docs/api-reference-rich-utils#insertsoftnewline).

## Usage

```tsx
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createSoftNewlinePlugin from '@draft-js-enhance-plugins/soft-newline';

const softNewlinePlugin = createSoftNewlinePlugin();

const plugins = [softNewlinePlugin];

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
