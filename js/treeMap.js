function treeMap(data, key, options = {}) {
  const { height = 500, width = 500 } = options;
  const colorScale = d3
    .scaleBand()
    .domain(
      Array.from({ length: data.children.length }).map(
        (d, i) => data.children.length - i - 1
      )
    )
    .range([0.5, 1]);

  const treemap = data =>
    d3.treemap().size([width, height]).padding(0.5).round(true)(
      d3
        .hierarchy(data)
        .sum(d => d[key])
        .sort((a, b) => b[key] - a[key])
    );

  const root = treemap(data);

  const svg = d3
    .create('svg')
    .attr('height', height)
    .attr('width', width)
    .style('font-size', '8px');

  const reactG = svg
    .selectAll('g')
    .data(root.leaves())
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`);

  reactG.append('title').text(d => `${d.data.WasteType}: ${d.data[key]}`);

  reactG
    .append('rect')
    .attr('fill', (d, i) => `rgba(47,72,124 ,${colorScale(i)})`)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0);

  reactG
    .append('text')
    .attr('x', 3)
    .attr('y', 10)
    .style('fill', '#fff')
    .text(d => d.data.WasteType);

  return svg.node();
}
