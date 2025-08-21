import { JSX } from '../../jsx/jsx-namespace';
import Component from '../../component';
import { renderJSXElement, computeCSSLayout, fillElementLayout } from './computeLayout';
import { createShape } from './createShape';
import { VNode } from '../vnode';
import { Group } from '@antv/g-lite';
import Children from '../../children';

function computeComponent(component: Component | VNode, newChildren?: JSX.Element) {
  const { context, updater } = component;
  const { canvas } = context;
  const nodeTree = renderJSXElement(newChildren, context, updater);

  if (nodeTree.style?.display === 'flex') {
    computeCSSLayout(nodeTree);
    fillElementLayout(nodeTree);
  }

  const rootShape = new Group();
  traverseNodeTreeAndCreateShapes(nodeTree, rootShape, context);

  canvas.getRoot().appendChild(rootShape);

  const bbox = rootShape.getBBox();
  rootShape.remove();
  return bbox;
}

function traverseNodeTreeAndCreateShapes(node, parentShape, context) {
  if (!node) return;

  const { type, children, style: originStyle, vNode } = node;
  const { style: customStyle = {}, attrs } = vNode;

  const style = context.px2hd({
    ...originStyle,
    ...customStyle,
    ...attrs,
  });

  const shape = createShape(type, { style: { ...style, visibility: 'visible' } });

  if (parentShape) {
    parentShape.appendChild(shape);
  }

  Children.map(children, (child) => traverseNodeTreeAndCreateShapes(child, shape, context));

  return shape;
}

export { computeComponent };
