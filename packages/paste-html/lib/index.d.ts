import type { ContentState } from 'draft-js';
import type { EditorPlugin } from '@draft-js-plugins/editor';
declare function createPasteHTMLPlugin({ convertFromHTML, }: {
    convertFromHTML: (html: string) => ContentState;
}): EditorPlugin;
export default createPasteHTMLPlugin;
