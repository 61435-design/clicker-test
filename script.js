let clicks = 0;
let totalClicks = 0;
let multiplier = 1;
let clickPower = 1;
let autoClickers = 0;
let autoInterval;
let upgradeCount = [];
let rebirthCount = 0;
let rebirthMultiplier = 1;

let autoRebirthEnabled = false;
let automationEnabled = true;

const prefixes = ["M", "B", "T", "Q", "q", "s", "S", "Oc", "N", "D", "UD", "DD", "TD", "QD", "qD", "sD", "SD", "OcD", "ND", "V", "UV", "DV", "TV", "QV", "qV", "sV", "SV", "OcV", "NV", "Tr", "UTr", "DTr", "TTr", "QTr", "qTr", "sTr", "STr", "OcTr", "NTr", "Quadragontillion"];

const worlds = [
    { name: "Earth", multiplier: 1 },
    { name: "Mars", multiplier: 2 },
    { name: "Jupiter", multiplier: 4 },
    { name: "Saturn", multiplier: 10 },
    { name: "Neptune", multiplier: 20 },
    { name: "Galaxy", multiplier: 50 }
];

let currentWorld = 0;

function formatNumber(num) {
    let tier = Math.floor((("" + num).length - 1) / 3);
    if (tier === 0) return num.toString();
    let scale = Math.pow(10, tier * 3);
    return (num / scale).toFixed(2) + (prefixes[tier - 1] || "∞");
}

function initUpgrades() {
    const upgradeList = document.getElementById("upgradeList");
    for (let i = 0; i < 100; i++) {
        upgradeCount[i] = 0;
        let btn = document.createElement("button");
        btn.onclick = () => buyUpgrade(i);
        upgradeList.appendChild(btn);
    }
}

function initWorlds() {
    const worldList = document.getElementById("worldList");
    worlds.forEach((world, index) => {
        let btn = document.createElement("button");
        btn.innerText = world.name + " (" + world.multiplier + "×)";
        btn.onclick = () => changeWorld(index);
        worldList.appendChild(btn);
    });
}

function buyUpgrade(index) {
    let cost = 10 * (index + 1) * Math.pow(1.1, upgradeCount[index]);
    if (clicks >= cost) {
        clicks -= cost;
        upgradeCount[index]++;
        clickPower += 1;
        playClickSound();
        render();
    }
}

function buyAutoClicker() {
    let cost = 100 * Math.pow(1.1, autoClickers);
    if (clicks >= cost) {
        clicks -= cost;
        autoClickers++;
        if (!autoInterval) startAutoClickers();
        playClickSound();
        render();
    }
}

function startAutoClickers() {
    autoInterval = setInterval(() => {
        if (automationEnabled) {
            clicks += clickPower * multiplier * autoClickers;
            totalClicks += clickPower * multiplier * autoClickers;
            render();
        }
        if (autoRebirthEnabled && clicks >= 1000) rebirth(true);
    }, 1000);
}

function changeWorld(index) {
    currentWorld = index;
    multiplier = worlds[currentWorld].multiplier * rebirthMultiplier;
    render();
}

function rebirth(isAuto = false) {
    if (clicks >= 1000 || isAuto) {
        clicks = 0;
        totalClicks = 0;
        rebirthCount++;
        rebirthMultiplier = Math.pow(10, rebirthCount + 1);
        multiplier = worlds[currentWorld].multiplier * rebirthMultiplier;
        clickPower = 1;
        upgradeCount = Array(100).fill(0);
        playClickSound();
        render();
    } else {
        if (!isAuto) alert("You need at least 1000 clicks to rebirth!");
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
    document.getElementById("currentWorld").innerText = worlds[currentWorld].name;
    document.getElementById("rebirthCount").innerText = rebirthCount;
    document.getElementById("rebirthMultiplier").innerText = rebirthMultiplier + "×";
    document.getElementById("clickPowerDisplay").innerText = clickPower;

    const upgradeButtons = document.querySelectorAll("#upgradeList button");
    upgradeButtons.forEach((btn, i) => {
        let cost = 10 * (i + 1) * Math.pow(1.1, upgradeCount[i]);
        btn.innerText = `Upgrade ${i + 1} (Cost: ${formatNumber(cost)})`;
        if (clicks < cost) {
            btn.classList.add("disabled");
            btn.disabled = true;
        } else {
            btn.classList.remove("disabled");
            btn.disabled = false;
        }
    });
}

document.getElementById("clickBtn").onclick = () => {
    clicks += clickPower * multiplier;
    totalClicks += clickPower * multiplier;
    playClickSound();
    render();
};

document.getElementById("buyAuto").onclick = buyAutoClicker;
document.getElementById("rebirthBtn").onclick = () => rebirth(false);

document.getElementById("automationToggle").onchange = (e) => {
    automationEnabled = e.target.checked;
};

document.getElementById("autoRebirthToggle").onchange = (e) => {
    autoRebirthEnabled = e.target.checked;
};

document.querySelectorAll(".multipliers button").forEach(btn => {
    btn.onclick = () => {
        multiplier *= parseInt(btn.dataset.multiplier);
        playClickSound();
        render();
    };
});

initUpgrades();
initWorlds();
render();
startAutoClickers();
