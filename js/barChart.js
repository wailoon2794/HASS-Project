function barChart(data, key, options = {}) {
  const { width = 500, height = 300, color } = options;
  const margin = { top: 30, right: 0, bottom: 30, left: 40 };

  const yAxis = g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('stroke-opacity', 0.08)
          .attr('x1', width - margin.right - margin.left)
      )
      .call(g =>
        g
          .append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('text-anchor', 'start')
          .text(data.y) 
      )
      .call(g => g.selectAll('.tick').select('line').remove());

  const xAxis = g =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(
        d3
          .axisBottom(x)
          .tickFormat(i => data[i].Year)
          .tickSizeOuter(0)
      )

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d[key])])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.7);

  const svg = d3.create('svg').attr('width', width).attr('height', height);

  const rectG = svg
    .append('g')
    .selectAll('g')
    .data(data)
    .join('g')

    rectG.append('title').text(d => `${d.Year}: ${d[key]}`);
    
    rectG.append('rect')
    .attr('fill', (d, i) => (color && color[i]) || '#375592')
    .attr('fill-opacity', 1)
    .attr('stroke', (d, i) => (color && color[i]) || '#375592')
    .attr('x', (d, i) => x(i))
    .attr('y', d => y(d[key]))
    .attr('height', d => y(0) - y(d[key]))
    .attr('width', x.bandwidth());

  svg.append('g').call(xAxis);

  svg.append('g').call(yAxis);

  return svg.node();
}
