declare module 'draft-js-prism' {
  export default class PrismDecorator {
    highlighted: any;
    constructor(options?: IPrismOptions);
    /**
     * Return list of decoration IDs per character
     *
     * @param {ContentBlock}
     * @return {List<String>}
     */
    getDecorations(block: any): Immutable.List<string>;
    /**
     * Return component to render a decoration
     *
     * @param {String}
     * @return {Function}
     */
    getComponentForKey(key: any): (props: any) => JSX.Element;
    /**
     * Return props to render a decoration
     *
     * @param {String}
     * @return {Object}
     */
    getPropsForKey(key: any): {
      type: any;
    };
  }

  export interface IPrismOptions {
    defaultSyntax?: string;
    filter?: (block: Draft.ContentBlock) => boolean;
    getSyntax?: (block: Draft.ContentBlock) => string | null;
    render?: (props: any) => JSX.Element;
    prism?: object;
  }
}
