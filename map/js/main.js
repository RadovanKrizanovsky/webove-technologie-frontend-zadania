showImages("");
var allPaths = [];
var allNames = [];
var allDesc = [];
var allDates = [];
var currentImageIndex = 0;
var maxIndex = 0;
var run = false;

document.getElementById("photoSearch").addEventListener("input", (e) => {
    showImages(document.getElementById("photoSearch").value);
})

function showImages(searchTerm) {
    document.getElementById("galery").innerHTML = "";
        fetch('./galery.json').then((response) => response.json()).then((json) => {
            maxIndex = json.photos.length-1;
            for (let index = 0; index < json.photos.length; index++) {
                allPaths.push(json.photos[index].path)
                allNames.push(json.photos[index].photoName)
                allDesc.push(json.photos[index].pictureDescription)
                allDates.push(json.photos[index].date)
                if(json.photos[index].photoName.toLowerCase().includes(searchTerm.toLowerCase()) || json.photos[index].pictureDescription.toLowerCase().includes(searchTerm.toLowerCase())){
                    var img = document.createElement('img');
                    var div = document.createElement('div');
                    div.setAttribute('style', 'background-color:rgba(41, 43, 44, 0.3);margin:5px;padding:10px;border-radius: 10px;');
                    img.setAttribute('class', 'image');
                    img.setAttribute('src', json.photos[index].path);
                    img.setAttribute('alt', json.photos[index].photoName);
                    img.setAttribute('width', '100');
                    img.setAttribute('height', '100');
                    img.setAttribute('style', 'object-fit:contain;');
                    div.appendChild(img);
                    document.getElementById("galery").appendChild(div);
                    var modal = document.getElementById("myModal");
                    var span = document.getElementsByClassName("close")[0];
                    img.addEventListener("click", (e) => {
                        modal.style.display = "flex";
                        document.getElementById("selectedImg").setAttribute('src', json.photos[index].path);
                        currentImageIndex = index;
                        document.getElementById("textOne").innerText = json.photos[index].photoName;
                        document.getElementById("textTwo").innerText = json.photos[index].pictureDescription;
                        document.getElementById("textThree").innerText = json.photos[index].date;
                    });
                    span.onclick = function() {
                    modal.style.display = "none";
                    }

                }

            }
        });
}

function changeText(index) {
    document.getElementById("textOne").innerText = allNames[index];
    document.getElementById("textTwo").innerText = allDesc[index];
    document.getElementById("textThree").innerText = allDates[index];
}


document.getElementById("clickLeft").addEventListener("click", (e) => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        document.getElementById("selectedImg").setAttribute('src', allPaths[currentImageIndex]);
        changeText(currentImageIndex);
    }
})

document.getElementById("clickRight").addEventListener("click", (e) => {
    if (currentImageIndex < maxIndex) {
        currentImageIndex++;
        document.getElementById("selectedImg").setAttribute('src', allPaths[currentImageIndex])
        changeText(currentImageIndex);
    }
})

document.getElementById("slideShow").addEventListener("click", (e) => {
    changePicAfterWait();
})

function changePicAfterWait() {
    setTimeout(function() {
        if (currentImageIndex < maxIndex) {
            currentImageIndex++;
            document.getElementById("selectedImg").setAttribute('src', allPaths[currentImageIndex]);
            changeText(currentImageIndex);
        }
    }, 1500);    
}
