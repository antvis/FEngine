import { JSX } from '../jsx/jsx-namespace';
import { DisplayObject } from '@antv/g-lite';
import Component from '../component';
import { IContext } from '../types';
import { Updater } from '../component/updater';
import Animator from './render/animator';
import { WorkTag } from './workTags';

export interface VNodeLayout {
  width: number;
  height: number;
  left: number;
  top: number;
  right?: number;
  bottom?: number;
}

// virtual dom 的节点
export interface VNode extends JSX.Element {
  // 节点类型
  tag: WorkTag;

  // Instance
  component?: Component;
  shape: DisplayObject;
  context: IContext;
  updater: Updater<any>;

  parent: VNode;
  // VNode
  children: VNode | VNode[] | null;

  // Layout
  layout: VNodeLayout;

  // Style
  style: any; // 当前应用的样式

  // 是否执行动画
  animate: boolean;
  // animation
  animator: Animator;

  transform?: VNode;
}
