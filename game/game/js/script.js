let currrentLevel = 0
let difficulty = 0

interact('.draggable').draggable({
    listeners: {
        start (event) {

        },
        move (event) {
            let element = event.target

            //aktualna pozicia
            let x = element.getAttribute("data-x")
            let y = element.getAttribute("data-y")
            x = parseFloat(x)
            y = parseFloat(y)

            //posunutie objektu

            let divWidth = document.getElementById("game").offsetWidth
            let divHeight =document.getElementById("game").offsetHeight
            let itemWidth = document.getElementById("item").offsetWidth
            let itemHeight = document.getElementById("item").offsetHeight
            //console.log(itemHeight)
            if((x+event.dx) > 0 && (x+event.dx) < divWidth - itemWidth){
                x += event.dx
            }

            if((y+event.dy) > 0 && (y+event.dy) < divHeight - itemWidth){
                y += event.dy
            }



            //funkcia na posunutie
            event.target.style.transform =
                `translate(${x}px, ${y}px)`
            //zapísanie novej pozicie do atribútu
            element.setAttribute("data-x", x.toString())
            element.setAttribute("data-y", y.toString())


        },
        end (event) {

            //koniec posunutia, zistenie či sa objekt nachádza v bowl

            let element = event.target

            //let width = 50 //temporary

            let width = element.offsetWidth
            //console.log(width)

            let x = element.getAttribute("data-x")
            let y = element.getAttribute("data-y")
            x = parseFloat(x)
            y = parseFloat(y)

            //stred objektu
            x += (width/2)
            y += (width/2)



            testObjectInBowl(x, y, element)

            updateCounter()
            updateScore()
        }
    },
})

document.addEventListener("DOMContentLoaded", function (){
    //startGame()
    //bowlPlace("init")
    //itemsPlace("init")
    //bowlPlace("init")
    //itemsPlace("init")
})

window.onresize = function (event ){
    //console.log(event)
    itemsPlace("resize")
    bowlPlace("resize")
    itemsPlace("init")
}

function startGame(data) {
    console.log(data)
    timer(10)


    let bowls = data.bowls
    addBowlToDiv(bowls)

    let items = data.items
    addItemsToDiv(items)

    bowlPlace("init")

    bowlPlace("resize")
    itemsPlace("init")



}

function addBowlToDiv(bowls){
    let tmp
    let img
    let div
    let text
    let i = 0
    bowls.forEach(function (bowl) {
        div = document.getElementById("bowlDiv")
        tmp = document.createElement("div")
        tmp.className = "bowlWText"
        img = document.createElement("img")
        img.className = "bowl"
        if(i === 0)img.id = "bowl"
        img.setAttribute("data-x", "0")
        img.setAttribute("data-y", "0")
        img.setAttribute("data-content", bowl.content)
        text = document.createElement("p")
        text.innerHTML = bowl.content
        text.className = "centertext"
        i++
        tmp.append(img)
        tmp.append(text)
        div.append(tmp)
    })
}

function addItemsToDiv(items){
    let img
    let div
    let i = 0
    let width = document.getElementById("game").offsetWidth

    let height = document.getElementById("game").offsetHeight
    items.forEach(function(item) {
        console.log(item.position.x)
        div = document.getElementById("itemDiv")
        img = document.createElement("img")
        img.className = "draggable " + item.type
        if(i === 0)img.id = "item"
        while(item.position.x > width)item.position.x -= width
        while(item.position.y > height)item.position.y -= height
        img.setAttribute("data-x", item.position.x)
        img.setAttribute("data-y", item.position.y)
        img.setAttribute("data-inBowl", "false")
        img.style.left = "0"
        img.style.top = "0"
        div.append(img)
        i++
    })
}

function removeAllItemsFromDiv(){
    let div = document.getElementById("itemDiv")
    while(div.firstChild){
        div.removeChild(div.lastChild)
    }
}

function startModal(data) {
    let modal = document.getElementById("modal")
    let button = document.createElement("button")
    button.textContent = "START"
    button.onclick = function () {
        startGame(data)
        button.remove()
    }

    let chose = document.createElement("select")
    let optone = document.createElement("option")
    let opttwo = document.createElement("option")
    optone.value = "Easy"
    optone.innerHTML = "Easy"
    opttwo.value = "Hard"
    opttwo.innerHTML = "Hard"
    chose.append(optone)
    chose.append(opttwo)
    modal.append(chose)

    let img = document.createElement("img")
    img.className = "startButton"
    img.style.width = "150px"
    img.onclick = function () {
        startGame(data)
        img.remove()
        if(chose.value === "Easy")difficulty = 0
        if(chose.value === "Hard")difficulty = 1

        chose.remove()
    }
    //let time = data.gameSet[difficulty].levels[currrentLevel]
    //console.log("time:",time[0])


    modal.append(img)

    //modal.append(button)
}

function itemsPlace(variable){
    let divWidth = document.getElementById("game").offsetWidth
    divWidth -= document.getElementById("item").offsetWidth
    let divHeight = document.getElementById("game").offsetHeight
    let tmp = document.querySelectorAll(".draggable")

    tmp.forEach(function (element){
        //console.log(element)
        let x = element.getAttribute("data-x")
        let y = element.getAttribute("data-y")

        //posunutie hráškov a fazuľôk pod myštičku
        let yInt = parseFloat(y)
        let xInt = parseInt(x)

        let bowlWidth = document.getElementById("bowl").offsetWidth
        switch (variable) {
            case "init":
                //let bowlWidth = document.getElementById("bowl").offsetWidth
                //console.log(bowlWidth)
                yInt += parseFloat(bowlWidth)
                break
            case "resize":
                yInt -= parseFloat(bowlWidth)
                //yInt += (bowlWidthChange*10)
        }


        if(xInt > divWidth) {
            xInt = divWidth
        }

        if(yInt > divHeight) {
            yInt = divHeight
        }


        element.setAttribute("data-y", yInt.toString())
        element.setAttribute("data-x", xInt.toString())

        element.style.width = (divWidth/15)+"px"


        element.style.transform =
            `translate(${xInt}px, ${yInt}px)`
    })
}

function bowlPlace(variable){

    let divWidth = document.getElementById("game").offsetWidth
    divWidth -= document.getElementById("bowl").offsetWidth
    let tmp = document.querySelectorAll(".bowlWText")
    let counter = 1
    let num = 1
    tmp.forEach(function(element){
        counter++
    })

    tmp = document.querySelectorAll(".bowlWText")
    tmp.forEach(function(element){

        let x = (divWidth/counter)*num
        if(variable === "init") {
            x -= divWidth/8
        }
        element.firstElementChild.style.width = (divWidth/5)+"px"
        element.firstElementChild.style.height = (divWidth/5)+"px"

        //element.style.width = (divWidth/4)+"px"
        element.style.transform =
            `translate(${x}px, ${5}px)`

        element.firstElementChild.setAttribute("data-x", x.toString())
        element.children[1].style.transform =
            `translate(${0}px, ${divWidth/5}px)`
        num++
    })
}

function updateCounter() {
    let count = 0
    let tmp = document.querySelectorAll(".draggable")
    tmp.forEach(function (item){
        console.log(item.getAttribute("data-inBowl"))
        if(item.getAttribute("data-inBowl") === "true"){
            count++;
        }
    })
    //console.log(count)
    document.getElementById("counter").innerText = count.toString()
}

let score = 0;

function updateScore() {
    let count = parseInt(document.getElementById("counter").innerText)
    score = parseInt(document.getElementById("score").innerText)
    score += count
    document.getElementById("score").innerText = score.toString() + "/100"
}

//x, y is object moved, element is item(bean, peas, ...)
function testObjectInBowl(x, y, item) {
    //let width = 400//temporary
    //console.log("Object: ", x, y)
    let type = item.getAttribute("class")
    type = type.slice(10)

    let bowl = document.querySelectorAll(".bowl")
    bowl.forEach(function (element){
        //pozicia bowl

        let width = element.offsetWidth
        let cx = element.getAttribute("data-x")
        let cy = element.getAttribute("data-y")
        cx = parseInt(cx)
        cy = parseInt(cy)

        //stred bowl
        cx += (width/2)
        cy += (width/2)
        console.log(cx, cy)
        console.log(x, y)

        cy += 40

        let inBowl = pointInCircle(x, y, cx, cy, (width/2))
        console.log("IN: ", inBowl)
        let bowlContent = element.getAttribute("data-content")

        if(inBowl && type === bowlContent) {
            item.setAttribute("data-inBowl", "true")

        }else if(type === bowlContent) {
            item.setAttribute("data-inBowl", "false")
        }

    })
    console.log("TEST")
}

// x,y is the point to test
// cx, cy is circle center, and radius is circle radius
function pointInCircle(x, y, cx, cy, radius) {

    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;



}

//Get data from JSON file
fetch('./gameData/game.json')
    .then(result => result.json())
    .then((response) => {
        data = response;
        console.log(response.bowls[0].photoDescription);
        //data = response;
        /*
        for(let i = 0; i < response.photos.length; i++){
            let galleryContent = document.createElement()
            document.getElementById("gallery")
        }

         */
        //fetchSuccessful();
        startModal(data)
    });




self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open("static-scheme")
            .then(function(cache){
                return cache.addAll([
                    "/hra/popoluskaCache/",
                    "/hra/popoluskaCache/index.html",
                    "/hra/popoluskaCache/authors.html",
                    "/hra/popoluskaCache/sources.html",
                    "/hra/popoluskaCache/tutorial.html",
                    "/hra/popoluskaCache/logo.jpg",
                    "/hra/popoluskaCache/js/script.js",
                    "/hra/popoluskaCache/css/style.css",
                    "/hra/popoluskaCache/gameData/game.json",
                    "/hra/popoluskaCache/src/background.jpg",
                    "/hra/popoluskaCache/src/bean.png",
                    "/hra/popoluskaCache/src/bowl.png",
                    "/hra/popoluskaCache/src/bowlNew.png",
                    "/hra/popoluskaCache/src/buttonPlay.png",
                    "/hra/popoluskaCache/src/chickpea.png",
                    "/hra/popoluskaCache/src/lentil.png",
                    "/hra/popoluskaCache/src/pea.png",
                    "/hra/popoluskaCache/src/pea.png",
                    "/hra/popoluskaCache/src/peas.png",
                    "/hra/popoluskaCache/src/redBean.png",
                    "/hra/popoluskaCache/src/vecteezy_snowflakes-background_dy1120.jpg"
                ])
            })
    )
})

const cacheName = "popoluskaCache"
const appShellFiles = [
    "/hra/popoluskaCache/",
    "/hra/popoluskaCache/index.html",
    "/hra/popoluskaCache/authors.html",
    "/hra/popoluskaCache/sources.html",
    "/hra/popoluskaCache/tutorial.html",
    "/hra/popoluskaCache/logo.jpg",
    "/hra/popoluskaCache/js/script.js",
    "/hra/popoluskaCache/css/style.css",
    "/hra/popoluskaCache/gameData/game.json",
    "/hra/popoluskaCache/src/background.jpg",
    "/hra/popoluskaCache/src/bean.png",
    "/hra/popoluskaCache/src/bowl.png",
    "/hra/popoluskaCache/src/bowlNew.png",
    "/hra/popoluskaCache/src/buttonPlay.png",
    "/hra/popoluskaCache/src/chickpea.png",
    "/hra/popoluskaCache/src/lentil.png",
    "/hra/popoluskaCache/src/pea.png",
    "/hra/popoluskaCache/src/pea.png",
    "/hra/popoluskaCache/src/peas.png",
    "/hra/popoluskaCache/src/redBean.png",
    "/hra/popoluskaCache/src/vecteezy_snowflakes-background_dy1120.jpg",
]

self.addEventListener("fetch", (e) => {
    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            if (r) {
                return r;
            }
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;
        })()
    );
});

function newLevel(){
    removeAllItemsFromDiv()
    currrentLevel++



    let modal = document.getElementById("modal")

    let img = document.createElement("img")
    img.className = "startButton"
    img.style.width = "150px"
    img.onclick = function () {
        startNewLevel()
        img.remove()
        document.getElementById("levelScore").remove()
    }

    let text = document.createElement("p")
    text.innerText = "Vaše skóre: "+ score
    text.id = "levelScore"

    if(currrentLevel >= 5)
        img.remove()
    modal.append(text)
    modal.append(img)


    //modal.append(button)

}

function startNewLevel(){

    timer(10)
    let items = data.items
    addItemsToDiv(items)

    bowlPlace("init")

    bowlPlace("resize")
    itemsPlace("init")
}


//timer
function timer(sec){
    console.log("timer active");
    //let sec = 10;
    let milisec = 100;
    let timer = setInterval(function(){
        document.getElementById("timerDiv").innerText = "00:"+sec;
        sec--;
        if(sec < 0){
            clearInterval(timer);
        }

        /*
        let milisecTimer = setInterval(function (){
            document.getElementById("timerDiv").innerText = "00:"+sec+":"+milisec;
            milisec--;
            if(milisec <= 0){
                clearInterval(milisecTimer);
            }
        }, 1);

         */

        if(sec === 0){
            newLevel()
        }

    }, 1000);

}