fetch("xml/z03.xml").then(response=>response.text()).then(data=>{
    let nameYear =  [];
    let yForTrace = [];
    let allTraces = [];
    let allYs = [];
    let parser = new DOMParser();
    let xmlData = parser.parseFromString(data, "application/xml");
    let zaznamy = xmlData.getElementsByTagName("zaznam");
    let xs = ['A', 'B', 'C', 'D', 'E', 'FX', 'FN'];
    for (let i = 0; i < zaznamy.length; i++) {
      nameYear.push(zaznamy[i].firstElementChild.textContent);
    }
    for (let i = 0; i < zaznamy.length; i++) {
        listTextContent = zaznamy[i].childNodes[3].textContent;
        let ys = [];
        let index = 4;
        for (let indexTwo = 0; indexTwo < 7; indexTwo++) {
          let number = ""
          while(listTextContent[index] != "\n" && listTextContent[index] != "\t" ) {
            number = number + listTextContent[index];
            index++; 
          }
          index = index + 4;
          ys.push(parseInt(number));
        }
        allYs.push(ys);
    }

    for (let index = 0; index < allYs[0].length; index++) {
      yForTrace = [];
      for (let indexTwo = 0; indexTwo < allYs.length; indexTwo++) {
        yForTrace.push(allYs[indexTwo][index])
      }
      
      var trace = {
        x: nameYear,
        y: yForTrace,
        name: xs[index],
        type: 'bar'
      };



      allTraces.push(trace);
    }
    var layout = {barmode: 'group'};
    Plotly.newPlot(document.getElementById('graph'), allTraces, layout);


    var pieLayout = {
      height: 400,
      width: 500,
      title: nameYear[0]
    };
    var pieData = [{
      values: allYs[0],
      labels: xs,
      type: 'pie'
    }];
    Plotly.newPlot(document.getElementById(("pieChartOne")), pieData, pieLayout);
    pieData[0].values = allYs[1];
    pieLayout.title.text = nameYear[1];
    Plotly.newPlot(document.getElementById(("pieChartTwo")), pieData, pieLayout);
    pieData[0].values = allYs[2];
    pieLayout.title.text = nameYear[2];
    Plotly.newPlot(document.getElementById(("pieChartThree")), pieData, pieLayout);
    pieData[0].values = allYs[3];
    pieLayout.title.text = nameYear[3];
    Plotly.newPlot(document.getElementById(("pieChartFour")), pieData, pieLayout);
    pieData[0].values = allYs[4];
    pieLayout.title.text = nameYear[4];
    Plotly.newPlot(document.getElementById(("pieChartFive")), pieData, pieLayout);
    pieData[0].values = allYs[5];
    pieLayout.title.text = nameYear[5];
    Plotly.newPlot(document.getElementById(("pieChartSix")), pieData, pieLayout);
   
    var diffLayout = {barmode: 'stack'};
    Plotly.newPlot('differentChart', allTraces, diffLayout);

});

