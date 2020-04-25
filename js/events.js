//deck
var drew_card;
var evt_deck = [], evt_drew_deck = [];
var evt_t1 = [], evt_t2 = [], evt_t3 = [], evt_rebelAid = [], evt_imperialAgenda = [];

//deploy vars
var deploy_drew_card;
var deploy_deck = [], deploy_drew_deck = [];

//constant
const evt_file_path = "images\\events";
const evt_file_prefix = "Events - Single cards - All cards";
const evt_rebelAid_file_prefix = "Rebel Aid - Single cards - All cards";
const evt_imperialAgenda_file_prefix = "Imperial Agenda - Single cards - All cards";
const max_evt_deck_size = 25;

const difficultyM = new Map();
difficultyM.set("Standard", [-1, -1, -1]);
//difficultyM.set("Standard", [1, 1, 1]);
difficultyM.set("Youngling", [22, 3, 0]);
difficultyM.set("Padawan", [13, 12, 0]);
difficultyM.set("Jedi Knight", [8, 9, 8]);
difficultyM.set("Jedi Master", [0, 12, 13]);

//deploy const
const deploy_file_path = "images\\deploy";
const deploy_file_prefix = "Imperial AI - Single cards - All cards";
const max_deploy_deck_size = 56;
const deployDropDown = document.getElementById("deployDropdownMenu");

//config
const eventDeckSizeHtmlElem = document.getElementById("eventDeckSize");
const discardedEventDeckSizeHtmlElem = document.getElementById("drewEventDeckSize");
const difficultyDropDown = document.getElementById("difficultyDropdownMenu");
const drawBtn = document.getElementById("draw");
const buildDeckBtn = document.getElementById("build");
const saveDeckBtn = document.getElementById("save");
const addRebelAidBtn = document.getElementById("addRA");
const addImperialAgendaBtn = document.getElementById("AddIA");
const discardSCardBtn = document.getElementById("discardSCard");

//Modal
const viewEventDeckBtn = document.getElementById("viewEventDeckBtn");
const viewDrewEventDeckBtn = document.getElementById("viewDrewEventDeckBtn");
const viewEventModalHeader = document.getElementById("viewEventModalHeader");
const viewEventModalTable = document.getElementById("viewEventModalTable");

//View Card Area
const viewInstandCardArea = document.getElementById("allIE");
const viewStandardGlobalCardArea = document.getElementById("standardGE");
const viewSpeicalGlobalCardArea = document.getElementById("specialGE");

$(document).ready(function () {
    loadResource();
    $('.dropdown-menu a').click(function () {
        $('#difficultyDropdownMenu').text($(this).text());
        buildDeckBtn.disabled = false;
    });
    $('body').on('click', '#specialGE img', function () {

        if (this.classList.contains("selected"))
            this.classList.remove("selected")
        else
            this.classList.add("selected")

        var selectedCards = document.getElementsByClassName("selected");

        if (selectedCards.length === 0)
            discardSCardBtn.disabled = true;
        else
            discardSCardBtn.disabled = false;
    })
});

function discardSCard() {
    var selectedCards = document.getElementsByClassName("selected");
    selectedCards = [].slice.call(selectedCards);

    selectedCards.forEach(function (card) {
        card.parentNode.removeChild(card);
    })

    discardSCardBtn.disabled = true;
}

function loadResource() {
    evt_deck = []
    evt_drew_deck = []

    $.getJSON("json\\events.json", function (data) {
        evt_t1 = data.events.filter(function (event) {
            return event.tier == 1;
        });
        evt_t2 = data.events.filter(function (event) {
            return event.tier == 2;
        });
        evt_t3 = data.events.filter(function (event) {
            return event.tier == 3;
        });
    });

    $.getJSON("json\\rebelAid.json", function (data) {
        evt_rebelAid = data.rebelAid;
    });

    $.getJSON("json\\imperialAgenda.json", function (data) {
        evt_imperialAgenda = data.imperialAgenda;
    });
}

function buildDeck() {

    loadResource();

    if (difficultyDropDown.textContent === "All Events") {

        //evt_deck = [].concat(evt_t1, evt_t2, evt_t3);
        for (let i = 0; i < evt_t1.length; i++) {
            evt = evt_t1[i];
            evt.set = "S";
            evt_deck.push(evt);
        }
        for (let i = 0; i < evt_t2.length; i++) {
            evt = evt_t2[i];
            evt.set = "S";
            evt_deck.push(evt);
        }
        for (let i = 0; i < evt_t3.length; i++) {
            evt = evt_t3[i];
            evt.set = "S";
            evt_deck.push(evt);
        }
    }
    else {
        difficulty_level_arr = difficultyM.get(difficultyDropDown.textContent);


        num_t1 = difficulty_level_arr[0];
        num_t2 = difficulty_level_arr[1];
        num_t3 = difficulty_level_arr[2];

        console.log("Building " + num_t1 + "," + num_t2 + "," + num_t3);

        if (num_t1 == -1) {
            //standard (variable/unpredictable difficult) need speical handle d_v_standard
            for (let i = 0; i < max_evt_deck_size; i++) {
                let _t = getRandomIntInclusive(1, 3);
                if (_t == 1) {
                    evt = evt_t1.splice(evt_t1.length * Math.random() | 0, 1)[0];
                }
                else if (_t == 2) {
                    evt = evt_t2.splice(evt_t2.length * Math.random() | 0, 1)[0];
                }
                else {
                    evt = evt_t3.splice(evt_t3.length * Math.random() | 0, 1)[0];
                }
                evt.set = "S";
                evt_deck.push(evt);
            }
        }
        else {
            for (let i = 0; i < num_t1; i++) {
                evt = evt_t1.splice(evt_t1.length * Math.random() | 0, 1)[0];
                evt.set = "S";
                evt_deck.push(evt);
            }

            for (let i = 0; i < num_t2; i++) {
                evt = evt_t2.splice(evt_t2.length * Math.random() | 0, 1)[0];
                evt.set = "S";
                evt_deck.push(evt);
            }

            for (let i = 0; i < num_t3; i++) {
                evt = evt_t3.splice(evt_t3.length * Math.random() | 0, 1)[0];
                evt.set = "S";
                evt_deck.push(evt);
            }
        }
    }

    console.log(evt_deck);

    //reset
    eventDeckSizeHtmlElem.innerHTML = evt_deck.length;
    discardedEventDeckSizeHtmlElem.innerHTML = evt_drew_deck.length;
    drawBtn.disabled = false;
    viewEventDeckBtn.disabled = false;
    viewDrewEventDeckBtn.disabled = false;
    viewInstandCardArea.innerHTML = '';
    viewStandardGlobalCardArea.innerHTML = '';
    viewSpeicalGlobalCardArea.innerHTML = '';
    addRebelAidBtn.disabled = false;
    addImperialAgendaBtn.disabled = false;
    saveDeckBtn.disabled = false;
}

function drawEvent() {
    drew_card = evt_deck.splice(evt_deck.length * Math.random() | 0, 1)[0];
    console.log(drew_card);

    // let img_path
    switch (drew_card.set) {
        case "S":
            img_path = evt_file_path + "\\tier" + drew_card.tier + "\\" + evt_file_prefix +
                drew_card.id + ".jpg";
            break;
        case "R":
            img_path = evt_file_path + "\\rebelAid" + "\\" + evt_rebelAid_file_prefix +
                drew_card.id + ".jpg";
            break;
        case "I":
            img_path = evt_file_path + "\\imperialAgenda" + "\\" + evt_imperialAgenda_file_prefix +
                drew_card.id + ".jpg";
            break;
        default:
    }

    let img = document.createElement("img");
    img.src = img_path;
    // img.classList.add("animated", "flipInY", "mx-auto", "img-fluid", "d-block", "card");
    img.classList.add("animated", "flipInY", "mx-auto", "img-fluid", "d-block", "card");

    if (drew_card.type === "G" && (drew_card.set === "R" || drew_card.set === "I")) {
        dest = viewSpeicalGlobalCardArea;
        //img.classList.add()
        dest.appendChild(img);
    } else {
        if (drew_card.type === "I")
            dest = viewInstandCardArea;
        else
            dest = viewStandardGlobalCardArea;

        dest.innerHTML = '';
        dest.appendChild(img);
    }

    evt_drew_deck.push(drew_card);

    //update deck counter
    eventDeckSizeHtmlElem.innerHTML = evt_deck.length;
    discardedEventDeckSizeHtmlElem.innerHTML = evt_drew_deck.length;

    if (evt_deck.length == 0)
        drawBtn.disabled = true;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function addRebelAidCard() {
    let evt = evt_rebelAid.splice(evt_rebelAid.length * Math.random() | 0, 1)[0];
    evt.set = "R";
    evt_deck.push(evt);

    eventDeckSizeHtmlElem.innerHTML = evt_deck.length;
}

function addImperialAgendaCard() {
    let evt = evt_imperialAgenda.splice(evt_imperialAgenda.length * Math.random() | 0, 1)[0];
    evt.set = "I";
    evt_deck.push(evt);

    eventDeckSizeHtmlElem.innerHTML = evt_deck.length;
}

function viewEventDeck() {
    viewDeck("Event Deck", evt_deck);
}

function viewDrewEventDeck() {
    viewDeck("Drew Event Deck", evt_drew_deck);
}

function viewDeck(title, deck) {
    viewEventModalTable.innerHTML = '';
    viewEventModalHeader.textContent = title + " (Deck Size=" + deck.length + ")";

    for (i = 0; i < deck.length; i++) {

        if (deck[i].type === "I")
            type = "Instant";
        else
            type = "Global";

        if (deck[i].set === "S") {
            set = "Standard"
            tier = deck[i].tier;
            img_path = evt_file_path + "\\tier" + tier + "\\" + evt_file_prefix +
                deck[i].id + ".jpg";
        }
        else if (deck[i].set === "R") {
            set = "Rebel Aid";
            img_path = evt_file_path + "\\rebelAid\\" + evt_rebelAid_file_prefix +
                deck[i].id + ".jpg";
        }
        else {
            set = "Imperial Agenda";
            img_path = evt_file_path + "\\imperialAgenda\\" + evt_imperialAgenda_file_prefix +
                deck[i].id + ".jpg";
        }

        name = '<a href="#" class="card_img">' + deck[i].name + '<div><img src="' + img_path + '" alt="image" /></div></a>';
        addRow(viewEventModalTable, name, set, type, tier);
    }
}

function addCell(tr, val) {
    let td = document.createElement('td');
    td.innerHTML = val;
    tr.appendChild(td)
}

function addRow(tbl, val_1, val_2, val_3, val_4) {
    let tr = document.createElement('tr');
    addCell(tr, val_1);
    addCell(tr, val_2);
    addCell(tr, val_3);
    addCell(tr, val_4);
    tbl.appendChild(tr)
}

function saveDeck() {
    var content = JSON.stringify(evt_deck, null, 2);
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-16"
    });
    saveAs(blob, "events.json");
}

function loadDeck(input) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function () {
        console.log("load file");
        evt_deck = JSON.parse(reader.result);

        eventDeckSizeHtmlElem.innerHTML = evt_deck.length;
        discardedEventDeckSizeHtmlElem.innerHTML = evt_drew_deck.length;
        drawBtn.disabled = false;
        viewEventDeckBtn.disabled = false;
        viewDrewEventDeckBtn.disabled = false;
        viewInstandCardArea.innerHTML = '';
        viewStandardGlobalCardArea.innerHTML = '';
        viewSpeicalGlobalCardArea.innerHTML = '';
        addRebelAidBtn.disabled = false;
        addImperialAgendaBtn.disabled = false;
        saveDeckBtn.disabled = false;
    };

    reader.onerror = function () {
        console.log(reader.error);
    };
}

