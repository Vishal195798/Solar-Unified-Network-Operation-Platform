// =====================================
// SUNOP - Main JavaScript
// =====================================


// =====================================
// Global Data
// =====================================

let solarPlants = [];

let solarData = {
    voltage: 0,
    current: 0,
    power: 0,
    temperature: 0,
    energyToday: 0,
    status: "OFF",
    plantId: 0,
    plantName: "",
    location: "",
    capacity: 0,
    totalPanels: 0
};


// =====================================
// Chart Variables
// =====================================

let powerChart = null;
let energyHistoryChart = null;
let plantEnergyChart = null;

let powerValues = [];
let timeLabels = [];


// =====================================
// Get Solar Data
// =====================================

function getSolarDataFromBackend() {

    fetch("http://localhost:8080/solar")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Solar API Error: " +
                    response.status
                );
            }

            return response.json();

        })

        .then(data => {

            console.log("Solar Data:", data);

            if (!Array.isArray(data) || data.length === 0) {
                console.log("No solar data found");
                return;
            }

            const latestData =
                data[data.length - 1];

            solarData.plantId =
                latestData.plantId || 0;

            solarData.voltage =
                latestData.voltage || 0;

            solarData.current =
                latestData.current || 0;

            solarData.power =
                latestData.power || 0;

            solarData.temperature =
                latestData.temperature || 0;

            solarData.energyToday =
                latestData.energyToday || 0;

            solarData.status =
                latestData.status || "OFF";

            solarData.plantName =
                latestData.plantName || "";

            solarData.location =
                latestData.location || "";

            solarData.capacity =
                latestData.capacity || 0;

            solarData.totalPanels =
                latestData.totalPanels || 0;


            // Dashboard

            const dashboardPower =
                document.getElementById("dashboardPower");

            if (dashboardPower) {
                dashboardPower.innerText =
                    latestData.power + " kW";
            }


            const dashboardEnergy =
                document.getElementById("dashboardEnergy");

            if (dashboardEnergy) {
                dashboardEnergy.innerText =
                    latestData.energyToday + " kWh";
            }


            const dashboardTemperature =
                document.getElementById("dashboardTemperature");

            if (dashboardTemperature) {
                dashboardTemperature.innerText =
                    latestData.temperature + " °C";
            }


            const dashboardStatus =
                document.getElementById("dashboardStatus");

            if (dashboardStatus) {
                dashboardStatus.innerText =
                    "● " + latestData.status;
            }


            // Live Monitoring

            const voltageValue =
                document.getElementById("voltageValue");

            if (voltageValue) {
                voltageValue.innerText =
                    latestData.voltage + " V";
            }


            const currentValue =
                document.getElementById("currentValue");

            if (currentValue) {
                currentValue.innerText =
                    latestData.current + " A";
            }


            const powerValue =
                document.getElementById("powerValue");

            if (powerValue) {
                powerValue.innerText =
                    latestData.power + " kW";
            }


            const temperatureValue =
                document.getElementById("temperatureValue");

            if (temperatureValue) {
                temperatureValue.innerText =
                    latestData.temperature + " °C";
            }


            const energyTodayValue =
                document.getElementById("energyTodayValue");

            if (energyTodayValue) {
                energyTodayValue.innerText =
                    latestData.energyToday + " kWh";
            }


            const statusValue =
                document.getElementById("statusValue");

            if (statusValue) {
                statusValue.innerText =
                    latestData.status;
            }


            // Power graph

            updatePowerChart(
                latestData.power
            );

        })

        .catch(error => {

            console.error(
                "Backend Error:",
                error
            );

        });

}


// =====================================
// Get All Solar Plants
// =====================================

function getAllSolarPlants() {

    fetch("http://localhost:8080/plants")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Plants API Error: " +
                    response.status
                );
            }

            return response.json();

        })

        .then(plants => {

            console.log(
                "Solar Plants:",
                plants
            );

            solarPlants = plants;


            // Solar Plant Cards

            const container =
                document.getElementById(
                    "plantsContainer"
                );

            if (container) {

                container.innerHTML = "";

                if (plants.length === 0) {

                    container.innerHTML =
                        "<p>No solar plants found.</p>";

                } else {

                    plants.forEach(plant => {

                        const card =
                            document.createElement("div");

                        card.className =
                            "plant-section";

                        card.innerHTML = `
                            <h2>${plant.plantName}</h2>

                            <p>
                                <strong>Location:</strong>
                                ${plant.location}
                            </p>

                            <p>
                                <strong>Capacity:</strong>
                                ${plant.capacity} kW
                            </p>

                            <p>
                                <strong>Total Panels:</strong>
                                ${plant.totalPanels}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                <span class="status">
                                    ● ${plant.status}
                                </span>
                            </p>
                        `;

                        container.appendChild(card);

                    });

                }

            }


            // Add Reading Dropdown

            const inputPlant =
                document.getElementById(
                    "inputPlant"
                );

            if (inputPlant) {

                inputPlant.innerHTML = `
                    <option value="">
                        Select Solar Plant
                    </option>
                `;

                plants.forEach(plant => {

                    const option =
                        document.createElement("option");

                    option.value =
                        plant.id;

                    option.textContent =
                        plant.plantName;

                    inputPlant.appendChild(option);

                });

            }


            // Plant-wise Report Dropdown

            const reportPlant =
                document.getElementById(
                    "reportPlant"
                );

            if (reportPlant) {

                reportPlant.innerHTML = `
                    <option value="">
                        Select Solar Plant
                    </option>
                `;

                plants.forEach(plant => {

                    const option =
                        document.createElement("option");

                    option.value =
                        plant.id;

                    option.textContent =
                        plant.plantName;

                    reportPlant.appendChild(option);

                });

            }

        })

        .catch(error => {

            console.error(
                "Plants Error:",
                error
            );

            const container =
                document.getElementById(
                    "plantsContainer"
                );

            if (container) {
                container.innerHTML =
                    "<p>Unable to load solar plants.</p>";
            }

        });

}


// =====================================
// Energy Reports
// =====================================

function getEnergyReports() {

    fetch("http://localhost:8080/reports")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Reports API Error: " +
                    response.status
                );
            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Reports:",
                data
            );


            const todayEnergy =
                document.getElementById(
                    "todayEnergy"
                );

            if (todayEnergy) {
                todayEnergy.innerText =
                    Number(data.today || 0).toFixed(1) +
                    " kWh";
            }


            const weeklyEnergy =
                document.getElementById(
                    "weeklyEnergy"
                );

            if (weeklyEnergy) {
                weeklyEnergy.innerText =
                    Number(data.weekly || 0).toFixed(1) +
                    " kWh";
            }


            const monthlyEnergy =
                document.getElementById(
                    "monthlyEnergy"
                );

            if (monthlyEnergy) {
                monthlyEnergy.innerText =
                    Number(data.monthly || 0).toFixed(1) +
                    " kWh";
            }

        })

        .catch(error => {

            console.error(
                "Reports Error:",
                error
            );

        });

}


// =====================================
// Daily Energy History
// =====================================

function getDailyEnergyHistory() {

    fetch("http://localhost:8080/reports/daily")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Daily Reports API Error: " +
                    response.status
                );
            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Daily Energy History:",
                data
            );


            // Table

            const table =
                document.getElementById(
                    "dailyEnergyTable"
                );

            if (table) {

                table.innerHTML = "";

                if (data.length === 0) {

                    table.innerHTML = `
                        <tr>
                            <td colspan="2">
                                No daily energy data available
                            </td>
                        </tr>
                    `;

                } else {

                    data.forEach(item => {

                        const row =
                            document.createElement("tr");

                        row.innerHTML = `
                            <td>${item.date}</td>
                            <td>
                                ${Number(item.energy).toFixed(2)}
                                kWh
                            </td>
                        `;

                        table.appendChild(row);

                    });

                }

            }


            // Graph

            const canvas =
                document.getElementById(
                    "energyHistoryChart"
                );

            if (!canvas) {
                return;
            }

            const labels =
                data.map(item => item.date);

            const values =
                data.map(
                    item => Number(item.energy)
                );


            if (energyHistoryChart) {
                energyHistoryChart.destroy();
            }


            energyHistoryChart =
                new Chart(
                    canvas,
                    {
                        type: "bar",

                        data: {

                            labels: labels,

                            datasets: [
                                {
                                    label:
                                        "Energy Generated (kWh)",

                                    data: values,

                                    borderWidth: 1
                                }
                            ]

                        },

                        options: {

                            responsive: true,

                            scales: {

                                y: {
                                    beginAtZero: true,

                                    title: {
                                        display: true,
                                        text: "Energy (kWh)"
                                    }
                                },

                                x: {
                                    title: {
                                        display: true,
                                        text: "Date"
                                    }
                                }

                            }

                        }

                    }
                );

        })

        .catch(error => {

            console.error(
                "Daily History Error:",
                error
            );

        });

}


// =====================================
// Plant-wise Report
// =====================================

function getPlantWiseReport() {

    const dropdown =
        document.getElementById(
            "reportPlant"
        );

    const table =
        document.getElementById(
            "plantDailyEnergyTable"
        );

    if (!dropdown || !table) {
        return;
    }

    const plantId =
        Number(dropdown.value);


    if (!plantId) {

        table.innerHTML = `
            <tr>
                <td colspan="2">
                    Select a solar plant
                </td>
            </tr>
        `;


        if (plantEnergyChart) {

            plantEnergyChart.destroy();

            plantEnergyChart = null;

        }

        return;
    }


    fetch(
        `http://localhost:8080/reports/plant/${plantId}`
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Plant Report API Error: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Plant-wise Report:",
                data
            );


            // Table

            table.innerHTML = "";

            if (data.length === 0) {

                table.innerHTML = `
                    <tr>
                        <td colspan="2">
                            No energy data available
                        </td>
                    </tr>
                `;

            } else {

                data.forEach(item => {

                    const row =
                        document.createElement("tr");

                    row.innerHTML = `
                        <td>${item.date}</td>
                        <td>
                            ${Number(item.energy).toFixed(2)}
                            kWh
                        </td>
                    `;

                    table.appendChild(row);

                });

            }


            // Graph

            const canvas =
                document.getElementById(
                    "plantEnergyChart"
                );

            if (!canvas) {
                return;
            }


            const labels =
                data.map(item => item.date);

            const values =
                data.map(
                    item => Number(item.energy)
                );


            if (plantEnergyChart) {
                plantEnergyChart.destroy();
            }


            plantEnergyChart =
                new Chart(
                    canvas,
                    {
                        type: "bar",

                        data: {

                            labels: labels,

                            datasets: [
                                {
                                    label:
                                        "Energy Generated (kWh)",

                                    data: values,

                                    borderWidth: 1
                                }
                            ]

                        },

                        options: {

                            responsive: true,

                            scales: {

                                y: {
                                    beginAtZero: true,

                                    title: {
                                        display: true,
                                        text: "Energy (kWh)"
                                    }
                                },

                                x: {
                                    title: {
                                        display: true,
                                        text: "Date"
                                    }
                                }

                            }

                        }

                    }
                );

        })

        .catch(error => {

            console.error(
                "Plant-wise Report Error:",
                error
            );

            table.innerHTML = `
                <tr>
                    <td colspan="2">
                        Failed to load plant report
                    </td>
                </tr>
            `;

        });

}


// =====================================
// Setup Plant-wise Report
// =====================================

function setupPlantWiseReport() {

    const dropdown =
        document.getElementById(
            "reportPlant"
        );

    if (!dropdown) {
        return;
    }

    dropdown.addEventListener(
        "change",
        getPlantWiseReport
    );

}


// =====================================
// Alerts
// =====================================

// =====================================
// Get Current Alerts
// =====================================

function getAlerts() {

    fetch("http://localhost:8080/alerts")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Alerts API Error: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Current Alerts:",
                data
            );


            const alertsList =
                document.getElementById(
                    "alertsList"
                );


            if (!alertsList) {
                return;
            }


            alertsList.innerHTML = "";


            // =================================
            // No Alerts
            // =================================

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                alertsList.innerHTML = `

                    <div class="alert-card alert-info">

                        <div class="alert-icon">
                            ℹ
                        </div>

                        <div class="alert-content">

                            <h3>No Alerts</h3>

                            <p>
                                No alert information available.
                            </p>

                        </div>

                    </div>

                `;

            }


            // =================================
            // Create Alert Cards
            // =================================

            data.forEach(alert => {

                const card =
                    document.createElement("div");


                const icon =
                    document.createElement("div");


                const content =
                    document.createElement("div");


                card.className =
                    "alert-card";


                icon.className =
                    "alert-icon";


                content.className =
                    "alert-content";


                // =================================
                // CRITICAL
                // =================================

                if (
                    alert.level ===
                    "CRITICAL"
                ) {

                    card.classList.add(
                        "alert-critical"
                    );

                    icon.innerText =
                        "🔴";


                    content.innerHTML = `

                        <h3>
                            CRITICAL ALERT
                        </h3>

                        <p>
                            ${alert.message}
                        </p>

                    `;

                }


                // =================================
                // WARNING
                // =================================

                else if (
                    alert.level ===
                    "WARNING"
                ) {

                    card.classList.add(
                        "alert-warning"
                    );

                    icon.innerText =
                        "⚠";


                    content.innerHTML = `

                        <h3>
                            WARNING
                        </h3>

                        <p>
                            ${alert.message}
                        </p>

                    `;

                }


                // =================================
                // INFO
                // =================================

                else if (
                    alert.level ===
                    "INFO"
                ) {

                    card.classList.add(
                        "alert-info"
                    );

                    icon.innerText =
                        "ℹ";


                    content.innerHTML = `

                        <h3>
                            INFORMATION
                        </h3>

                        <p>
                            ${alert.message}
                        </p>

                    `;

                }


                // =================================
                // NORMAL / OK
                // =================================

                else {

                    card.classList.add(
                        "alert-normal"
                    );

                    icon.innerText =
                        "✓";


                    content.innerHTML = `

                        <h3>
                            SYSTEM NORMAL
                        </h3>

                        <p>
                            ${alert.message}
                        </p>

                    `;

                }


                card.appendChild(icon);

                card.appendChild(content);

                alertsList.appendChild(card);

            });

        })

        .catch(error => {

            console.error(
                "Alerts Error:",
                error
            );


            const alertsList =
                document.getElementById(
                    "alertsList"
                );


            if (!alertsList) {
                return;
            }


            alertsList.innerHTML = `

                <div class="alert-card alert-info">

                    <div class="alert-icon">
                        ℹ
                    </div>

                    <div class="alert-content">

                        <h3>
                            Unable to Load Alerts
                        </h3>

                        <p>
                            Please check the backend connection.
                        </p>

                    </div>

                </div>

            `;

        });


    // Load history

    getAlertHistory();

}

// =====================================
// Get Alert History
// =====================================

function getAlertHistory() {

    const table =
        document.getElementById(
            "alertHistoryTable"
        );

    if (!table) {
        return;
    }


    fetch("http://localhost:8080/alerts/history")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Alert History API Error: " +
                    response.status
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Alert History:",
                data
            );

            table.innerHTML = "";


            // =================================
            // No Alert History
            // =================================

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {

                table.innerHTML = `
                    <tr>
                        <td colspan="4">
                            No alert history available
                        </td>
                    </tr>
                `;

                return;
            }


            // =================================
            // Display Alert History
            // =================================

            data.forEach(alert => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>
                        ${alert.dateTime}
                    </td>

                    <td>
                        ${alert.plantName}
                    </td>

                    <td>
                        ${alert.level}
                    </td>

                    <td>
                        ${alert.message}
                    </td>
                `;


                table.appendChild(row);

            });

        })

        .catch(error => {

            console.error(
                "Alert History Error:",
                error
            );


            table.innerHTML = `
                <tr>
                    <td colspan="4">
                        Unable to load alert history
                    </td>
                </tr>
            `;

        });

}

// =====================================
// Settings
// =====================================

function getSettingsData() {

    fetch("http://localhost:8080/settings")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Settings API Error: " +
                    response.status
                );
            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Settings:",
                data
            );


            const plantName =
                document.getElementById(
                    "settingsPlantName"
                );

            if (plantName) {
                plantName.innerText =
                    data.plantName || "---";
            }


            const location =
                document.getElementById(
                    "settingsLocation"
                );

            if (location) {
                location.innerText =
                    data.location || "---";
            }


            const capacity =
                document.getElementById(
                    "settingsCapacity"
                );

            if (capacity) {
                capacity.innerText =
                    (data.capacity || 0) +
                    " kW";
            }


            const panels =
                document.getElementById(
                    "settingsPanels"
                );

            if (panels) {
                panels.innerText =
                    data.totalPanels || 0;
            }

        })

        .catch(error => {

            console.error(
                "Settings Error:",
                error
            );

        });

}

// =====================================
// Check System Status
// =====================================

function checkSystemStatus() {

    const backendStatus =
        document.getElementById(
            "backendStatus"
        );

    const solarApiStatus =
        document.getElementById(
            "solarApiStatus"
        );

    const plantsApiStatus =
        document.getElementById(
            "plantsApiStatus"
        );

    const databaseStatus =
        document.getElementById(
            "databaseStatus"
        );


    // Backend / Solar API

    fetch("http://localhost:8080/solar/latest")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Solar API failed"
                );

            }

            return response.json();

        })

        .then(() => {

            if (backendStatus) {
                backendStatus.innerText =
                    "✓ Connected";
            }

            if (solarApiStatus) {
                solarApiStatus.innerText =
                    "✓ Working";
            }

            if (databaseStatus) {
                databaseStatus.innerText =
                    "✓ Connected through API";
            }

        })

        .catch(error => {

            console.error(
                "System Status Error:",
                error
            );

            if (backendStatus) {
                backendStatus.innerText =
                    "✗ Not Connected";
            }

            if (solarApiStatus) {
                solarApiStatus.innerText =
                    "✗ Not Working";
            }

            if (databaseStatus) {
                databaseStatus.innerText =
                    "✗ Not Available";
            }

        });


    // Plants API

    fetch("http://localhost:8080/plants")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Plants API failed"
                );

            }

            return response.json();

        })

        .then(() => {

            if (plantsApiStatus) {
                plantsApiStatus.innerText =
                    "✓ Working";
            }

        })

        .catch(error => {

            console.error(
                "Plants API Error:",
                error
            );

            if (plantsApiStatus) {
                plantsApiStatus.innerText =
                    "✗ Not Working";
            }

        });

}

// =====================================
// Refresh Settings
// =====================================

function refreshSettings() {

    const message =
        document.getElementById(
            "settingsRefreshMessage"
        );

    if (message) {

        message.innerText =
            "Refreshing settings...";

    }


    getSettingsData();

    getAllSolarPlants();

    checkSystemStatus();


    setTimeout(() => {

        if (message) {

            message.innerText =
                "✓ Settings refreshed successfully";

        }

    }, 1000);

}


// =====================================
// Navigation
// =====================================

function hideAllSections() {

    const sections = [

        "dashboardSection",
        "solarPlantsSection",
        "monitoringSection",
        "addReadingSection",
        "reportsSection",
        "alertsSection",
        "settingsSection"

    ];


    sections.forEach(id => {

        const section =
            document.getElementById(id);

        if (section) {
            section.style.display = "none";
        }

    });

}


// Dashboard

function showDashboard() {

    hideAllSections();

    const section =
        document.getElementById(
            "dashboardSection"
        );

    if (section) {
        section.style.display = "block";
    }

}


// Solar Plants

function showSolarPlants() {

    hideAllSections();

    const section =
        document.getElementById(
            "solarPlantsSection"
        );

    if (section) {
        section.style.display = "block";
    }

}


// Monitoring

function showMonitoring() {

    hideAllSections();

    const section =
        document.getElementById(
            "monitoringSection"
        );

    if (section) {
        section.style.display = "block";
    }

}


// Add Reading

// =====================================
// Add Reading
// =====================================

function showAddReading() {

    hideAllSections();


    const section =
        document.getElementById(
            "addReadingSection"
        );


    if (section) {

        section.style.display = "block";


        // Automatically move to Add Reading
        setTimeout(() => {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 100);

    }


    const saveMessage =
        document.getElementById(
            "saveMessage"
        );


    if (saveMessage) {

        saveMessage.innerText = "";

        saveMessage.className = "";

    }

}

// Reports

function showReports() {

    hideAllSections();

    const section =
        document.getElementById(
            "reportsSection"
        );

    if (section) {
        section.style.display = "block";
    }

}


// Alerts

function showAlerts() {

    hideAllSections();

    const section =
        document.getElementById(
            "alertsSection"
        );

    if (section) {
        section.style.display = "block";
    }

}


// Settings

function showSettings() {

    hideAllSections();

    const section =
        document.getElementById(
            "settingsSection"
        );

    if (section) {
        section.style.display = "block";
    }

}


// =====================================
// Power Chart
// =====================================

function createPowerChart() {

    const canvas =
        document.getElementById(
            "powerChart"
        );

    if (!canvas) {
        return;
    }


    powerChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {

                    labels: timeLabels,

                    datasets: [

                        {
                            label:
                                "Power (kW)",

                            data:
                                powerValues,

                            borderWidth: 2,

                            tension: 0.3
                        }

                    ]

                },

                options: {

                    responsive: true,

                    scales: {

                        y: {
                            beginAtZero: true
                        }

                    }

                }

            }
        );

}


// =====================================
// Update Power Chart
// =====================================

function updatePowerChart(power) {

    if (!powerChart) {
        return;
    }


    const currentTime =
        new Date().toLocaleTimeString();


    timeLabels.push(
        currentTime
    );


    powerValues.push(
        power
    );


    if (timeLabels.length > 10) {

        timeLabels.shift();

        powerValues.shift();

    }


    powerChart.data.labels =
        timeLabels;

    powerChart.data.datasets[0].data =
        powerValues;

    powerChart.update();

}


// =====================================
// Message Helper
// =====================================

function showMessage(elementId, message, type) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.innerText = message;

    element.className = "";

    if (type === "success") {

        element.classList.add(
            "message-success"
        );

    } else if (type === "error") {

        element.classList.add(
            "message-error"
        );

    } else {

        element.classList.add(
            "message-info"
        );
    }
}


// =====================================
// Add Solar Reading
// =====================================

// =====================================
// Add Solar Reading
// =====================================

function setupSolarReadingForm() {

    const form =
        document.getElementById(
            "solarReadingForm"
        );

    if (!form) {

        console.error(
            "solarReadingForm not found in HTML"
        );

        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // =====================================
            // Get Values
            // =====================================

            const voltage =
                Number(
                    document.getElementById(
                        "inputVoltage"
                    ).value
                );

            const current =
                Number(
                    document.getElementById(
                        "inputCurrent"
                    ).value
                );

            const power =
                Number(
                    document.getElementById(
                        "inputPower"
                    ).value
                );

            const temperature =
                Number(
                    document.getElementById(
                        "inputTemperature"
                    ).value
                );

            const energyToday =
                Number(
                    document.getElementById(
                        "inputEnergyToday"
                    ).value
                );

            const status =
                document.getElementById(
                    "inputStatus"
                ).value;


            const selectedPlantId =
                Number(
                    document.getElementById(
                        "inputPlant"
                    ).value
                );


            const saveMessage =
                document.getElementById(
                    "saveMessage"
                );


            // =====================================
            // Select Plant
            // =====================================

            const selectedPlant =
                solarPlants.find(
                    plant =>
                        Number(plant.id) ===
                        selectedPlantId
                );


            if (
                !selectedPlantId ||
                !selectedPlant
            ) {

                saveMessage.innerText =
                    "✗ Please select a valid solar plant";

                return;
            }


            // =====================================
            // Basic Number Validation
            // =====================================

            if (isNaN(voltage)) {

                saveMessage.innerText =
                    "✗ Please enter a valid voltage";

                return;
            }


            if (isNaN(current)) {

                saveMessage.innerText =
                    "✗ Please enter a valid current";

                return;
            }


            if (isNaN(power)) {

                saveMessage.innerText =
                    "✗ Please enter a valid power";

                return;
            }


            if (isNaN(temperature)) {

                saveMessage.innerText =
                    "✗ Please enter a valid temperature";

                return;
            }


            if (isNaN(energyToday)) {

                saveMessage.innerText =
                    "✗ Please enter valid energy";

                return;
            }


            // =====================================
            // Negative Value Validation
            // =====================================

            if (voltage < 0) {

                showMessage(
    "saveMessage",
    "✗ Voltage cannot be negative",
    "error"
);

                return;
            }


            if (current < 0) {

                 showMessage(
        "saveMessage",
        "✗ Current cannot be negative",
        "error"
    );

                return;
            }


            if (power < 0) {

                 showMessage(
        "saveMessage",
        "✗ Power cannot be negative",
        "error"
                 );

                return;
            }


            if (energyToday < 0) {

                 showMessage(
        "saveMessage",
        "✗ Energy cannot be negative",
        "error"
    );

                return;
            }


            if (
                temperature < -50 ||
                temperature > 120
            ) {

                 showMessage(
        "saveMessage",
        "✗ Temperature must be between -50°C and 120°C",
        "error"
    );

                return;
            }


            // =====================================
            // Power Validation
            // =====================================

            const calculatedPower =
                (voltage * current) / 1000;


            const powerDifference =
                Math.abs(
                    power - calculatedPower
                );


            if (powerDifference > 0.1) {

                showMessage(
        "saveMessage",
        "✗ Power should be approximately "
            + calculatedPower.toFixed(2)
            + " kW",
        "error"
    );

                return;
            }


            // =====================================
            // Create Reading Object
            // =====================================

            const readingData = {

                plantId:
                    selectedPlantId,

                voltage:
                    voltage,

                current:
                    current,

                power:
                    power,

                temperature:
                    temperature,

                energyToday:
                    energyToday,

                status:
                    status,

                plantName:
                    selectedPlant.plantName,

                location:
                    selectedPlant.location,

                capacity:
                    selectedPlant.capacity,

                totalPanels:
                    selectedPlant.totalPanels
            };


            console.log(
                "Reading To Save:",
                readingData
            );


            saveMessage.innerText =
                "Saving...";


            // =====================================
            // Save To Backend
            // =====================================

            fetch(
                "http://localhost:8080/solar",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            readingData
                        )
                }
            )

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to save solar reading"
                    );

                }

                return response.json();

            })

            .then(savedData => {

                console.log(
                    "Saved Reading:",
                    savedData
                );


                saveMessage.innerText =
                    "✓ Solar reading saved successfully";


                form.reset();


                // Refresh data

                getSolarDataFromBackend();

                getAllSolarPlants();

                getEnergyReports();

                getDailyEnergyHistory();

                getAlerts();

                getSettingsData();

            })

            .catch(error => {

                console.error(
                    "Save Error:",
                    error
                );

                saveMessage.innerText =
                    "✗ Failed to save reading";

            });

        }
    );
}


// =====================================
// Start Application
// =====================================

createPowerChart();

setupSolarReadingForm();

setupPlantWiseReport();

showDashboard();

getSolarDataFromBackend();

getAllSolarPlants();

getEnergyReports();

getDailyEnergyHistory();

getAlerts();

getSettingsData();
checkSystemStatus();

// =====================================
// Automatic Refresh
// =====================================

setInterval(
    getSolarDataFromBackend,
    2000
);


setInterval(
    getAllSolarPlants,
    10000
);


setInterval(
    getEnergyReports,
    10000
);


setInterval(
    getDailyEnergyHistory,
    10000
);


setInterval(
    getAlerts,
    5000
);


setInterval(
    getSettingsData,
    10000
);

setInterval(
    checkSystemStatus,
    10000
);

function logout() {

    localStorage.removeItem("sunopLoggedIn");

    localStorage.removeItem("sunopUsername");

    localStorage.removeItem("sunopRole");

    window.location.href = "login.html";
}