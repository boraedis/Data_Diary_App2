import { doc, deleteField, getDoc, updateDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

import { db, processQuery } from '../firebaseInit.js'

var media
var selected = {
    'movies': [],
    'tvshows': []
}
var sp = document.getElementById('searchPanel')
var search = document.getElementById('search')
var labels = document.getElementById('labels')
const API_KEY = 'd265e7636af0e8e0cf7331741181f511'

var url_query = processQuery()

async function submitform() {
    // console.log('submitting form!!')
    // let alert = document.getElementById('alert')
    // alert.hidden = true

    // console.log(selected)

    // var saveday = {}
    // var saveview = {}

    // for (let col in selected) {
    //     if (selected[col] != null) {
    //         saveday['person' + col] = selected[col].name
    //         saveview['person' + col] = selected[col].name
    //     } else {
    //         saveday['person' + col] = deleteField()
    //     }
    // }

    // updateDoc(doc(db, "days", url_query['day']), saveday)
    // if (Object.keys(saveview).length === 0) {
    //     console.log(1)
    //     saveview = deleteField()
    // }
    // await updateDoc(doc(db, 'views', 'people'), {
    //     [url_query['day']]: saveview
    // })
    // location.reload()
}

function createLabels() {
    var label = document.createElement('div')
    label.classList = ['columns']
    var l = document.createElement('div')
    l.classList = ['column is-3']
    l.innerText = 'Movies\n\u00A0'
    label.appendChild(l)
    var field = document.createElement('div')
    field.id = 'selected_movies'
    field.classList = ['column']
    label.appendChild(field)
    labels.appendChild(label)

    var label = document.createElement('div')
    label.classList = ['columns']
    var l = document.createElement('div')
    l.classList = ['column is-3']
    l.innerText = 'TV Shows'
    label.appendChild(l)
    var field = document.createElement('div')
    field.id = 'selected_shows'
    field.classList = ['column']
    label.appendChild(field)
    labels.appendChild(label)
}

function updateLabels() {
    var selected_movies = document.getElementById('selected_movies')
    selected_movies.innerHTML = ''
    console.log(selected)
    for (let s = 0; s < selected.movies.length; s++) {
        var field = document.createElement('div')
        field.classList = ['column notification is-success']
        field.innerText = selected.movies[s].name
        field.style['border-radius'] = '10pt'
        field.style['margin'] = '0.5rem'
        field.style['padding'] = '0.25rem'
        field.style['height'] = 'min-content'
        var button = document.createElement('button')
        button.classList = ['delete']
        button.onclick = function() {
            removeSelected('movies', s)
        }
        field.appendChild(button)
        selected_movies.append(field)
    }

    var selected_shows = document.getElementById('selected_shows')
    selected_shows.innerHTML = ''

    for (let s = 0; s < selected.tvshows.length; s++) {
        var field = document.createElement('div')
        field.classList = ['column notification is-success']
        field.innerText = media[selected.tvshows[s].show].name + '\n' + 'S' + selected.tvshows[s].season + ' E' + selected.tvshows[s].episode
        field.style['border-radius'] = '10pt'
        field.style['margin'] = '0.5rem'
        field.style['padding'] = '0.25rem'
        field.style['height'] = 'min-content'
        var button = document.createElement('button')
        button.classList = ['delete']
        button.onclick = function() {
            removeSelected('tvshows', s)
        }
        field.appendChild(button)
        selected_shows.append(field)
    }
}


function removeSelected(type, i) {
    selected[type].splice(i, 1)

    updateLabels()
    updateSearch()
}

function updateSearch() {
    let count = 1
    for (let item in media) {
        var match = false
        match = media[item].name.toLowerCase().includes(search.value.toLowerCase())
        if (match) {
            sp.childNodes[count].style['display'] = ''
        } else {
            sp.childNodes[count].style['display'] = 'none'
        }
        count++
    }
}

function updateSeason(select, show, episodes) {
    let season = select.value
    episodes.innerHTML = ''

    for (let e in show.seasons[season]) {
        var field = document.createElement('div')
        field.classList = ['field']
        episodes.appendChild(field)

        var label = document.createElement('label')
        label.classList = ['checkbox']
        field.appendChild(label)

        var input = '<input type="checkbox" name="episode_checkbox" id="' + e + '"> Episode ' + e
        label.innerHTML = input
    }
}

function showEpisodes(show) {
    document.getElementById('TVShowModal').classList.add('is-active')
    var show_content = document.getElementById('show_content')
    show_content.innerHTML = ''

    var id = document.createElement('p')
    id.innerText = show.id
    id.id = 'show_id'
    id.hidden = true
    show_content.append(id)

    var title = document.createElement('p')
    title.classList = ['title is-4']
    title.innerText = show.name
    show_content.append(title)

    var field = document.createElement('div')
    field.classList = ['field']
    show_content.appendChild(field)

    var label = document.createElement('label')
    label.classList = ['label']
    label.innerText = 'Season'
    field.appendChild(label)

    var select_div = document.createElement('div')
    select_div.classList = ['select is-fullwidth']
    field.appendChild(select_div)

    var select = document.createElement('select')
    select.id = 'season_select'
    for (let s in show.seasons) {
        var opt = document.createElement('option')
        opt.innerText = s
        select.appendChild(opt)
    }
    select_div.appendChild(select)

    var episodes = document.createElement('div')
    show_content.append(episodes)



    select.onchange = function() {
        updateSeason(select, show, episodes)
    }
}

function selectEpisodes() {
    let show_id = document.getElementById('show_id').textContent
    let season = document.getElementById('season_select').value
    let episodes = document.getElementsByName('episode_checkbox')
    for (let e = 0; e < episodes.length; e++) {
        if (episodes[e].checked) {
            selected.tvshows.push({
                'show': show_id,
                'season': season,
                'episode': episodes[e].id
            })
        }
    }
    document.getElementById('TVShowModal').classList.remove('is-active')
    updateLabels()
}

function selectMedia(media) {
    if (media.type == 'movie') {
        selected.movies.push(media)
    } else {
        updateShow(media)
        showEpisodes(media)
    }
    updateLabels()
    search.value = ''
    search.focus()
}

function addPanel(item) {
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

    pb.addEventListener('click', function() { selectMedia(item) })

    var p = document.createElement('p')
    p.innerText = item.name
    pb.appendChild(p)

    var p = document.createElement('span')
    p.innerText = '\u00A0\u00A0'
    for (let i in item.path) {
        p.innerText = p.innerText + '/' + item.path[i]
    }
    p.style['color'] = '#999999'

    pb.appendChild(p)

    sp.append(pb)
}

async function addPanels() {
    media = await getDoc(doc(db, "searchs", 'media'))
    media = media.data()
    for (let item in media) {
        media[item].id = item
        addPanel(media[item])
    }
    search.addEventListener('input', updateSearch)
}

async function searchAPI() {
    var modal_body = document.getElementById('modal_content')
    modal_body.innerHTML = ''
    var searchbar = document.getElementById('search')
    console.log(searchbar.value)
    const response = await fetch('https://api.themoviedb.org/3/search/multi?api_key=' + API_KEY + '&language=en-US&query=' + searchbar.value + '&page=1&include_adult=false')
    var data = await response.json()
    console.log(data)
    for (let r in data.results) {
        var button = document.createElement('button')
        button.classList = ['button is-fullwidth is-secondary']
        button.onclick = function() {
            createMedia(data.results[r])
        }
        button.style.textAlign = 'left'
        button.style.justifyContent = 'left'
        if (data.results[r].media_type == 'movie') {
            var title = document.createElement('p')
            title.innerHTML = 'Movie : ' + '<strong>' + data.results[r].title + '</strong>'
            button.appendChild(title)
        } else if (data.results[r].media_type == 'tv') {
            var title = document.createElement('p')
            title.innerHTML = 'TV Show : ' + '<strong>' + data.results[r].name + '</strong>'
            button.appendChild(title)
        } else {
            var title = document.createElement('p')
            title.innerHTML = 'Unknown Media Type : ' + data.results[r].media_type
        }
        modal_body.appendChild(button)

    }
    document.getElementById('APIsearchModal').classList.add('is-active')
}

function updateShow(show) {
    // var new_show = await fetch('https://api.themoviedb.org/3/tv/' + show.id + '?api_key=' + API_KEY)
}

async function createMedia(med) {
    console.log(med)
    document.getElementById('APIsearchModal').classList.remove('is-active')
    if (med.media_type == 'movie') {
        var movie = await fetch('https://api.themoviedb.org/3/movie/' + med.id + '?api_key=' + API_KEY)
        var movie = await movie.json()
        var ref = await addDoc(collection(db, 'media_library'), movie)
        await updateDoc(doc(db, 'searchs', 'media'), {
            [ref.id]: {
                'name': med.title,
                'type': 'movie',
                'watches': []
            }
        })
    } else {
        document.getElementById('loadingModal').classList.add('is-active')
        var show = await fetch('https://api.themoviedb.org/3/tv/' + med.id + '?api_key=' + API_KEY)
        var show = await show.json()
        var search = {
            'name': med.name,
            'type': 'tv_show',
            'seasons': {}
        }
        var ref = await addDoc(collection(db, 'media_library'), show)
        var new_seasons = {}
        for (let s = 0; s < show.seasons.length; s++) {
            var season = await fetch('https://api.themoviedb.org/3/tv/' + med.id + '/season/' + show.seasons[s].season_number + '?api_key=' + API_KEY)
            var season = await season.json()
            season.show = ref.id
            season.type = 'tv_season'
            var season_ref = await addDoc(collection(db, 'media_library'), season)
            search.seasons[season.season_number] = {}
            var new_episodes = {}
            for (let e = 0; e < season.episodes.length; e++) {
                var ep = await fetch('https://api.themoviedb.org/3/tv/' + med.id + '/season/' + show.seasons[s].season_number + '/episode/' + season.episodes[e].episode_number + '?api_key=' + API_KEY)
                var ep = await ep.json()
                ep.show = ref.id
                ep.type = 'tv_episode'
                var ep_ref = await addDoc(collection(db, 'media_library'), ep)
                search.seasons[season.season_number][ep.episode_number] = []
                new_episodes[ep.episode_number] = ep_ref.id
            }
            season.episodes = new_episodes
            await updateDoc(doc(db, 'media_library', season_ref.id), season)
            new_seasons[season.season_number] = season_ref.id
        }
        show.seasons = new_seasons
        await updateDoc(doc(db, 'media_library', ref.id), show)
        await updateDoc(doc(db, 'searchs', 'media'), {
            [ref.id]: search
        })
    }
    location.reload()
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
            if (!($close.id == 'episodes_submit')) {
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
    createLabels()
    addPanels()
    document.getElementById('APIsearch').addEventListener('click', searchAPI)
    document.getElementById('episodes_submit').addEventListener('click', selectEpisodes)
    var day_data = await getDoc(doc(db, "days", url_query['day']))
    document.getElementById('submit_button').addEventListener('click', submitform)
    day_data = day_data.data()
    document.getElementById('date').textContent = day_data['date']
    document.getElementById('date').style.color = '#000000'
    console.log(day_data)
        // if (day_data['place1']) {
        //     selected['1'] = places[day_data['place1']];
        // }
        // if (day_data['place2']) {
        //     selected['2'] = places[day_data['place2']];
        // }

    search.focus()
}

main()