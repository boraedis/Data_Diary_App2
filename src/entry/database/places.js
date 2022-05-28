import { collection, updateDoc, doc, getDocs, deleteDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js"

import { db } from "../../firebaseInit.js";

var sp = document.getElementById('searchPanel')
var search = document.getElementById('search')
var labels = document.getElementById('labels')
var level_columns = document.getElementById('level_columns')
var places
var cats
var editing = false
var selected_place
var world
var current_tab = 0


function change_tab(tab_num) {
    if (current_tab == tab_num) {
        return
    }
    var tabs = [
        document.getElementById('place_information'),
        document.getElementById('world_view')
    ]
    var buttons = [
        document.getElementById('place_information_button'),
        document.getElementById('world_view_button')
    ]
    for (let t in tabs) {
        if (t == tab_num) {
            tabs[t].style.display = 'block'
            buttons[t].parentElement.classList = ['is-active']
        } else {
            tabs[t].style.display = 'none'
            buttons[t].parentElement.classList = ['']
        }
    }
}
// PLACE INFORMATION

async function loadCategory() {
    var cat_select = document.getElementById('place_category')
    var subcat_select = document.getElementById('place_subcategory')
    cats = await getDoc(doc(db, 'searchs', 'place_categories'))
    cats = cats.data()
    for (let cat in cats) {
        var option = document.createElement('option')
        option.innerText = cat
        cat_select.appendChild(option)
    }
}

function updateSubCats() {
    var category_select = document.getElementById('place_category')
    var subcategory_select = document.getElementById('place_subcategory')
    var subcategory_button = document.getElementById('add_subcategory')
    while (subcategory_select.childNodes[3]) {
        subcategory_select.removeChild(subcategory_select.lastChild)
    }
    subcategory_select.disabled = true
    subcategory_button.disabled = true
    console.log(subcategory_select.childNodes)
    if (category_select.value in cats) {
        subcategory_select.disabled = false
        subcategory_button.disabled = false
        for (let subcat in cats[category_select.value]) {
            var option = document.createElement('option')
            option.innerText = cats[category_select.value][subcat]
            subcategory_select.appendChild(option)
        }
    }
}

function addCategory(level) {
    document.getElementById('add_category_modal').classList.add('is-active')
    var path = document.getElementById('cat_path')
    path.innerText = ''
    if (level === 2) {
        path.innerText = document.getElementById('category').value + '/'
    }
}
async function submitCategory() {
    console.log('SUBMITTING CATEGORY')
    document.getElementById('add_category_modal').classList.remove('is-active')
    var cat_select = document.getElementById('place_category')
    var subcat_select = document.getElementById('place_subcategory')
    var pathbox = document.getElementById('cat_path')
    var path = pathbox.innerText.replace('/', '')
    console.log(path)
    pathbox.innerText = ''
    var input = document.getElementById('category_name')
    if (path == '') {
        cats[input.value] = []
        await updateDoc(doc(db, 'searchs', 'place_categories'), {
            [input.value]: []
        })
        while (cat_select.childNodes[3]) {
            cat_select.removeChild(cat_select.lastChild)
        }
    } else {
        cats[path].push(input.value)
        await updateDoc(doc(db, 'searchs', 'place_categories'), {
            [path]: cats[path]
        })
        updateSubCats()
    }

    loadCategory()
    input.value = ''
}

function updateSearch() {
    let count = 1
    for (let place in places) {
        var match = false
        var nicknames = places[place].path
        var n = 0
        if (places[place].name.toLowerCase().includes(search.value.toLowerCase())) { match = true }
        while ((match == false) & (n < nicknames.length)) {
            if (nicknames[n].toLowerCase().includes(search.value.toLowerCase())) {
                match = true;
            }
            n++
        }
        if (match) {
            sp.childNodes[count].style['display'] = ''
        } else {
            sp.childNodes[count].style['display'] = 'none'
        }
        count++
    }
}
async function showLocation(place) {
    var placeSnapshot = await getDoc(doc(db, 'places', place.id))
    var place = placeSnapshot.data()
    place.id = placeSnapshot.id
    console.log(place)
    selected_place = place
    var path_text = ''
    for (let p in selected_place.path) {
        path_text = path_text + selected_place.path[p] + '/'
    }
    if (selected_place.color) {
        document.getElementById('place_color').value = selected_place.color.replace('#', '')
        document.getElementById('edit_color_field').style.display = 'block'
    } else {
        document.getElementById('edit_color_field').style.display = 'none'
    }

    document.getElementById('place_name').classList = ['input']
    document.getElementById('place_edit_alert').hidden = true
    document.getElementById('place_id').innerText = selected_place.id
    document.getElementById('place_path').innerText = path_text
    document.getElementById('place_name').value = selected_place.name
    document.getElementById('place_streetname').value = selected_place.street_name
    document.getElementById('place_streetnum').value = selected_place.street_num
    document.getElementById('place_category').value = selected_place.category
    updateSubCats()
    document.getElementById('place_subcategory').value = place['sub-category']

    document.getElementById('place_name').readOnly = true
    document.getElementById('place_streetname').readOnly = true
    document.getElementById('place_streetnum').readOnly = true
    document.getElementById('place_category').disabled = true
    document.getElementById('place_subcategory').disabled = true
    document.getElementById('place_color').readOnly = true

    editing = false
    document.getElementById('place_edit').innerText = 'Edit'
    document.getElementById('place_delete').style.display = 'block'
    document.getElementById('place_save').style.display = 'none'
    document.getElementById('display').style.display = 'flex'

}

function place_edit() {
    editing = (!(editing))
    if (editing) {
        document.getElementById('place_name').readOnly = false
        document.getElementById('place_streetname').readOnly = false
        document.getElementById('place_streetnum').readOnly = false
        document.getElementById('place_category').disabled = false
        document.getElementById('place_subcategory').disabled = false
        document.getElementById('place_color').readOnly = false
        document.getElementById('place_edit').innerText = 'Cancel'
        document.getElementById('place_delete').style.display = 'none'
        document.getElementById('place_save').style.display = 'block'
    } else {
        showLocation(selected_place)
    }
}

function traverseRegions(region) {
    if (!(region.regions)) {
        return [region.id]
    }
    var subRegions = []
    for (let r in region.regions) {
        var sub = traverseRegions(region.regions[r])
        for (let s in sub) {
            subRegions.push(sub[s])
        }
    }
    subRegions.push(region.id)
    return subRegions

}
async function place_save() {
    var name_input = document.getElementById('place_name')
    name_input.classList = ['input']
    var alert = document.getElementById('place_edit_alert')
    alert.hidden = true
    alert.innerText = ''
    var place_name = name_input.value
    var place_id = document.getElementById('place_id').innerText
    var place_streetname = document.getElementById('place_streetname').value
    var place_streetnum = document.getElementById('place_streetnum').value
    var place_category = document.getElementById('place_category').value
    var place_subcategory = document.getElementById('place_subcategory').value
    var place_color = document.getElementById('place_color').value

    if (place_name == '') {
        name_input.classList = ['input is-danger']
        alert.innerText = 'Name is required'
        alert.hidden = false
        return
    }

    if ((place_category == 'Select Category') | (place_subcategory == 'Select Sub-Category')) {
        alert.innerText = 'Category and Subcategory must be selected'
        alert.hidden = false
        return
    }

    console.log((selected_place.color) & (place_color.length != 6))
    if (Boolean(selected_place.color) & (place_color.length != 6)) {
        alert.innerText = 'Color must be 6 charecters long'
        alert.hidden = false
        return
    }

    var loadModal = document.getElementById('loadingModal')
    loadModal.classList.add('is-active')
    var loadProg = document.getElementById('loadingProgress')

    if (place_name != selected_place.name) {
        var names = []
        for (let p in places) {
            if (places[p].path.join('{|}') == selected_place.path.join('{|}')) {
                names.push(places[p].name)
            }
        }
        if (names.includes(place_name)) {
            name_input.classList = ['input is-danger']
            alert.innerText = place_name + ' is already in ' + selected_place.path[selected_place.path.length - 1] + '. Name must be unqiue within its ancestor region'
            alert.hidden = false
            return
        }
        console.log("CHANGING NAME")


        var country_data
        var data
        if (selected_place.path.length == 0) {
            country_data = await getDoc(doc(db, 'world', selected_place.name))
            country_data = country_data.data()
            data = country_data
            setDoc(doc(db, 'world', place_name), country_data)
            deleteDoc(doc(db, 'world', selected_place.name))
        } else {
            country_data = await getDoc(doc(db, 'world', selected_place.path[0]))
            country_data = country_data.data()
            data = country_data
            for (let p = 1; p < selected_place.path.length; p++) {
                data = data.regions[selected_place.path[p]]
            }
            data.regions[place_name] = data.regions[selected_place.name]
            delete data.regions[selected_place.name]
            updateDoc(doc(db, 'world', selected_place.path[0]), country_data)
            data = data.regions[place_name]
        }
        var regions = traverseRegions(data)
        var places_search = await getDoc(doc(db, 'searchs', 'places'))
        places_search = places_search.data()
        places_search[place_id].name = place_name
        for (let r = 0; r < regions.length - 1; r++) {
            places_search[regions[r]].path[selected_place.order] = place_name
        }
        await updateDoc(doc(db, 'searchs', 'places'), places_search)
        selected_place.name = place_name
    }

    selected_place.street_name = place_streetname
    selected_place.street_num = place_streetnum
    selected_place.category = place_category
    selected_place['sub-category'] = place_subcategory
    if (selected_place.color) { selected_place.color = '#' + place_color }

    await updateDoc(doc(db, 'places', place_id), selected_place)
    loadModal.classList.remove('is-active')
    place_edit()
    location.reload()
}

function addPanel(place) {
    var pb = document.createElement('a')
    pb.classList = ['panel-block']
    pb.style['text-decoration'] = 'none'
    pb.style['white-space'] = 'nowrap'
    pb.style['overflow'] = 'auto'

    var add = document.createElement('span')
    add.classList = ['panel-icon']
    var i = document.createElement('i')
    i.classList = ['fa-solid fa-plu']
    add.appendChild(i)
    pb.appendChild(add)

    pb.addEventListener('click', function() { showLocation(place) })

    var p = document.createElement('p')
    p.innerText = place.name
    pb.appendChild(p)

    var p = document.createElement('span')
    p.innerText = '\u00A0\u00A0'
    for (let i in place.path) {
        p.innerText = p.innerText + '/' + place.path[i]
    }
    p.style['color'] = '#999999'

    pb.appendChild(p)

    sp.append(pb)
}
async function addPanels() {
    places = await getDoc(doc(db, "searchs", 'places'))
    places = places.data()
    console.log(places)
    for (let place in places) {
        places[place].id = place
        places[place].selected = false
        addPanel(places[place])
    }
    search.addEventListener('input', updateSearch)
}

// WORLD VIEW

async function loadWorldView() {
    world = await getDocs(collection(db, 'world'))
    var col = document.createElement('div')
    col.classList = ['column is-3']
    level_columns.appendChild(col)

    var tile = document.createElement('div')
    tile.classList = ['tile notification is-secondary is-vertical']
    tile.style.height = '100%'
    col.appendChild(tile)

    var title = document.createElement('div')
    title.classList = ['title is-3']
    title.innerText = "World"
    tile.appendChild(title)

    world.forEach((country) => {
        var text = document.createElement('div')
        text.classList = ['tile is-child notification is-primary']
        text.style.padding = '0.5rem'
        text.style.marginBottom = '0.25rem'
        tile.appendChild(text)
        text.innerText = country.id
    })
}

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');
        if ($target.id == 'loadingModal') {

        } else {
            if (!($close.id == 'new_place_submit')) {
                $close.addEventListener('click', () => {
                    closeModal($target);
                });
            }
        }
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});

async function main() {
    addPanels()
    updateSearch()
    loadCategory()
    document.getElementById('add_category').addEventListener('click', function() { addCategory(1) })
    document.getElementById('place_category').addEventListener('change', updateSubCats)
    document.getElementById('add_subcategory').addEventListener('click', function() { addCategory(2) })
    document.getElementById('place_close').addEventListener('click', function() { document.getElementById('display').style.display = 'none' })
    document.getElementById('place_edit').addEventListener('click', place_edit)
    document.getElementById('place_delete').addEventListener('click', place_delete)
    document.getElementById('place_save').addEventListener('click', place_save)
    document.getElementById('place_information_button').addEventListener('click', function() { change_tab(0) })
    document.getElementById('world_view_button').addEventListener('click', function() { change_tab(1) })
    loadWorldView()
}

main()