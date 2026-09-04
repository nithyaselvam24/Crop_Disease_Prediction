
/* =========================================================
   AI CROP DOCTOR - DASHBOARD
   ========================================================= */

const HISTORY_KEY = "cropDoctorHistory";

let diseaseChart = null;
let cropChart = null;


/* =========================
   GET HISTORY
========================= */

function getHistory() {

    try {

        const data =
            localStorage.getItem(HISTORY_KEY);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "History loading error:",
            error
        );

        return [];
    }
}


/* =========================
   FORMAT NAME
========================= */

function formatName(name) {

    if (!name) {
        return "Unknown";
    }

    return name
        .replaceAll("_", " ")
        .replaceAll("___", " ")
        .replaceAll("__", " ")
        .replace(/\s+/g, " ")
        .trim();
}


/* =========================
   CHECK HEALTHY
========================= */

function isHealthy(item) {

    const disease =
        String(
            item.disease ||
            item.predicted_class ||
            ""
        ).toLowerCase();

    return disease.includes("healthy");
}


/* =========================
   CALCULATE STATS
========================= */

function calculateStats(history) {

    const total = history.length;

    const healthy =
        history.filter(isHealthy).length;

    const diseased =
        total - healthy;


    let confidenceTotal = 0;

    history.forEach(item => {

        const confidence =
            Number(item.confidence);

        if (Number.isFinite(confidence)) {

            confidenceTotal += confidence;
        }
    });


    const averageConfidence =
        total > 0
            ? confidenceTotal / total
            : 0;


    return {
        total,
        healthy,
        diseased,
        averageConfidence
    };
}


/* =========================
   FIND MOST COMMON
========================= */

function findMostCommon(items) {

    if (!items.length) {
        return "No data";
    }

    const counts = {};

    items.forEach(item => {

        const key =
            formatName(item);

        counts[key] =
            (counts[key] || 0) + 1;
    });


    let mostCommon = items[0];

    let highestCount = 0;


    Object.entries(counts).forEach(
        ([name, count]) => {

            if (count > highestCount) {

                highestCount = count;

                mostCommon = name;
            }
        }
    );


    return mostCommon;
}


/* =========================
   UPDATE STAT CARDS
========================= */

function updateStats(history) {

    const stats =
        calculateStats(history);


    document.getElementById(
        "totalPredictions"
    ).textContent =
        stats.total;


    document.getElementById(
        "healthyCrops"
    ).textContent =
        stats.healthy;


    document.getElementById(
        "diseasedCrops"
    ).textContent =
        stats.diseased;


    document.getElementById(
        "averageConfidence"
    ).textContent =
        `${stats.averageConfidence.toFixed(1)}%`;
}


/* =========================
   UPDATE HIGHLIGHTS
========================= */

function updateHighlights(history) {

    const diseases =
        history.map(item =>
            item.disease ||
            item.predicted_class ||
            "Unknown"
        );


    const crops =
        history.map(item =>
            item.crop ||
            "Unknown"
        );


    document.getElementById(
        "mostDetectedDisease"
    ).textContent =
        findMostCommon(diseases);


    document.getElementById(
        "mostPredictedCrop"
    ).textContent =
        findMostCommon(crops);
}


/* =========================
   COUNT VALUES
========================= */

function countValues(items) {

    const counts = {};

    items.forEach(item => {

        const name =
            formatName(item);

        counts[name] =
            (counts[name] || 0) + 1;
    });

    return counts;
}


/* =========================
   CREATE DISEASE CHART
========================= */

function createDiseaseChart(history) {

    const canvas =
        document.getElementById(
            "diseaseChart"
        );


    if (!canvas) {
        return;
    }


    const diseases =
        history.map(item =>
            item.disease ||
            item.predicted_class ||
            "Unknown"
        );


    const counts =
        countValues(diseases);


    if (diseaseChart) {

        diseaseChart.destroy();

        diseaseChart = null;
    }


    diseaseChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    Object.keys(counts),

                datasets: [

                    {
                        label:
                            "Predictions",

                        data:
                            Object.values(counts),

                        borderWidth: 1
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        }
                    }

                }
            }
        });
}


/* =========================
   CREATE CROP CHART
========================= */

function createCropChart(history) {

    const canvas =
        document.getElementById(
            "cropChart"
        );


    if (!canvas) {
        return;
    }


    const crops =
        history.map(item =>
            item.crop ||
            "Unknown"
        );


    const counts =
        countValues(crops);


    if (cropChart) {

        cropChart.destroy();

        cropChart = null;
    }


    cropChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels:
                    Object.keys(counts),

                datasets: [

                    {
                        label:
                            "Crops",

                        data:
                            Object.values(counts),

                        borderWidth: 2
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        position: "bottom"
                    }
                }
            }
        });
}


/* =========================
   FORMAT DATE
========================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Unknown date";
    }


    const date =
        new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }


    return date.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


/* =========================
   DISPLAY RECENT HISTORY
========================= */

function displayRecentHistory(history) {

    const container =
        document.getElementById(
            "historyContainer"
        );


    if (!history.length) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    📂
                </div>

                <p>
                    No prediction history available.
                </p>
            </div>
        `;

        return;
    }


    const recent =
        history.slice(0, 10);


    let html = `

        <table>

            <thead>

                <tr>

                    <th>#</th>

                    <th>Crop</th>

                    <th>Disease</th>

                    <th>Confidence</th>

                    <th>Date & Time</th>

                    <th>Status</th>

                </tr>

            </thead>

            <tbody>
    `;


    recent.forEach((item, index) => {

        const crop =
            formatName(
                item.crop
            );


        const disease =
            formatName(
                item.disease ||
                item.predicted_class
            );


        const confidence =
            Number(item.confidence);


        const confidenceText =
            Number.isFinite(confidence)
                ? `${confidence.toFixed(1)}%`
                : "N/A";


        const healthy =
            isHealthy(item);


        const status =
            healthy
                ? "Healthy"
                : "Diseased";


        const statusClass =
            healthy
                ? "healthy"
                : "diseased";


        html += `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(crop)}
                </td>

                <td>
                    ${escapeHTML(disease)}
                </td>

                <td class="confidence">
                    ${confidenceText}
                </td>

                <td>
                    ${formatDate(item.date)}
                </td>

                <td class="${statusClass}">
                    ${status}
                </td>

            </tr>
        `;
    });


    html += `

            </tbody>

        </table>
    `;


    container.innerHTML = html;
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================
   REFRESH DASHBOARD
========================= */

function refreshDashboard() {

    const history =
        getHistory();


    updateStats(history);

    updateHighlights(history);

    createDiseaseChart(history);

    createCropChart(history);

    displayRecentHistory(history);
}


/* =========================
   CLEAR DATA
========================= */

function clearData() {

    const history =
        getHistory();


    if (!history.length) {

        alert(
            "No prediction history to clear."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete all prediction history?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        HISTORY_KEY
    );


    refreshDashboard();


    alert(
        "Prediction history cleared successfully."
    );
}


/* =========================
   BACK TO MAIN PAGE
========================= */

function goBack() {

    window.location.href =
        "./index.html";
}


/* =========================
   BUTTON EVENTS
========================= */

document
    .getElementById("refreshBtn")
    .addEventListener(
        "click",
        refreshDashboard
    );


document
    .getElementById("clearBtn")
    .addEventListener(
        "click",
        clearData
    );


document
    .getElementById("backBtn")
    .addEventListener(
        "click",
        goBack
    );


/* =========================
   STORAGE EVENT
========================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === HISTORY_KEY
        ) {

            refreshDashboard();
        }
    }
);


/* =========================
   INITIAL LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        refreshDashboard();
    }
);
