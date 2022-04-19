# DraftJS Code Plugin

_This is a plugin for the `@draft-js-plugins/editor`._

## Feature

- Syntax highlighting with `prismjs`

- Press enter to insert new line in the same `code-block`

- Automatically remove all inline styles

## TODO

- [ ] Enable change the `language` key to the data of the code block

## Usage

```tsx
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import { Map } from 'immutable';
import createCodePlugin from '@draft-js-enhance-plugins/code';

const codePlugin = createCodePlugin();

const plugins = [codePlugin];

function Example() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  return (
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      blockRenderMap={DefaultDraftBlockRenderMap.merge(
        Map({
          'code-block': {
            element: 'pre',
            wrapper: <div />,
          },
        })
      )}
      plugins={plugins}
    />
  );
}
```
