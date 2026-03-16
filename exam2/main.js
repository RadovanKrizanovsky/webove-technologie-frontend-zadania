generateSqares();

function generateSqares() {
    for (let index = 0; index < 10; index++) {
        var x = getRandomOnePosition();
        var y = getRandomOnePosition();
    
        var square = document.createElement('div');
        square.setAttribute('class', 'square');
        square.setAttribute('id', ('square' + (index+1).toString()));
        square.style.top = (x.toString() + "%");
        square.style.left = (y.toString() + "%");
        var hTag = document.createElement('h3');
        hTag.innerText = index+1;
        hTag.style.fontSize = "10px";
        square.appendChild(hTag)
        document.getElementById("container").appendChild(square);
    }
}

  function getRandomOnePosition() {
    min = 10
    max = 90
    return Math.floor(Math.random() * (max - min) + min);
  }

  function changeColorOfSquare(numer, color) {
    document.getElementById(('square' + numer.toString())).style.backgroundColor = color;
  }

  document.getElementById("generate").addEventListener("click", (e) => {
    document.getElementById("container").innerHTML = '';
    generateSqares();
  });

  document.getElementById("changeColor").addEventListener("click", (e) => {
    changeColorOfSquare(document.getElementById("number").value, document.getElementById("color").value);
  });
  