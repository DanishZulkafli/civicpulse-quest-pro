const STORAGE_KEY = "civicpulse-quest-missions";

const missionBank = [
  {
    title: "Help someone improve their resume",
    category: "Career Support",
    difficulty: "Easy",
    points: 30,
    time: "30 minutes",
    description: "Review a friend’s resume and suggest clearer wording, stronger achievements, and better structure."
  },
  {
    title: "Teach one useful digital skill",
    category: "Education",
    difficulty: "Easy",
    points: 25,
    time: "20 minutes",
    description: "Teach someone how to use Google Drive, Canva, GitHub, email, or any useful digital tool."
  },
  {
    title: "Create a free poster for a small community event",
    category: "Design Help",
    difficulty: "Medium",
    points: 45,
    time: "1 hour",
    description: "Design a simple event poster for a club, community group, school, or small business."
  },
  {
    title: "Help a small business improve its website homepage",
    category: "Technology Help",
    difficulty: "Hard",
    points: 80,
    time: "2 hours",
    description: "Suggest practical improvements for layout, mobile view, call-to-action buttons, and content clarity."
  },
  {
    title: "Organize a mini clean-up mission",
    category: "Environment",
    difficulty: "Medium",
    points: 50,
    time: "1 hour",
    description: "Clean a small shared space such as a classroom, park area, hostel space, or office corner."
  },
  {
    title: "Check in on someone who may need support",
    category: "Wellbeing",
    difficulty: "Easy",
    points: 20,
    time: "15 minutes",
    description: "Send a kind message or call someone who may be stressed, lonely, or overwhelmed."
  },
  {
    title: "Donate useful items you no longer use",
    category: "Donation",
    difficulty: "Medium",
    points: 55,
    time: "1 hour",
    description: "Donate clean clothes, books, stationery, food, or devices to someone who can benefit from them."
  },
  {
    title: "Create a beginner guide for a topic you know",
    category: "Knowledge Sharing",
    difficulty: "Hard",
    points: 75,
    time: "2 hours",
    description: "Write a simple guide about WordPress, GitHub, design, coding, study tips, or productivity."
  },
  {
    title: "Help report a safety or facility issue",
    category: "Community Safety",
    difficulty: "Easy",
    points: 25,
    time: "20 minutes",
    description: "Report broken lights, unsafe areas, website issues, broken links, or maintenance problems to the right team."
  },
  {
    title: "Mentor a beginner developer for one session",
    category: "Mentorship",
    difficulty: "Hard",
    points: 90,
    time: "2 hours",
    description: "Guide a beginner on HTML, CSS, JavaScript, GitHub, portfolio building, or basic programming concepts."
  }
];

const ranks = [
  { name: "Starter Citizen", min: 0 },
  { name: "Helpful Neighbor", min: 100 },
  { name: "Community Builder", min: 250 },
  { name: "Impact Leader", min: 500 },
  { name: "Civic Champion", min: 900 },
  { name: "World Changer", min: 1400 }
];

let activeMission = null;

function getMissions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveMissions(missions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missions));
}

function getTotalPoints(missions) {
  return missions.reduce((sum, mission) => sum + mission.points, 0);
}

function getRank(points) {
  return [...ranks].reverse().find(rank => points >= rank.min)?.name || "Starter Citizen";
}

function getNextRank(points) {
  return ranks.find(rank => rank.min > points) || ranks[ranks.length - 1];
}

function getCategoryStats(missions) {
  const stats = {};

  missions.forEach(mission => {
    stats[mission.category] = (stats[mission.category] || 0) + mission.points;
  });

  return Object.entries(stats).sort((a, b) => b[1] - a[1]);
}

function generateMission() {
  activeMission = missionBank[Math.floor(Math.random() * missionBank.length)];

  const missionBox = document.getElementById("missionBox");

  missionBox.className = "mission-feature";
  missionBox.innerHTML = `
    <span class="pill">${activeMission.category}</span>
    <span class="pill alt">${activeMission.difficulty}</span>

    <h3>${activeMission.title}</h3>
    <p>${activeMission.description}</p>

    <div class="mission-meta">
      <span>${activeMission.points} pts</span>
      <span>${activeMission.time}</span>
    </div>

    <button onclick="completeActiveMission()">Mark Mission Completed</button>
    <button class="ghost full" onclick="generateMission()">Generate Another</button>
  `;
}

function completeActiveMission() {
  if (!activeMission) return;

  const missions = getMissions();

  missions.unshift({
    ...activeMission,
    id: Date.now(),
    completedAt: new Date().toISOString()
  });

  saveMissions(missions);
  activeMission = null;

  document.getElementById("missionBox").className = "empty-box";
  document.getElementById("missionBox").innerHTML = `
    <h3>Mission completed</h3>
    <p>Great job. Generate another mission to continue your impact journey.</p>
    <button onclick="generateMission()">Generate Mission</button>
  `;

  renderApp();
}

function addCustomMission() {
  const title = document.getElementById("customTitle").value.trim();
  const category = document.getElementById("customCategory").value;
  const points = Number(document.getElementById("customPoints").value) || 40;

  if (!title) {
    alert("Please enter a custom mission title.");
    return;
  }

  const missions = getMissions();

  missions.unshift({
    id: Date.now(),
    title,
    category,
    difficulty: "Custom",
    points,
    time: "Flexible",
    description: "Custom mission created by user.",
    completedAt: new Date().toISOString()
  });

  saveMissions(missions);

  document.getElementById("customTitle").value = "";
  document.getElementById("customPoints").value = 40;

  renderApp();
}

function deleteMission(id) {
  const confirmed = confirm("Delete this mission from history?");
  if (!confirmed) return;

  const missions = getMissions().filter(mission => mission.id !== id);
  saveMissions(missions);
  renderApp();
}

function resetAll() {
  const confirmed = confirm("Reset all mission history?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  activeMission = null;

  document.getElementById("missionBox").className = "empty-box";
  document.getElementById("missionBox").innerHTML = `
    <h3>No active mission yet</h3>
    <p>Click generate to receive a new community impact challenge.</p>
    <button onclick="generateMission()">Generate Mission</button>
  `;

  renderApp();
}

function exportCSV() {
  const missions = getMissions();

  if (missions.length === 0) {
    alert("No mission data to export.");
    return;
  }

  const headers = ["Title", "Category", "Difficulty", "Points", "Time", "Completed At"];

  const rows = missions.map(mission => [
    mission.title,
    mission.category,
    mission.difficulty,
    mission.points,
    mission.time,
    new Date(mission.completedAt).toLocaleString()
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "civicpulse-impact-missions.csv";
  link.click();

  URL.revokeObjectURL(url);
}

function getAIInsight(missions, totalPoints, categoryStats) {
  if (missions.length === 0) {
    return "Start by generating one mission. Choose a small action first to build momentum.";
  }

  const strongestCategory = categoryStats[0]?.[0] || "Community Support";

  if (totalPoints < 100) {
    return "You are starting well. Try completing 3 small missions this week to unlock your first strong community habit.";
  }

  if (totalPoints < 300) {
    return `Your strongest impact area is ${strongestCategory}. Try balancing it with another category to create wider contribution.`;
  }

  if (totalPoints < 700) {
    return "You are becoming consistent. Consider inviting friends or turning your actions into a mini community campaign.";
  }

  return "Excellent impact level. You can now document your work as a real social good portfolio and inspire others to join.";
}

function updateFilterOptions(missions) {
  const filter = document.getElementById("filterCategory");
  const currentValue = filter.value;
  const categories = ["All", ...new Set(missions.map(mission => mission.category))];

  filter.innerHTML = categories.map(category => `<option>${category}</option>`).join("");

  if (categories.includes(currentValue)) {
    filter.value = currentValue;
  }
}

function renderDashboard(missions) {
  const totalPoints = getTotalPoints(missions);
  const categoryStats = getCategoryStats(missions);
  const rank = getRank(totalPoints);
  const nextRank = getNextRank(totalPoints);
  const progressToNext = nextRank.min === 0 ? 100 : Math.min(100, Math.round((totalPoints / nextRank.min) * 100));

  document.getElementById("totalPoints").textContent = totalPoints;
  document.getElementById("totalPointsHero").textContent = totalPoints;
  document.getElementById("completedMissions").textContent = missions.length;
  document.getElementById("impactCategories").textContent = categoryStats.length;
  document.getElementById("currentRank").textContent = rank;
  document.getElementById("nextRankProgress").textContent = `${progressToNext}%`;
  document.getElementById("rankProgressBar").style.width = `${progressToNext}%`;
  document.getElementById("nextRankText").textContent = `Next Rank: ${nextRank.name}`;
  document.getElementById("aiInsight").textContent = getAIInsight(missions, totalPoints, categoryStats);
}

function renderCategoryStats(missions) {
  const box = document.getElementById("categoryStats");
  const totalPoints = getTotalPoints(missions);
  const categoryStats = getCategoryStats(missions);

  if (categoryStats.length === 0) {
    box.innerHTML = `<p class="muted">No category data yet.</p>`;
    return;
  }

  box.innerHTML = categoryStats.map(([category, points]) => {
    const percentage = Math.round((points / totalPoints) * 100);

    return `
      <div class="bar-row">
        <div>
          <span>${category}</span>
          <small>${points} pts</small>
        </div>
        <div class="bar-bg">
          <div style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderHistory(missions) {
  const historyBox = document.getElementById("missionHistory");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("filterCategory").value;

  let filtered = missions;

  if (filter !== "All") {
    filtered = filtered.filter(mission => mission.category === filter);
  }

  if (search) {
    filtered = filtered.filter(mission => {
      const combined = `${mission.title} ${mission.category} ${mission.description}`.toLowerCase();
      return combined.includes(search);
    });
  }

  if (filtered.length === 0) {
    historyBox.innerHTML = `
      <div class="empty-box wide">
        <h3>No missions found</h3>
        <p>Complete a mission or adjust your search/filter.</p>
      </div>
    `;
    return;
  }

  historyBox.innerHTML = filtered.map(mission => `
    <article class="mission-card">
      <div>
        <span class="pill">${mission.category}</span>
        <span class="pill alt">${mission.difficulty}</span>
      </div>

      <h3>${mission.title}</h3>
      <p>${mission.description}</p>

      <div class="mission-meta">
        <span>${mission.points} pts</span>
        <span>${new Date(mission.completedAt).toLocaleDateString()}</span>
      </div>

      <button class="danger full" onclick="deleteMission(${mission.id})">Delete</button>
    </article>
  `).join("");
}

function renderApp() {
  const missions = getMissions();

  updateFilterOptions(missions);
  renderDashboard(missions);
  renderCategoryStats(missions);
  renderHistory(missions);
}

renderApp();
