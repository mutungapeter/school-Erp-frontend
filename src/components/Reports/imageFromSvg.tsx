import { createElement, ReactElement } from 'react';
import ReactDom from 'react-dom/server';
import reactHtmlParser from 'react-html-parser';

export const htmlSvgToPdfSvg = (children: ReactElement): ReactElement | null => {
  const svgString = ReactDom
    .renderToStaticMarkup(children)
    .replaceAll('px', 'pt');

  const [component] = reactHtmlParser(svgString, { transform: convertToPdfSvg });
  console.log("children is", children.type, "component -->", component);

  return component;
};

function convertToPdfSvg(node: any, index: number): ReactElement | null {
  if (node.name === 'title' || node.name === 'desc') {
    return null; 
  }
  
 
  node.props = { key: index };

  Object.entries(node.attribs).forEach(([key, value]) => {
    const [first, ...rest] = key.split('-');
    const newKey = [first, ...rest.map(word => `${word[0].toUpperCase()}${word.slice(1)}`)].join('');
    node.props[newKey] = newKey === 'strokeDasharray' && (value as string).indexOf('0pt') > -1 ? 0 : value;
  });

  node.name = node.name?.toUpperCase();
  if (node.name === 'CLIPPATH') node.name = 'CLIP_PATH';

  if (node.name === 'DEFS' && node.parent?.name !== 'SVG') return null;

  if (node.children) node.children = node.children.map((child: any, i: number) => convertToPdfSvg(child, i));
  return createElement(node.name, node.props, node.children);
}
