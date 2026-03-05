function Tracker(){
    this.values=[]
    this.kpi={
        student:0,
        employed:0,
        unemployed:0
    }
}

Tracker.prototype.add=function (data){
    if (typeof data!=="object"){
        return
    }
    this.values.push(data)
    this.kpi[data.status]++
    return data
}

Tracker.prototype.destroy=function(id){
    if(!id){
        return
    }
    let index=this.values.findIndex(res=>res.id===id)
    this.kpi[this.values[index].status]--
    this.values.splice(index,1)
}

//in order to use this in the function you need to write
// now trackerApp is now an {}
const trackerApp=new Tracker()
// trackerApp.add({
//     id:1,
//     name:'Sarah',
//     status:'student',
//     age:'22'
// })
// trackerApp.add({
//     id:2,
//     name:'Suren',
//     status:'unemployed',
//     age:'27'
// })
// trackerApp.add({
//     id:Date.now(),
//     name:'Armen',
//     status:'employed',
//     age:'47'
// })
//
// trackerApp.destroy(2)
// console.log(trackerApp)

const $=s=>document.querySelector(s)

function updateKpiUI() {
    $('#countStudent').textContent = trackerApp.kpi.student
    $('#countEmployed').textContent = trackerApp.kpi.employed
    $('#countUnemployed').textContent = trackerApp.kpi.unemployed
}

$('#save').onclick=function(){
    const nameEl=$('#name')
    const ageEl=$('#age')
    const statusEl=$('#status')

    if(!nameEl.value || !ageEl.value || !statusEl.value ){
        return
    }

    let data={
        id:Date.now(),
        name: nameEl.value,
        status:statusEl.value,
        age:ageEl.value
    }

    trackerApp.add(data)
    updateKpiUI()
    applyFilterAndSort()
    nameEl.value=''
    ageEl.value=''
}

function renderHtml(data){
    return `
    <li class="list-group-item" data-id="${data.id}">
    <div class="item-main">
        <span class="item-name">${data.name}(${data.age})</span>
        <span class="item-meta">Կարգավիճակ՝</span> <span class="status-badge status-employed">${data.status}</span>
        
    </div>
    <div>
        <button class="btn btn-sm btn-outline-light btn-icon" data-action="edit">✏️</button>
        <button class="btn btn-sm btn-outline-light btn-icon" data-del="${data.id}">❌</button>
        </div>
    </li>
    `
}
const listEl = $('#userList')
listEl.onclick = function(e){
    const button = e.target.closest('button[data-del]');
    if(button){
        const delId = button.getAttribute('data-del')
        trackerApp.destroy(+delId)
        button.closest('li').remove()
        updateKpiUI()
        applyFilterAndSort()
    }
}

function applyFilterAndSort() {
    const filterValue = $('#statusFilter').value.toLowerCase()
    const sortValue = $('#sortSelect').value

    let result = trackerApp.values.slice()


    if (filterValue !== 'all') {
        result = result.filter(item => item.status.toLowerCase() === filterValue)
    }

    if(sortValue === "name.asc") {
        result.sort((a, b) => a.name.localeCompare(b.name))
    } else if(sortValue === "name.desc") {
        result.sort((a, b) => b.name.localeCompare(a.name))
    } else if(sortValue === "age.asc") {
        result.sort((a, b) => a.age - b.age)
    } else if(sortValue === "age.desc") {
        result.sort((a, b) => b.age - a.age)
    } else if(sortValue === "newest") {
        result.sort((a, b) => b.id - a.id)
    } else if(sortValue === "oldest") {
        result.sort((a, b) => a.id - b.id)
    }

    listEl.innerHTML = ''
    result.forEach(data => {
        listEl.innerHTML += renderHtml(data)
    })
}