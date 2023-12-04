document.addEventListener("DOMContentLoaded", function () {
    const userDataElement = document.getElementById("userData");
    const API_URL = "https://reqres.in/api/users?delay=3";
    const STORAGE_KEY = "userData";
    const EXPIRATION_TIME = 60000; // 1 minuto en milisegundos

    function fetchData() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                // Almacenar datos en el local storage con la fecha y hora actual
                const currentDate = new Date();
                const userData = {
                    data: data.data,
                    timestamp: currentDate.getTime()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

                // Mostrar datos en el DOM
                displayUserData(userData);
            })
            .catch(error => console.error("Error al obtener datos:", error));
    }

    function displayUserData(userData) {
        // Limpiar el contenedor antes de mostrar nuevos datos
        userDataElement.innerHTML = "";

        // Crear elementos para mostrar los datos en el DOM
        const table = document.createElement("table");
        table.className = "table";
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");

        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Foto</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo electrónico</th>
        `;
        thead.appendChild(headerRow);

        // Crear filas con datos de usuarios
        userData.data.forEach(user => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${user.avatar}" alt="Avatar" class="rounded-circle"></td>
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.email}</td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        userDataElement.appendChild(table);
    }

    function checkLocalStorage() {
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
            const userData = JSON.parse(storedData);
            const currentTime = new Date().getTime();

            if (currentTime - userData.timestamp < EXPIRATION_TIME) {
                displayUserData(userData);
            } else {
                fetchData();
            }
        } else {
            fetchData();
        }
    }

    checkLocalStorage();
});
