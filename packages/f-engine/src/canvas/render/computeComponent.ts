import { JSX } from '../../jsx/jsx-namespace';
import Component from '../../component';
import { renderJSXElement, computeCSSLayout } from './computeLayout';
import { createShape } from './createShape';
import { VNode } from '../vnode';
import { Group } from '@antv/g-lite';
import Children from '../../children';

function computeComponent(component: Component | VNode, newChildren?: JSX.Element) {
  const { context, updater } = component;
  const { canvas } = context;
  const nodeTree = renderJSXElement(newChildren, context, updater);

  computeCSSLayout(nodeTree);

  const rootShape = new Group();
  traverseNodeTreeAndCreateShapes(nodeTree, rootShape);

  canvas.getRoot().appendChild(rootShape);
  const bbox = rootShape.getBBox();
  rootShape.remove();
  return bbox;
}

function traverseNodeTreeAndCreateShapes(node, parentShape) {
  if (!node) return;

  const { type, style, children } = node;

  // Create the shape for this node
  const shape = createShape(type, { style });

  // Add to parent
  if (parentShape) {
    parentShape.appendChild(shape);
  }

  Children.map(children, (child) => traverseNodeTreeAndCreateShapes(child, shape));

  return shape;
}

export { computeComponent };
