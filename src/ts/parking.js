;
(function main() {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calTime(mil) {
        const minutes = Math.floor(mil / 60000);
        const seconds = Math.floor((mil % 60000) / 1000);
        return `${minutes} minutos e ${seconds} segundos`;
    }
    ;
    function parking() {
        function read() {
            return localStorage.parking ? JSON.parse(localStorage.parking) : [];
        }
        ;
        function saveVehicle(vehicles) {
            localStorage.setItem("parking", JSON.stringify(vehicles));
        }
        ;
        function addVehicle(vehicle, save) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.carName}</td>
                <td>${vehicle.carPlate}</td>
                <td>${vehicle.entrance}</td>
                <td>
                    <button class="delete" data-plate="${vehicle.carPlate}">X</button>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                removeVehicle(this.dataset.plate);
            });
            if (save)
                saveVehicle([...read(), vehicle]);
            (_b = $("#carParking")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
        }
        ;
        function removeVehicle(plate) {
            const { entrance, carName } = read().find((vehicle) => vehicle.carPlate === plate);
            const time = calTime(new Date().getTime() - new Date(entrance).getTime());
            if (!confirm(`O veículo ${carName} permaneceu por ${time}. Deseja encerrar?`))
                return;
            saveVehicle(read().filter((vehicle) => vehicle.carPlate !== plate));
            render();
        }
        ;
        function render() {
            $("#carParking").innerHTML = "";
            const carParking = read();
            if (carParking.length) {
                carParking.forEach((vehicle) => addVehicle(vehicle));
            }
            ;
        }
        ;
        return { read, addVehicle, saveVehicle, removeVehicle, render };
    }
    ;
    parking().render();
    (_a = $("#add")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const carName = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const carPlate = (_b = $("#plate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!carName || !carPlate) {
            alert("Os campos nome e placa são obrigatórios!");
            return;
        }
        ;
        parking().addVehicle({ carName, carPlate, entrance: new Date().toISOString() }, true);
        const cleanInputCar = $("#name").value = "";
        const cleanInputPlate = $("#plate").value = "";
    });
})();
