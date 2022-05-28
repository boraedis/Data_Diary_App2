import { doc, deleteField, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../firebaseInit.js'

var url_query = processQuery()

var subs
var form_fields = document.getElementById('form-fields')

async function submitform() {
    console.log('submitting form!!')
    let alert = document.getElementById('alert')
    alert.hidden = true
        // console.log(form_fields.childNodes)

    // IMPORTS
    var inputs = document.getElementsByName('subs')

    // DATA VALIDATION
    var save_data = {}
    var save_view = {}
    var date = document.getElementById('date').innerText
    for (let s = 0; s < inputs.length; s++) {
        if ((inputs[s].value < 0) | (inputs[s].value > 10)) {
            alert.innerText = "Subs must be between 0 to 10"
            alert.hidden = false
            return
        }
        if (inputs[s].value == '') {
            save_data[subs[s]] = deleteField()
        } else {
            save_data[subs[s]] = parseInt(inputs[s].value)
            save_view[subs[s]] = parseInt(inputs[s].value)
        }
    }

    var day = doc(db, 'days', url_query['day'])
    console.log(save_data)
    console.log(save_view)
    updateDoc(day, save_data)
    await updateDoc(doc(db, 'views', 'subs'), {
        [url_query['day']]: save_view
    })
    location.reload()
}

function createField(label_text, val) {
    var hfield = document.createElement('div')
    hfield.classList = ['field is-horizontal']
    hfield.style['width'] = '90%'

    var field_label = document.createElement('div')
    field_label.classList = ["field-label is-normal"]
    hfield.appendChild(field_label)

    var label = document.createElement('label')
    label.classList = ["label"]
    label.innerText = label_text
    field_label.appendChild(label)

    var field_body = document.createElement('div')
    field_body.classList = ['field-body']
    hfield.appendChild(field_body)

    var field = document.createElement('div')
    field.classList = ['field']
    field_body.appendChild(field)

    var addons = document.createElement('div')
    addons.classList = ['field has-addons']
    field.appendChild(addons)

    var control = document.createElement('p')
    control.classList = ['control is-expanded']
    addons.appendChild(control)

    var input = document.createElement('input')
    input.classList = ['input']
    input.type = 'number'
    input.name = 'subs'
    input.id = label_text
    console.log(val)
    if (typeof(val) == typeof(0)) {
        input.value = val
    }
    input.onchange = function() { this.value = parseInt(this.value) }
    control.appendChild(input)

    return hfield
}

async function main() {
    subs = await getDoc(doc(db, 'entry_structure', 'Subs'))
    subs = subs.data().fields
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    day_data = day_data.data()
    for (let sub in subs) {
        console.log(sub, subs[sub])
        form_fields.appendChild(createField(subs[sub], day_data[subs[sub]]))
    }
    document.getElementById('submit_button').addEventListener('click', submitform)
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'

}

main()