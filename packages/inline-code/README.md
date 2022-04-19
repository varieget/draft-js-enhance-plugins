# DraftJS Inline Code Plugin

_This is a plugin for the `@draft-js-plugins/editor`._

## Feature

- Selection always enclosed with spaces

- Automatically remove inline styles except `CODE` style

## TODO

- [ ] Custom the `customStyleMap`

## Usage

```tsx
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createInlineCodePlugin from '@draft-js-enhance-plugins/inline-code';

const inlineCodePlugin = createInlineCodePlugin();

const plugins = [inlineCodePlugin];

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
