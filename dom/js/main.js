var date = document.getElementById("date");
var age = document.getElementById("age");
var ageError = document.getElementById("ageError");
var dateError = document.getElementById("dateError");

var formName = document.getElementById("formName");
var nameCharactersNum = document.getElementById("nameCharactersNum");
var nameError = document.getElementById("nameError");

var formSurname = document.getElementById("formSurname");
var surnameCharactersNum = document.getElementById("surnameCharactersNum");
var surnameError = document.getElementById("surnameError");

var formEmail = document.getElementById("formEmail");
var emailCharactersNum = document.getElementById("emailCharactersNum");
var emailError = document.getElementById("emailError");

var emailValidationRegex = /^[^\s@]{3,}@[^\s@]+\.[^\s@]{2,4}$/;

var room = document.getElementById("room");
var type = document.getElementById("type");
var additional = document.getElementById("additional");
var reservationTime = document.getElementById("reservationTime");
var people = document.getElementById("people");
var peopleError = document.getElementById("peopleError")
var differetColor = document.getElementById("differetColor");
var formTel = document.getElementById("formTel");
var telError = document.getElementById("telError");
var myName = document.getElementById("myName");
var submitButton = document.getElementById("submitButton")
var isHidden = true;
var badEmail = false;
var badAge = false;
myName.setAttribute('type', "hidden");

initialization()
updatePrice("regular", "afternoon", 0);

submitButton.addEventListener("click", function (e) {

    if(!(badEmail || badAge)) {
            document.getElementById("modalDiv").style.display = "block";
        var modalDiv = document.getElementById("modalDiv");

        var closeButton = document.createElement("span");
        closeButton.id = "close";
        closeButton.append("x");
        modalDiv.appendChild(closeButton);

        closeButton.addEventListener("click", (e) => {
            document.getElementById("modalDiv").style.display = "none";
            document.getElementById("modalDiv").innerHTML = "";
        })
        
        var modalHeader = document.createElement("span");
        modalHeader.className = "modalHeader"
        modalHeader.append("Súhrn:");
        modalDiv.appendChild(modalHeader);

        var modalRoom = document.createElement("span");
        modalRoom.className = "modaltText"
        modalRoom.append(room.options[room.selectedIndex].text);
        modalDiv.appendChild(modalRoom);

        var modalType = document.createElement("span");
        modalType.className = "modaltText"
        modalType.append(type.options[type.selectedIndex].text);
        modalDiv.appendChild(modalType);

        var modalAdditional = document.createElement("span");
        modalAdditional.className = "modaltText"
        modalAdditional.append(additional.options[additional.selectedIndex].text);
        modalDiv.appendChild(modalAdditional);

        var modalTimeAndDateText = document.createElement("span");
        modalTimeAndDateText.className = "modalHeader";
        modalTimeAndDateText.append("Dátum a čas: ");
        modalDiv.appendChild(modalTimeAndDateText);

        var modalDate = document.createElement("span");
        modalDate.className = "modaltText";
        modalDate.append(document.getElementById("dateOfEvent").value);
        modalDiv.appendChild(modalDate);

        var modalTime = document.createElement("span");
        modalTime.className = "modaltText"
        modalTime.append(reservationTime.options[additional.selectedIndex].text);
        modalDiv.appendChild(modalTime);

        var modalPriceName = document.createElement("span");
        modalPriceName.className = "modalHeader"
        modalPriceName.append("Cena:");
        modalDiv.appendChild(modalPriceName);

        var modalPrice = document.createElement("span");
        modalPrice.className = "modaltText"
        modalPrice.append(document.getElementById("finalPrice").innerText.substring(6));
        modalDiv.appendChild(modalPrice);

        var modalSubmit = document.createElement("input");
        modalSubmit.type="submit";
        modalSubmit.value="Dokončiť objednávku";
        modalSubmit.className="modalSubmitButton"
        modalDiv.appendChild(modalSubmit);
    }  
})

formName.addEventListener('focusout', (event) => {
    nameError.innerText = "";
});
formSurname.addEventListener('focusout', (event) => {
    surnameError.innerText = "";
});
age.addEventListener('focusout', (event) => {
    ageError.innerText = "";
});
people.addEventListener('focusout', (event) => {
    peopleError.innerText = "";
});
formTel.addEventListener('focusout', (event) => {
    telError.innerText = "";
});


room.addEventListener('change', (event) => {
    type.remove(0);
    type.remove(0);
    additional.remove(0);
    additional.remove(0);
    if (room.value == "regular") {
        type.add(new Option("S Barom", "withBar"),undefined);
        type.add(new Option("So Švédskym stolom", "swedTable"),undefined);
        additional.add(new Option("Miešane drinky", "mixedDrinks"),undefined);
        additional.add(new Option("Pivo a shoty", "beerShots"),undefined);
    } else if (room.value == "big") {
        type.add(new Option("S pódiom", "withStage"),undefined);
        type.add(new Option("S kinom", "withCinema"),undefined);
        additional.add(new Option("Osvetlenie pre kapelu", "lights"),undefined);
        additional.add(new Option("Mikrofóny a zvukový aparát", "mics"),undefined);
    }
    updatePrice(room.value, reservationTime.value, people.value);
})

differetColor.addEventListener('change', (event) => {
    if(differetColor.checked) {
        document.getElementById("differetColorTextDiv").style.display = "flex";
    } else {
        document.getElementById("differetColorTextDiv").style.display = "none";
    }
})

reservationTime.addEventListener('change', (event) => {
    updatePrice(room.value, reservationTime.value, people.value);
})

formName.addEventListener("keypress", function (e) {
    if (!(isLetter(e.key))) {
        nameError.innerText = "Používaj len písmena"
        e.preventDefault();
    } else {
        nameError.innerText = ""
    }
})

formSurname.addEventListener("keypress", function (e) {
    if (!(isLetter(e.key))) {
        surnameError.innerText = "Používaj len písmena"
        e.preventDefault();
    } else {
        surnameError.innerText = ""
    }
})

age.addEventListener("keypress", function (e) {
    if (!(e.key < 48 || e.key > 57)) {
        ageError.innerText = "Zadaj číslo"
        e.preventDefault();
    } else {
        ageError.innerText = ""
    }
})

formTel.addEventListener("keypress", function (e) {
    if (!(e.key < 48 || e.key > 57)) {
        telError.innerText = "Zadaj číslo"
        e.preventDefault();
    } else {
        telError.innerText = ""
    }
})

people.addEventListener("keypress", function (e) {
    if (!(e.key < 48 || e.key > 57)) {
        peopleError.innerText = "Zadaj číslo"
        e.preventDefault();
    } else {
        peopleError.innerText = ""
        updatePrice(room.value, reservationTime.value, people.value);
    }
})

people.addEventListener("change", function (e) {
    if (people.value < 0)
    {
        peopleError.innerText = "Zadaj kladné číslo";
        people.value = 0;
    } else {
        peopleError.innerText = "";
        updatePrice(room.value, reservationTime.value, people.value);
    }
})

document.getElementById("textAreaRevealer").addEventListener("click", (event) => {
    if (isHidden) {
        myName.setAttribute('type', "text");
    } else {
        myName.setAttribute('type', "hidden");
    }
    isHidden = !isHidden;
})

type.addEventListener('change', (event) => {
    additional.remove(0);
    additional.remove(0);
    if (type.value == "withBar") {
        additional.add(new Option("Miešane drinky", "mixedDrinks"),undefined);
        additional.add(new Option("Pivo a shoty", "beerShots"),undefined);
    } else if (type.value == "swedTable") {
        additional.add(new Option("Bežný", "classic"),undefined);
        additional.add(new Option("Vegánsky", "vegan"),undefined);
    } else if (type.value == "withStage") {
        additional.add(new Option("Osvetlenie pre kapelu", "lights"),undefined);
        additional.add(new Option("Mikrofóny a zvukový aparát", "mics"),undefined);
    } else if (type.value == "withCinema") {
        additional.add(new Option("Digitálna premietačka", "digital"),undefined);
        additional.add(new Option("Premietačka na film", "film"),undefined);
    }
})

formName.addEventListener('input', (event) => {
    nameCharactersNum.innerText = ("("+(formName.value).length + "/20)");
})

formSurname.addEventListener('input', (event) => {
    surnameCharactersNum.innerText = ("("+(formSurname.value).length + "/20)");
})
formEmail.addEventListener('input', (event) => {
    emailCharactersNum.innerText = ("("+(formEmail.value).length + "/30)");
    if (formEmail.value.match(emailValidationRegex)) {
        emailError.innerText = "";
        badEmail = false;
    } else if (!(formEmail.value.match(emailValidationRegex))) {
        emailError.innerText = "zly email"
        badEmail = true;
    }
    if (formEmail.value == "") {
        emailError.innerText = ""
        badEmail = false;
    }
    setSubmitValidity();
})

let radioButtons = document.querySelectorAll("input[name='gender']");

age.addEventListener('change', (event) => {
    let inputDate = new Date(date.value);
    let currentDate = new Date;
    
    if (!(age.value == getYearsFromDate(inputDate, currentDate))) {
        ageError.innerText = "Dátum a vek sa nezhoduje"
        dateError.innerText = "Dátum a vek sa nezhoduje"
        badAge = true;
    } else {
        ageError.innerText = ""
        dateError.innerText = ""
        badAge = false;
    }
})

let findSelected = () => {
    let selected = document.querySelector("input[name='gender']:checked").value;
    document.getElementById("differentGenderDiv").style.display = "none";
    document.getElementById("heightDiv").style.display = "none";
    document.getElementById("weightDiv").style.display = "none";

    if (selected == "Muž") {
        document.getElementById("weightDiv").style.display = "flex";
    } else if (selected == "Žena") {
        document.getElementById("heightDiv").style.display = "flex";
    } else if (selected == "Iné") {
        document.getElementById("differentGenderDiv").style.display = "flex";
    }
}

radioButtons.forEach(radioButton => {
    radioButton.addEventListener("change", findSelected);
})
findSelected();

function handler(e){
    let inputDate = new Date(date.value);
    let currentDate = new Date;
    age.value = getYearsFromDate(inputDate, currentDate);
    if (!(age.value == getYearsFromDate(inputDate, currentDate))) {
        ageError.innerText = "Zle zadaný vek alebo dátum"
        dateError.innerText = "Zle zadaný vek alebo dátum"
        badAge = true;
    } else {
        ageError.innerText = ""
        dateError.innerText = ""
        badAge = false;
    }
    setSubmitValidity();
}

document.getElementById("wholeFOrm").submit(function(event){
    event.preventDefault();
    if(document.getElementById("wholeForm")[0].checkValidity() ){
      document.getElementById("myModal").modal('toggle');
    }
  });

function getYearsFromDate(dateOne, dateTwo) {
    return Math.trunc(((dateOne.getTime() - dateTwo.getTime()) / (1000 * 3600 * 24))/-365.25);
}

function initialization() {
    room.add(new Option("Bežná Miestnosť", "regular"),undefined);
    room.add(new Option("Veľká miestnosť", "big"),undefined);
    type.add(new Option("S Barom", "withBar"),undefined);
    type.add(new Option("So Švédskym stolom", "swedTable"),undefined);
    additional.add(new Option("Miešane drinky", "mixedDrinks"),undefined);
    additional.add(new Option("Pivo a shoty", "beerShots"),undefined);   
}

function updatePrice(whichRoom, whichTime, numOfPeople) {
    let finalPrice = 0;
    if (whichRoom == "regular") {
        finalPrice += 200;
    } else if (whichRoom == "big") {
        finalPrice += 400;
    }
    if (whichTime == "afternoon") {
        finalPrice += 100;
    } else if (whichTime == "evening") {
        finalPrice += 200;
    } else if (whichTime == "wholeDay") {
        finalPrice += 400;
    }
    finalPrice += numOfPeople*13;
    document.getElementById("finalPrice").innerText = "Cena: " + finalPrice + " €";
}

function isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
  }

