interface Vehicle{
    carName: string;
    carPlate: string;
    entrance: Date | string;
};

(function main() {

    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calTime(mil: number): string {

        const minutes = Math.floor(mil / 60000);
        const seconds = Math.floor((mil % 60000) / 1000);

        return `${minutes} minutos e ${seconds} segundos`;

    };

    function parking() {

        function read(): Vehicle[] {

            return localStorage.parking ? JSON.parse(localStorage.parking) : [];

        };

        function saveVehicle(vehicles: Vehicle[]) {

            localStorage.setItem("parking", JSON.stringify(vehicles));

        };

        function addVehicle(vehicle: Vehicle, save?: boolean) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${vehicle.carName}</td>
                <td>${vehicle.carPlate}</td>
                <td>${vehicle.entrance}</td>
                <td>
                    <button class="delete" data-plate="${vehicle.carPlate}">X</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function() {

                removeVehicle(this.dataset.plate);

            });

            if(save) saveVehicle([...read(), vehicle]);

            $("#carParking")?.appendChild(row);

        };

        function removeVehicle(plate: string) {

            const {entrance, carName} = read().find((vehicle) => vehicle.carPlate === plate);

            const time = calTime(new Date().getTime() - new Date (entrance).getTime());

            if(!confirm(`O veículo ${carName} permaneceu por ${time}. Deseja encerrar?`)) return;

            saveVehicle(read().filter((vehicle)=> vehicle.carPlate !== plate));
            render();

        };

        function render() {

            $("#carParking")!.innerHTML = "";

            const carParking = read();

            if(carParking.length) {

                carParking.forEach((vehicle) => addVehicle(vehicle));

            };

        };

        return {read, addVehicle, saveVehicle, removeVehicle, render};

    };

    parking().render();

    $("#add")?.addEventListener("click", ()=>{

        const carName = $("#name")?.value;
        const carPlate = $("#plate")?.value;

        if(!carName || !carPlate) {
            alert("Os campos nome e placa são obrigatórios!");
            return;
        };

        parking().addVehicle({carName, carPlate, entrance: new Date().toISOString()}, true);

        const cleanInputCar = $("#name").value = "";
        const cleanInputPlate = $("#plate").value = "";

    });

})();