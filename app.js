var tPresupuesto = parseInt(localStorage.getItem("presupuesto")); 
var gastos = JSON.parse(localStorage.getItem("gastos")) || [];
var divPresupuesto = document.querySelector("#divPresupuesto");
var presupuesto = document.querySelector("#presupuesto");
var btnPresupuesto = document.querySelector("#btnPresupuesto");
var actalualizarGasto = document.querySelector("#actualizar");
var divGastos = document.querySelector("#divGastos");
var progress = document.querySelector("#progress");
var tGastos = 0;
var disponible = 0;

async function cargarCategorias() {
    try {
        const dato = new FormData();
        dato.append("action", "loadCategorias");

        let respuesta = await fetch("categoria.php", { method: 'POST', body: dato });
       
        
        let categorias = await respuesta.json();
        
        
        let selectCate = document.getElementById('filtrarcategoria');
        let selectEditCate = document.getElementById('ecategoria');
        let selectAddCate = document.getElementById('categoria');


        
        
        selectCate.innerHTML = '<option value="todos">todos</option>';
        selectEditCate.innerHTML = '';
        selectAddCate.innerHTML = '';

        
        categorias.nombre.forEach(categoria => {
            let option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            
            selectCate.appendChild(option.cloneNode(true));
            selectEditCate.appendChild(option.cloneNode(true));
            selectAddCate.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
    }
}
 cargarCategorias();

const inicio = () => {
    tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
    if (tPresupuesto > 0) {
        divPresupuesto.classList.remove("d-block");
        divGastos.classList.remove("d-none");
        divPresupuesto.classList.add("d-none");
        divGastos.classList.add("d-block");
        totalPresupuesto.innerHTML =` $ ${tPresupuesto.toFixed(2)}`;
        mostrarGastos();
    } else {
        divPresupuesto.classList.remove("d-none");
        divGastos.classList.remove("d-block");
        divPresupuesto.classList.add("d-block");
        divGastos.classList.add("d-none");
        presupuesto.value = 0;
    }
    pintarDatos();
}

btnPresupuesto.onclick = () => {
    tPresupuesto = parseInt(presupuesto.value);
    if (tPresupuesto == 0 || tPresupuesto < 0 || isNaN(tPresupuesto)) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Presupuesto mayor a 0" });
        return;
    }
    localStorage.setItem('presupuesto', tPresupuesto);

    divPresupuesto.classList.remove("d-block");
    divGastos.classList.remove("d-none");
    divPresupuesto.classList.add("d-none");
    divGastos.classList.add("d-block");

    totalPresupuesto.innerHTML = `$${tPresupuesto.toFixed(2)}`;
    mostrarGastos();

}

const guardarGasto = async () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let descripcion = document.getElementById("descripcion").value;
    let costo = parseInt(document.getElementById("costo").value);
    let categoria = document.getElementById("categoria").value;

    if (descripcion.trim() === "" || isNaN(costo) || costo <= 0) {
        Swal.fire({ icon: "error", title: "ERROR", text: "mal" });
        return;
    }

    if (costo > disponible) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Presusupuesto mal" });
        return;
    }

    let datos = new FormData();
    datos.append("descripcion", descripcion);
    datos.append("costo", costo);
    datos.append("categoria", categoria);
    datos.append("action", "guardarGasto");

    let respuesta = await fetch("1php.php", { method: 'POST', body: datos });
    let json = await respuesta.json();



    if (json.success == true) {

        const gasto = { descripcion, costo, categoria };
        gastos.push(gasto);
        localStorage.setItem("gastos", JSON.stringify(gastos));

        Swal.fire({ icon: "success", title: "add", text: "agregado"});
        bootstrap.Modal.getInstance(document.getElementById("nuevoGasto")).hide();

        document.getElementById("descripcion").value = "";
        document.getElementById("costo").value = "";
        document.getElementById("categoria").selectedIndex = 0;
    } else {
        Swal.fire({ icon: "error", title: "UPSI", text: "ahc" });
    }

    mostrarGastos();
}

document.getElementById("filtrarcategoria").addEventListener("change", (event) => {
    const categoriaSeleccionada = event.target.value;
    mostrarGastos(categoriaSeleccionada);
});

const mostrarGastos = async (categoria = "todos") => {
    try {
        const datos2 = new FormData();
        datos2.append("action", "selectGastos");
        let respuesta = await fetch("1php.php", { method: 'POST', body: datos2 });
        let json = await respuesta.json();

        gastos = JSON.parse(localStorage.getItem("gastos")) || [];
        let gastosHTML = ``;

        if (json.data.length === 0) {
            document.getElementById('listaGastos').innerHTML =`<b>No hay gastos</b>`;
            tGastos = 0;
            pintarDatos();
            return;
        }

        index = 0;
        tGastos = 0;

        json.data.forEach(gasto => {
            if (categoria === gasto[3] || categoria === "todos") {
                gastosHTML += `
                    <div class="card text-center w-100 m-auto mt-3 p-2">
            <div class="row">
            <div class="col"><img src="img/${gasto[3]}.png" class="imgCategoria" width="200px" height="200px"></div>
            <div class="col text-start">
            <p><b>Descripcion:</b> <small>${gasto[1]}</small></p>            
            <p><b>Costo:</b> <small>$${parseFloat(gasto[2]).toFixed(2)}</small></p>
            </div>
            <div class="col">
            <button class="btn btn-outline-primary" onclick="mostrarg2(${gasto[0]})" data-bs-toggle="modal" data-bs-target="#editarGasto">editar</button><br><br>
            <button class="btn btn-outline-danger" onclick="deletegasto(${gasto[0]})"><i class="bi bi-trash"></i></button>
</div>
            </div>
    </div> `
                tGastos += parseFloat(gasto[2]);
            }
        });

        document.getElementById("listaGastos").innerHTML = gastosHTML;
        pintarDatos();
    } catch (ex) {
        alert(ex);
    }
};

const pintarDatos = async () => {
    var totalPresupuesto = document.querySelector("#totalPresupuesto");
    var totalDisponible = document.querySelector("#totalDisponible");
    var totalGastos = document.querySelector("#totalGastos");
    var tPresupuesto = parseFloat(localStorage.getItem("presupuesto")) || 0;
    disponible = tPresupuesto - tGastos;

    let porcentaje = 100 - ((tGastos / tPresupuesto) * 100);
    porcentaje = Math.max(porcentaje, 0);
 progress.innerHTML = `<circle-progress value="${porcentaje}" min="0" max="100" text-format="percent"></circle-progress>`
    if (progress) {
        progress.setAttribute('value', porcentaje);
    }
    totalGastos.innerHTML = `$${tGastos.toFixed(2)}`;
    totalPresupuesto.innerHTML = `$${tPresupuesto.toFixed(2)}`;
    totalDisponible.innerHTML = `$${disponible.toFixed(2)}`;
};

const mostrarg2 = async (id) => {

    let datos = new FormData();
    datos.append("id", id);
    datos.append('action', 'select');

    let respuesta = await fetch("1php.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    document.getElementById("edescripcion").value = json.descripcion;
    document.getElementById("ecosto").value = json.costo;
    document.getElementById("ecategoria").value = json.categoria;
    document.getElementById("eindex").value = json.id;
}


const actualizarGasto= async () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    let descripcion = document.getElementById("edescripcion").value;
    let costo = parseFloat(document.getElementById("ecosto").value);
    let categoria = document.getElementById("ecategoria").value;
    let id = parseInt(document.getElementById("eindex").value);

    if (descripcion.trim() === "" || isNaN(costo) || costo <= 0) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Mal" });
        return;
    }

    let costoAnterior = parseFloat(gastos[index].costo);
    if (costo > (costoAnterior + disponible)) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Ya no te alcanza" });
        return;
    }

    let datos = new FormData();
    datos.append("id", id);
    datos.append("descripcion", descripcion);
    datos.append("costo", costo);
    datos.append("categoria", categoria);
    datos.append('action', 'updateGasto');


    let respuesta = await fetch("1php.php", { method: 'POST', body: datos });
    let json = await respuesta.json();

    if (json.success == true) {
        Swal.fire({ title: "actualizado", text: "", icon: "success" });
    } else {
        Swal.fire({
            title: "error", text: "", icon: "error"
        });
    }

    Swal.fire({ title: "actualizado", text: "", icon: "success" });
    bootstrap.Modal.getInstance(document.getElementById("editarGasto")).hide();
    mostrarGastos();
}


const deletegasto = async (index) => {
    Swal.fire({
        title: " Esta seguro de Eliminar?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "SI",
        denyButtonText: `NO`,
        cancelButtonColor: "#dc3545",
        confirmButtonColor: "#198754",
        denyButtonColor: "#dc3545",

    }).then(async (result) => {

        if (result.isConfirmed) {
            let gastoid = new FormData();
            gastoid.append('id', index);
            gastoid.append('action', 'delete');

            let respuesta = await fetch("1php.php", { method: 'POST', body: gastoid });
            let json = await respuesta.json();

            if (json.success == true) {
                Swal.fire("DEL", "", "success");
            } else {
                Swal.fire({
                    title: "ERROR", text:"", icon: "error"
                });
            }
            Swal.fire("eliminado", "", "success");
            mostrarGastos();
            pintarDatos();

        }
    });
}



const reset = () => {
    Swal.fire({
        title: "quieres salir?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "SI",
        denyButtonText: `NO`,
        cancelButtonColor: "#dc3545",
        confirmButtonColor: "#198754",
        denyButtonColor: "#dc3545",
    }).then(async(result) => {
        if(result.isConfirmed){
            localStorage.clear();
            inicio();

            let gastoid = new FormData();
           
            gastoid.append('action', 'delete1');

            let respuesta = await fetch('1php.php', { method: 'POST', body: gastoid });
            let json = await respuesta.json();

            if (json.success == true) {
                Swal.fire("DEL", "", "success");
            } else {
                Swal.fire({
                    title: "ERROR", text: json.mensaje, icon: "error"
                });
            }
          
            mostrarGastos();
            pintarDatos();


        }
       
    });
            
   
        
}