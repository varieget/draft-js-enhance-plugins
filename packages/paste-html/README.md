# DraftJS Paste HTML Plugin

_This is a plugin for the `@draft-js-plugins/editor`._

## Feature

Convert HTML to `ContentState` that has been pasted directly into the editor.

Refer to [`handlePastedText`](https://draftjs.org/docs/api-reference-editor/#handlepastedtext).

## Options

- **[`convertFromHTML`](#convertFromHTML)**

### `convertFromHTML`

Type:

```ts
type convertFromHTML = (html: string) => ContentState;
```

Given an HTML fragment, convert it to a `ContentState`.

## Usage

```tsx
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createPasteHTMLPlugin from '@draft-js-enhance-plugins/paste-html';

// See: https://www.npmjs.com/package/draft-convert
// import { convertFromHTML } from 'draft-convert';

const pasteHTMLPlugin = createPasteHTMLPlugin({ convertFromHTML });

const plugins = [pasteHTMLPlugin];

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
