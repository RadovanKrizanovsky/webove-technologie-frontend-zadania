

customElements.define("custom-input", CustomInput);
var run = true;

document.getElementById("stop").addEventListener("click", (e) => {
  run = false;
});

var dataOne = {
  x: [0],
  y: [0],
  type: 'scatter'
};

var dataTwo = {
  x: [0],
  y: [0],
  type: 'scatter'
};

var emptyTrace = {
  x: [],
  y: [],
  type: 'scatter'
};

var data = [dataOne, dataTwo];

Plotly.newPlot(document.getElementById('cosSin'), data);

var src = new EventSource("http://old.iolab.sk/evaluation/sse/sse.php");
src.onmessage = function(event) {
  if(run) {
    const jsonData = JSON.parse(event.data);
    console.log(jsonData.x);
    dataOne.x.push(jsonData.x);
    dataOne.y.push(jsonData.y1);
    dataTwo.x.push(jsonData.x);
    dataTwo.y.push(jsonData.y2);
    Plotly.redraw(document.getElementById('cosSin'));
  }
};
document.getElementById("traceZero").addEventListener('change', function() {
  if (this.checked) {
    data[1] = dataTwo;
  } else {
    data[1] = emptyTrace;
  }
  Plotly.redraw(document.getElementById('cosSin'));
});

document.getElementById("traceOne").addEventListener('change', function() {
  if (this.checked) {
    data[0] = dataOne;
  } else {
    data[0] = emptyTrace;
  }
  Plotly.redraw(document.getElementById('cosSin'));
});