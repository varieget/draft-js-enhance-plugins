# DraftJS Markdown Convert Plugin

_This is a plugin for the `@draft-js-plugins/editor`._

## Feature

Markdown syntax shortcuts supported.

## TODO

- [ ] Support links syntax
- [ ] Support images syntax

## Usage

```tsx
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMarkdownConvertPlugin from '@draft-js-enhance-plugins/markdown-convert';

const markdownConvertPlugin = createMarkdownConvertPlugin();

const plugins = [markdownConvertPlugin];

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
