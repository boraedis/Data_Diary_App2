function database() {
    if (location.pathname == '/src/entry/database/person.html') {
        location = 'people.html'
    }
    // location = '.html'
}
fetch('database_console.html')
    .then(res => res.text())
    .then(text => {
        let oldelem = document.getElementById("console")
        let newelem = document.createElement("div");
        newelem.innerHTML = text;
        oldelem.parentNode.replaceChild(newelem, oldelem);
        document.getElementById('database').addEventListener('click', database)
    })