import { jsx } from '@antv/f-engine';
import {
  Graph,
  ForceLayout,
  registerLayout,
  LayoutConfig,
  GraphData,
  GraphOptions,
} from '@antv/f6';

export interface ForceGraphProps {
  data: GraphData;
  layout?: LayoutConfig;
  defaultNode?: Pick<'defaultNode', GraphOptions>;
  defaultEdge?: Pick<'defaultEdge', GraphOptions>;
  modes?: Pick<'modes', GraphOptions>;
  defaultCombo?: Pick<'defaultCombo', GraphOptions>;
  nodeStateStyles?: Pick<'nodeStateStyles', GraphOptions>;
  edgeStateStyles?: Pick<'edgeStateStyles', GraphOptions>;
  comboStateStyles?: Pick<'comboStateStyles', GraphOptions>;
  linkCenter?: Pick<'linkCenter', GraphOptions>;
  fitView?: boolean;
  fitCenter?: boolean;
  onGraphReady?: Function;
}

export default (props: ForceGraphProps) => {
  const {
    data,
    defaultNode,
    layout,
    defaultEdge,
    modes,
    defaultCombo,
    nodeStateStyles,
    edgeStateStyles,
    comboStateStyles,
    linkCenter,
    onGraphReady,
    fitView,
    fitCenter,
  } = props;

  registerLayout('force', ForceLayout);

  return (
    <Graph
      data={data}
      defaultNode={defaultNode}
      layout={{ ...layout, type: 'force' }}
      defaultEdge={defaultEdge}
      modes={modes}
      defaultCombo={defaultCombo}
      nodeStateStyles={nodeStateStyles}
      edgeStateStyles={edgeStateStyles}
      comboStateStyles={comboStateStyles}
      linkCenter={linkCenter}
      onGraphReady={onGraphReady}
      fitView={fitView}
      fitCenter={fitCenter}
    ></Graph>
  );
};
