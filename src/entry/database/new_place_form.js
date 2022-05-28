import { getDocs, collection, updateDoc, doc, getDoc, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../../firebaseInit.js'

var htmlfile
var world
var location_fields
var cats

if (location.pathname.split('/').length == 4) {
    console.log(location.pathname)
    htmlfile = './database/new_place_form.html'
} else {
    htmlfile = './new_place_form.html'
}




fetch(htmlfile)
    .then(res => res.text())
    .then(text => {
        let oldelem = document.getElementById("new_place_form")
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
        var countries = document.getElementById('countries')
        document.getElementById('subregion').addEventListener('click', addSubLevel)
        countries.addEventListener('change', function() {
            addRegions(0, [])
        });
        (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
            const $target = $close.closest('.modal');
            if ($target.id == 'loadingModal') {

            } else {
                if ((!($close.id == 'new_region_submit')) & (!($close.id == 'new_place_submit'))) {
                    $close.addEventListener('click', () => {
                        $target.classList.remove('is-active');
                        console.log($close.id + ' closed the modal')
                    });
                }
            }
        });
        document.getElementById('new_region_submit').addEventListener('click', createRegion)
        document.getElementById('add_category').addEventListener('click', function() { addCategory(1) })
        document.getElementById('category').addEventListener('change', updateSubCats)
        document.getElementById('add_subcategory').addEventListener('click', function() { addCategory(2) })
            // document.getElementById('trigger_main').addEventListener('click', main)
        document.getElementById('new_category_submit').addEventListener('click', submitCategory)
        document.getElementById('new_place_submit').addEventListener('click', newPlaceForm)
        main()
    })

function createSelect(region, level, path) {
    var field = document.createElement('div')
    field.classList = ['field']

    var label = document.createElement('label')
    label.classList = ['label']
    label.innerText = region.region_name
    field.appendChild(label)

    var addons = document.createElement('div')
    addons.classList = ['field has-addons']
    field.appendChild(addons)

    var control = document.createElement('div')
    control.classList = ['control is-expanded']
    addons.appendChild(control)

    var selectbox = document.createElement('div')
    selectbox.classList = ['select is-fullwidth']
    selectbox.style['display'] = 'block'
    control.appendChild(selectbox)

    var select = document.createElement('select')
    select.style['width'] = '100%'
    select.name = 'select'
    selectbox.appendChild(select)

    var option = document.createElement('option')
    option.innerText = 'Add New ' + region.region_name
    select.appendChild(option)
    select.addEventListener('change', function() { addRegions(level + 1, path) })

    var keys = []
    for (let reg in region.regions) {
        keys.push(reg)
    }
    keys.sort()
    console.log(keys)
    for (let reg in keys) {
        var option = document.createElement('option')
        option.innerText = keys[reg]
        select.appendChild(option)
    }
    return field

}

async function loadCategory() {
    var cat_select = document.getElementById('category')
    var subcat_select = document.getElementById('subcategory')
    cats = await getDoc(doc(db, 'searchs', 'place_categories'))
    cats = cats.data()
    for (let cat in cats) {
        var option = document.createElement('option')
        option.innerText = cat
        cat_select.appendChild(option)
    }
}

function updateSubCats() {
    var category_select = document.getElementById('category')
    var subcategory_select = document.getElementById('subcategory')
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
    document.getElementById('add_category_modal').classList.remove('is-active')
    var cat_select = document.getElementById('category')
    var subcat_select = document.getElementById('subcategory')
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

async function addLevel(level, path) {
    document.getElementById('addLevelModal').classList.add('is-active')
    document.getElementById('subregion_name_field').style['display'] = 'none'
    console.log(level, path)
    if (level === 0) {
        document.getElementById('path').innerText = ''
        document.getElementById('region_name').innerText = 'Country'
        document.getElementById('region').innerText = 'the World'
    } else {
        var pathstr = path[0]
        var data = world[path[0]]
        for (let i = 1; i < level; i++) {
            pathstr = pathstr + '/' + path[i]
            data = data.regions[path[i]]
        }
        document.getElementById('path').innerText = pathstr
        document.getElementById('region_name').innerText = data.region_name
        document.getElementById('region').innerText = path[level - 1]
    }
}

async function addRegions(level, path) {
    document.getElementById('subregion').style['display'] = 'none'
    console.log(level, path)
    var selects = document.getElementsByTagName('select')
    var selection = selects[level].value
    console.log(location_fields.childNodes)
    while (location_fields.childNodes[level + 3]) {
        console.log('delete')
        location_fields.removeChild(location_fields.lastChild)
        console.log(location_fields.childNodes)
        path.pop()
    }

    var data = world
    for (let i = 0; i < level; i++) {
        data = data[path[i]].regions
        console.log(data)
    }
    console.log(data, selection)
    console.log(data[selection])

    var color_field = document.getElementById('color_field')
    if ((level == 0) & !(data[selection])) {
        color_field.style['display'] = 'block'
    } else {
        color_field.style['display'] = 'none'
        document.getElementById('color').value = ''
    }

    if ((typeof(data[selection]) != 'undefined')) {
        if (typeof(data[selection].regions) != 'undefined') {
            console.log("ADDING SELECT", data[selection].regions)
            var region = data[selection]
            path.push(selection)
            var field = createSelect(region, level, path)

            location_fields.appendChild(field)
        } else {
            document.getElementById('subregion').style['display'] = 'block'
        }
    }
}

function addSubLevel() {
    document.getElementById('addLevelModal').classList.add('is-active')
    var selects = document.getElementsByName('select')
    console.log(selects[0])
    var data = world[selects[0].value]
    var pathstr = selects[0].value
    for (let i = 1; i < selects.length; i++) {
        pathstr = pathstr + '/' + selects[i].value
        console.log(data)
        data = data.regions[selects[i].value]
    }
    document.getElementById('path').innerText = pathstr
}

async function createRegion() {
    var pathstr = document.getElementById('path').innerText
    var path = pathstr.split('/')
    var data = world[path[0]]
    for (let i = 1; i < path.length; i++) {
        data = data.regions[path[i]]
        console.log(data)
    }
    var subregion_name = document.getElementById('subregion_name').value
    data['region_name'] = subregion_name
    data['regions'] = {}

    // await updateDoc(doc(db, 'world', path[0]), world[path[0]])
    document.getElementById('addLevelModal').classList.remove('is-active')
    document.getElementById('path').innerText = ''
    document.getElementById('subregion_name').value = ''
    path.pop()
    addRegions(path.length, path)
}

async function newPlaceForm() {
    var alert = document.getElementById('new_place_alert')
    alert.hidden = true
    alert.innerText = ''
    if (document.getElementById('subregion').style['display'] != 'none') {
        alert.innerText = 'You must either add a new subregion to '
        alert.hidden = false
    }
    var name_input = document.getElementById('name')
    var name = name_input.value.trim()
    var street_num = document.getElementById('streetnumber').value
    var street_name = document.getElementById('streetname').value
    var category = document.getElementById('category').value
    var subcategory = document.getElementById('subcategory').value
    var selects = document.getElementsByName('select')

    if (document.getElementById('subregion').style['display'] != 'none') {
        alert.innerText = 'You must either add a new subregion to ' + selects[selects.length - 1].value + ' or unselect it'
        alert.hidden = false
        return
    }

    if (name == '') {
        name_input.classList = ['input is-danger']
        alert.innerText = 'Name is required'
        alert.hidden = false
        return
    } else {
        name_input.classList = ['input']
    }

    var cat_warning = document.getElementById('category_warning')
    var subcat_warning = document.getElementById('subcategory_warning')
    if ((category == 'Select Category') & (cat_warning.hidden)) {
        cat_warning.hidden = false
        return
    } else if ((subcategory == 'Select Sub-Category') & (subcat_warning.hidden)) {
        subcat_warning.hidden = false
        return
    } else {
        cat_warning.hidden = true
        subcat_warning.hidden = true
    }

    var matches = []
    var data = world
    var order = 0
    var region = 'world'
    var ancestor_id
    for (let i = 0; i < selects.length - 1; i++) {
        ancestor_id = data[selects[i].value].id
        matches.push(selects[i].value)
        data = data[selects[i].value].regions
        region = selects[i].value
        console.log(data)
        order++
    }

    if (name in data) {
        name_input.classList = ['input is-danger']
        alert.innerText = 'Name is already in ' + region + '. Name must be unqiue within its ancestor region'
        alert.hidden = false
        return
    } else {
        name_input.classList = ['input']
    }

    var save = {
        'name': name,
        'street_num': street_num.trim(),
        'street_name': street_name.trim(),
        'category': category,
        'sub-category': subcategory,
        'order': order,
        'path': matches
    }

    var world_save = {
        freq: 0
    }

    if (selects.length == 1) {
        let color_input = document.getElementById('color')
        console.log(color_input.value.length)
        if (color_input.value.length != 6) {
            color_input.classList = ['input is-danger']
            alert.innerText = 'Color must be 6 charecters long'
            alert.hidden = false
            return
        } else {
            color_input.classList = ['input']
        }
        world_save['color'] = '#' + color_input.value
        save['color'] = '#' + color_input.value
        console.log('color added')
    } else {
        var ancestor = await getDoc(doc(db, 'places', ancestor_id))
        save['ancestor'] = ancestor.id
    }

    var ref = await addDoc(collection(db, 'places'), save)
    console.log(ref.toString())
    world_save['id'] = ref.id

    if (selects.length == 1) {
        await setDoc(doc(db, 'world', name), world_save)
    } else {
        data[name] = world_save
        await updateDoc(doc(db, 'world', selects[0].value), world[selects[0].value])
    }

    await updateDoc(doc(db, 'searchs', 'places'), {
        [ref.id]: {
            'name': name,
            'path': matches
        }
    })

    console.log(save)
    console.log(world)

    location.reload()
}

async function main() {
    world = {}
    loadCategory()
    var data = await getDocs(collection(db, 'world'))
    location_fields = document.getElementById('location_fields')
    data.forEach((country) => {
        world[country.id] = country.data()
        var option = document.createElement('option')
        option.innerText = country.id
        countries.appendChild(option)
    })
    console.log(world)
}