let clicks = 0;
let totalClicks = 0;
let multiplier = 1;
let autoClickers = 0;
let autoInterval;
let upgradeCount = [];

const prefixes = ["M", "B", "T", "Q", "q", "s", "S", "Oc", "N", "D", "UD", "DD", "TD", "QD", "qD", "sD", "SD", "OcD", "ND", "V", "UV", "DV", "TV", "QV", "qV", "sV", "SV", "OcV", "NV", "Tr", "UTr", "DTr", "TTr", "QTr", "qTr", "sTr", "STr", "OcTr", "NTr", "Quadragontillion"];

function formatNumber(num) {
    let tier = Math.floor((("" + num).length - 1) / 3);
    if (tier === 0) return num.toString();
    let scale = Math.pow(10, tier * 3);
    return (num / scale).toFixed(2) + prefixes[tier - 1] || "∞";
}

function initUpgrades() {
    const upgradeList = document.getElementById("upgradeList");
    for (let i = 0; i < 100; i++) {
        upgradeCount[i] = 0;
        let btn = document.createElement("button");
        btn.innerText = `Upgrade ${i + 1} (Cost: ${formatNumber(10 * (i+1))})`;
        btn.onclick = () => buyUpgrade(i);
        upgradeList.appendChild(btn);
    }
}

function buyUpgrade(index) {
    let cost = 10 * (index + 1) * Math.pow(1.1, upgradeCount[index]);
    if (clicks >= cost) {
        clicks -= cost;
        upgradeCount[index]++;
        multiplier += 0.01; // slight increase
        playClickSound();
        render();
    }
}

function buyAutoClicker() {
    let cost = 100 * Math.pow(1.1, autoClickers);
    if (clicks >= cost) {
        clicks -= cost;
        autoClickers++;
        if (!autoInterval) {
            autoInterval = setInterval(() => {
                clicks += multiplier;
                totalClicks += multiplier;
                render();
            }, 1000);
        }
        playClickSound();
        render();
    }
}

function playClickSound() {
    const sound = document.getElementById("clickSound");
    sound.currentTime = 0;
    sound.play();
}

function render() {
    document.getElementById("clickCount").innerText = formatNumber(clicks);
    document.getElementById("totalClicks").innerText = formatNumber(totalClicks);
    document.getElementById("currentMultiplier").innerText = multiplier.toFixed(2) + "×";
    document.getElementById("autoCount").innerText = autoClickers;
}

document.getElementById("clickBtn").onclick = () => {
    clicks += multiplier;
    totalClicks += multiplier;
    playClickSound();
    render();
};

document.getElementById("buyAuto").onclick = buyAutoClicker;

document.querySelectorAll(".multipliers button").forEach(btn => {
    btn.onclick = () => {
        multiplier *= parseInt(btn.dataset.multiplier);
        playClickSound();
        render();
    };
});

initUpgrades();
render();
