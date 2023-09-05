<script lang="jsx">
import { toRaw } from 'vue';
import Canvas from '@antv/f-vue';
import Rect from './rect';


export default {
  name: 'App',
  data() {
    return {
      index: 1,
      width: 100,
    }
  },
  mounted() {
    setTimeout(() => {
      this.index = 2;
      this.width = 200;
    }, 1000);
  },
  render() {
    const { index, width } = this;

    return (
      <div className="container">
        <Canvas pixelRatio={ window.devicePixelRatio }>
          <Rect index={index} width={width}/>
        </Canvas>
      </div>
    );
  },
};
</script>

<style>
.container {
  width: 500px;
  height: 300px;
}
</style>
