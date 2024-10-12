declare module 'react-html-parser' {
    import { ReactElement } from 'react';
  
    interface Options {
      transform?: (node: any, index: number) => ReactElement | null;
    }
  
    export default function reactHtmlParser(
      html: string,
      options?: Options
    ): ReactElement[];
  }
  