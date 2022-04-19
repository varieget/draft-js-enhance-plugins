# DraftJS Clear Format Plugin

_This is a plugin for the `@draft-js-plugins/editor`._

## Feature

Clear all inline styles, convert all block types to `unstyled` except AtomicBlock.

## Usage

```tsx
import { EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createClearFormatPlugin from '@draft-js-enhance-plugins/clear-format';

const clearFormatPlugin = createClearFormatPlugin();

const plugins = [clearFormatPlugin];

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
    <Editor
      editorState={editorState}
      onChange={setEditorState}
      keyBindingFn={mapKeyToEditorCommand}
      plugins={plugins}
    />
  );
}
```
