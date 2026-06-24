const STORAGE_KEY = "civicpulse-quest-pro-missions";

const missionBank = [
  {
    title: "Help someone improve their resume",
    category: "Career Support",
    difficulty: "Easy",
    points: 30,
    hours: 0.5,
    people: 1,
    time: "30 minutes",
    description: "Review a friend’s resume and suggest clearer wording, stronger achievements, and better structure.",
    steps: ["Review the resume structure", "Improve 3 weak bullet points", "Suggest one better layout or section"],
    proof: "Before/after resume notes or short feedback summary"
  },
  {
    title: "Teach one useful digital skill",
    category: "Education",
    difficulty: "Easy",
    points: 25,
    hours: 0.5,
    people: 1,
    time: "20 minutes",
    description: "Teach someone how to use Google Drive, Canva, GitHub, email, or any useful digital tool.",
    steps: ["Pick one useful tool", "Explain the basic steps", "Let the learner try it once"],
    proof: "Short note about what was taught"
  },
  {
    title: "Create a free poster for a small community event",
    category: "Design Help",
    difficulty: "Medium",
    points: 45,
    hours: 1,
    people: 3,
    time: "1 hour",
    description: "Design a simple event poster for a club, community group, school, or small business.",
    steps: ["Collect event details", "Design poster layout", "Send final artwork to organizer"],
    proof: "Poster file or screenshot"
  },
  {
    title: "Help a small business improve its website homepage",
    category: "Technology Help",
    difficulty: "Hard",
    points: 80,
    hours: 2,
    people: 2,
    time: "2 hours",
    description: "Suggest practical improvements for layout, mobile view, call-to-action buttons, and content clarity.",
    steps: ["Review homepage", "List 5 improvement ideas", "Share practical fixes"],
    proof: "Website audit notes"
  },
  {
    title: "Organize a mini clean-up mission",
    category: "Environment",
    difficulty: "Medium",
    points: 50,
    hours: 1,
    people: 4,
    time: "1 hour",
    description: "Clean a small shared space such as a classroom, park area, hostel space, or office corner.",
    steps: ["Choose a small area", "Collect waste safely", "Encourage others to maintain it"],
    proof: "Before/after photo or short note"
  },
  {
    title: "Check in on someone who may need support",
    category: "Wellbeing",
    difficulty: "Easy",
    points: 20,
    hours: 0.25,
    people: 1,
    time: "15 minutes",
    description: "Send a kind message or call someone who may be stressed, lonely, or overwhelmed.",
    steps: ["Message or call the person", "Listen without judging", "Offer one small help"],
    proof: "Private reflection note"
  },
  {
    title: "Donate useful items you no longer use",
    category: "Donation",
    difficulty: "Medium",
    points: 55,
    hours: 1,
    people: 2,
    time: "1 hour",
    description: "Donate clean clothes, books, stationery, food, or devices to someone who can benefit from them.",
    steps: ["Identify useful items", "Clean and prepare items", "Pass to a person or organization"],
    proof: "Donation checklist"
  },
  {
    title: "Create a beginner guide for a topic you know",
    category: "Knowledge Sharing",
    difficulty: "Hard",
    points: 75,
    hours: 2,
    people: 5,
    time: "2 hours",
    description: "Write a simple guide about WordPress, GitHub, design, coding, study tips, or productivity.",
    steps: ["Choose a beginner topic", "Write clear steps", "Share with people who may need it"],
    proof: "Guide link or document"
  },
  {
    title: "Help report a safety or facility issue",
    category: "Community Safety",
    difficulty: "Easy",
    points: 25,
    hours: 0.3,
    people: 3,
    time: "20 minutes",
    description: "Report broken lights, unsafe areas, website issues, broken links, or maintenance problems to the right team.",
    steps: ["Identify issue", "Capture details", "Report to responsible team"],
    proof: "Report message or ticket reference"
  },
  {
    title: "Mentor a beginner developer for one session",
    category: "Mentorship",
    difficulty: "Hard",
    points: 90,
    hours: 2,
    people: 1,
    time: "2 hours",
    description: "Guide a beginner on HTML, CSS, JavaScript, GitHub, portfolio building, or basic programming concepts.",
    steps: ["Ask learner goal", "Explain core concept", "Give one small practice task"],
    proof: "Mentoring summary"
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

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTotalPoints(missions) {
  return missions.reduce((sum, mission) => sum + Number(mission.points || 0), 0);
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
    stats[mission.category] = (stats[mission.category] || 0) + Number(mission.points || 0);
  });

  return Object.entries(stats).sort((a, b) => b[1] - a[1]);
}

function getDifficultyStats(missions) {
  const stats = {};

  missions.forEach(mission => {
    stats[mission.difficulty] = (stats[mission.difficulty] || 0) + 1;
  });

  return Object.entries(stats).sort((a, b) => b[1] - a[1]);
}

function getCurrentStreak(missions) {
  if (missions.length === 0) return 0;

  const uniqueDates = new Set(
    missions.map(mission => new Date(mission.completedAt).toDateString())
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    if (uniqueDates.has(date.toDateString())) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getWeeklyMissions(missions) {
  const now = new Date();

  return missions.filter(mission => {
    const completedDate = new Date(mission.completedAt);
    return now - completedDate <= 7 * 24 * 60 * 60 * 1000;
  });
}

function calculateImpactScore(missions) {
  if (missions.length === 0) return 0;

  let score = 0;
  const totalPoints = getTotalPoints(missions);
  const categories = new Set(missions.map(mission => mission.category)).size;
  const weekly = getWeeklyMissions(missions).length;
  const people = missions.reduce((sum, mission) => sum + Number(mission.people || 0), 0);

  score += Math.min(35, totalPoints / 10);
  score += Math.min(25, categories * 5);
  score += Math.min(20, weekly * 5);
  score += Math.min(20, people * 2);

  return Math.round(Math.min(100, score));
}

function generateMission() {
  const focus = document.getElementById("missionFocus").value;
  const difficulty = document.getElementById("missionDifficulty").value;

  let filtered = missionBank.filter(mission => {
    const focusMatch = focus === "Any" || mission.category === focus;
    const difficultyMatch = difficulty === "Any" || mission.difficulty === difficulty;

    return focusMatch && difficultyMatch;
  });

  if (filtered.length === 0) {
    filtered = missionBank;
  }

  activeMission = filtered[Math.floor(Math.random() * filtered.length)];

  const missionBox = document.getElementById("missionBox");

  missionBox.className = "mission-feature";
  missionBox.innerHTML = `
    <span class="pill">${escapeHTML(activeMission.category)}</span>
    <span class="pill alt">${escapeHTML(activeMission.difficulty)}</span>

    <h3>${escapeHTML(activeMission.title)}</h3>
    <p>${escapeHTML(activeMission.description)}</p>

    <div class="mission-meta">
      <span>${activeMission.points} pts</span>
      <span>${activeMission.time}</span>
      <span>${activeMission.people} people</span>
    </div>

    <strong>Mission Steps</strong>
    <ol class="steps-list">
      ${activeMission.steps.map(step => `<li>${escapeHTML(step)}</li>`).join("")}
    </ol>

    <p><strong>Suggested Proof:</strong> ${escapeHTML(activeMission.proof)}</p>

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
    reflection: "Mission completed from generator.",
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
  const difficulty = document.getElementById("customDifficulty").value;
  const points = Number(document.getElementById("customPoints").value) || 40;
  const people = Number(document.getElementById("customPeople").value) || 1;
  const hours = Number(document.getElementById("customHours").value) || 1;
  const description = document.getElementById("customDescription").value.trim();
  const reflection = document.getElementById("customReflection").value.trim();

  if (!title || !description) {
    alert("Please enter the mission title and description.");
    return;
  }

  const missions = getMissions();

  missions.unshift({
    id: Date.now(),
    title,
    category,
    difficulty,
    points,
    hours,
    people,
    time: `${hours} hour${hours > 1 ? "s" : ""}`,
    description,
    reflection: reflection || "No reflection added.",
    steps: ["Custom mission completed by user."],
    proof: "Custom user record",
    completedAt: new Date().toISOString()
  });

  saveMissions(missions);

  document.getElementById("customTitle").value = "";
  document.getElementById("customPoints").value = 40;
  document.getElementById("customPeople").value = 1;
  document.getElementById("customHours").value = 1;
  document.getElementById("customDescription").value = "";
  document.getElementById("customReflection").value = "";

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

  const headers = ["Title", "Category", "Difficulty", "Points", "People Impacted", "Hours", "Description", "Reflection", "Completed At"];

  const rows = missions.map(mission => [
    mission.title,
    mission.category,
    mission.difficulty,
    mission.points,
    mission.people || 0,
    mission.hours || 0,
    mission.description,
    mission.reflection || "",
    new Date(mission.completedAt).toLocaleString()
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  downloadFile(csv, "civicpulse-impact-missions.csv", "text/csv");
}

function exportJSON() {
  const missions = getMissions();

  if (missions.length === 0) {
    alert("No mission data to export.");
    return;
  }

  downloadFile(
    JSON.stringify(missions, null, 2),
    "civicpulse-impact-missions.json",
    "application/json"
  );
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

function getAIInsight(missions, totalPoints, categoryStats) {
  if (missions.length === 0) {
    return "Start by generating one mission. Choose a small action first to build momentum.";
  }

  const strongestCategory = categoryStats[0]?.[0] || "Community Support";
  const weekly = getWeeklyMissions(missions).length;
  const people = missions.reduce((sum, mission) => sum + Number(mission.people || 0), 0);
  const hours = missions.reduce((sum, mission) => sum + Number(mission.hours || 0), 0);

  if (weekly === 0) {
    return "You have impact history, but no missions recorded this week. Try completing one small mission today.";
  }

  if (totalPoints < 100) {
    return "You are starting well. Try completing 3 small missions this week to unlock your first strong community habit.";
  }

  if (categoryStats.length < 3) {
    return `Your strongest impact area is ${strongestCategory}. Try adding another category to create wider contribution.`;
  }

  if (people >= 10 && hours >= 5) {
    return "Strong community contribution detected. You can turn this into a portfolio case study with clear outcomes.";
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

  filter.innerHTML = categories.map(category => `<option>${escapeHTML(category)}</option>`).join("");

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
  const people = missions.reduce((sum, mission) => sum + Number(mission.people || 0), 0);
  const hours = missions.reduce((sum, mission) => sum + Number(mission.hours || 0), 0);
  const streak = getCurrentStreak(missions);
  const weekly = getWeeklyMissions(missions).length;
  const impactScore = calculateImpactScore(missions);

  document.getElementById("totalPoints").textContent = totalPoints;
  document.getElementById("totalPointsHero").textContent = totalPoints;
  document.getElementById("completedMissions").textContent = missions.length;
  document.getElementById("peopleImpacted").textContent = people;
  document.getElementById("hoursContributed").textContent = `${hours.toFixed(1)}h`;
  document.getElementById("impactCategories").textContent = categoryStats.length;
  document.getElementById("currentStreak").textContent = `${streak} days`;
  document.getElementById("weeklyMissions").textContent = weekly;
  document.getElementById("impactScore").textContent = `${impactScore}%`;

  document.getElementById("currentRank").textContent = rank;
  document.getElementById("rankProgressBar").style.width = `${progressToNext}%`;
  document.getElementById("nextRankText").textContent = `Next Rank: ${nextRank.name}`;
  document.getElementById("aiInsight").textContent = getAIInsight(missions, totalPoints, categoryStats);
  document.getElementById("impactSummary").textContent = generateImpactSummary(missions);
}

function renderStats(containerId, stats, suffix = "pts") {
  const box = document.getElementById(containerId);
  const total = stats.reduce((sum, item) => sum + item[1], 0);

  if (stats.length === 0) {
    box.innerHTML = `<p class="muted">No data yet.</p>`;
    return;
  }

  box.innerHTML = stats.map(([label, value]) => {
    const percentage = total ? Math.round((value / total) * 100) : 0;

    return `
      <div class="bar-row">
        <div>
          <span>${escapeHTML(label)}</span>
          <small>${value} ${suffix}</small>
        </div>
        <div class="bar-bg">
          <div style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderBadges(missions) {
  const box = document.getElementById("badgeList");
  const totalPoints = getTotalPoints(missions);
  const categories = new Set(missions.map(mission => mission.category)).size;
  const people = missions.reduce((sum, mission) => sum + Number(mission.people || 0), 0);
  const weekly = getWeeklyMissions(missions).length;

  const badges = [];

  if (missions.length >= 1) badges.push("First Mission");
  if (missions.length >= 5) badges.push("Consistent Helper");
  if (totalPoints >= 250) badges.push("Impact Builder");
  if (categories >= 3) badges.push("Multi-Category Contributor");
  if (people >= 10) badges.push("Community Supporter");
  if (weekly >= 3) badges.push("Weekly Champion");

  if (badges.length === 0) {
    box.innerHTML = `<span class="muted">No badges unlocked yet.</span>`;
    return;
  }

  box.innerHTML = badges.map(badge => `<span class="unlock-badge">🏅 ${escapeHTML(badge)}</span>`).join("");
}

function generateImpactSummary(missions) {
  if (missions.length === 0) {
    return "Complete missions to generate a meaningful community impact summary.";
  }

  const points = getTotalPoints(missions);
  const people = missions.reduce((sum, mission) => sum + Number(mission.people || 0), 0);
  const hours = missions.reduce((sum, mission) => sum + Number(mission.hours || 0), 0);
  const categories = [...new Set(missions.map(mission => mission.category))];
  const strongestCategory = getCategoryStats(missions)[0]?.[0] || "Community Support";

  return `I completed ${missions.length} community impact mission${missions.length > 1 ? "s" : ""}, contributed ${hours.toFixed(1)} hours, supported around ${people} people, and earned ${points} impact points across ${categories.length} category/categories. My strongest contribution area is ${strongestCategory}.`;
}

function copyImpactSummary() {
  const text = document.getElementById("impactSummary").textContent;

  navigator.clipboard.writeText(text)
    .then(() => alert("Impact summary copied."))
    .catch(() => alert("Unable to copy. You can manually select the summary text."));
}

function printReport() {
  window.print();
}

function renderWeeklyTrend(missions) {
  const box = document.getElementById("weeklyTrend");

  if (missions.length === 0) {
    box.innerHTML = `<p class="muted">No weekly trend yet.</p>`;
    return;
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const stats = days.map(day => ({ day, points: 0 }));

  missions.forEach(mission => {
    const dayIndex = new Date(mission.completedAt).getDay();
    stats[dayIndex].points += Number(mission.points || 0);
  });

  const max = Math.max(...stats.map(item => item.points), 1);

  box.innerHTML = stats.map(item => {
    const height = Math.max(8, Math.round((item.points / max) * 120));

    return `
      <div class="trend-bar" title="${item.day}: ${item.points} pts" style="height: ${height}px">
        <span>${item.day}</span>
      </div>
    `;
  }).join("");
}

function renderHistory(missions) {
  const historyBox = document.getElementById("missionHistory");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("filterCategory").value;
  const difficulty = document.getElementById("filterDifficulty").value;

  let filtered = missions;

  if (filter !== "All") {
    filtered = filtered.filter(mission => mission.category === filter);
  }

  if (difficulty !== "All Difficulty") {
    filtered = filtered.filter(mission => mission.difficulty === difficulty);
  }

  if (search) {
    filtered = filtered.filter(mission => {
      const combined = `${mission.title} ${mission.category} ${mission.description} ${mission.reflection || ""}`.toLowerCase();
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
        <span class="pill">${escapeHTML(mission.category)}</span>
        <span class="pill alt">${escapeHTML(mission.difficulty)}</span>
      </div>

      <h3>${escapeHTML(mission.title)}</h3>
      <p>${escapeHTML(mission.description)}</p>

      <div class="mission-meta">
        <span>${mission.points} pts</span>
        <span>${mission.people || 0} people</span>
        <span>${mission.hours || 0}h</span>
        <span>${new Date(mission.completedAt).toLocaleDateString()}</span>
      </div>

      ${
        mission.reflection
          ? `<p><strong>Reflection:</strong> ${escapeHTML(mission.reflection)}</p>`
          : ""
      }

      <button class="danger full" onclick="deleteMission(${mission.id})">Delete</button>
    </article>
  `).join("");
}

function loadDemoData() {
  const now = Date.now();

  const demoMissions = [
    {
      ...missionBank[1],
      id: now + 1,
      reflection: "Helped a colleague understand GitHub commits and basic repository navigation.",
      completedAt: new Date(now).toISOString()
    },
    {
      ...missionBank[2],
      id: now + 2,
      reflection: "Created a simple event poster and shared it with the organizer.",
      completedAt: new Date(now - 86400000).toISOString()
    },
    {
      ...missionBank[4],
      id: now + 3,
      reflection: "Cleaned a shared workspace and encouraged others to keep it tidy.",
      completedAt: new Date(now - 172800000).toISOString()
    }
  ];

  saveMissions(demoMissions);
  renderApp();
}

function renderApp() {
  const missions = getMissions();

  updateFilterOptions(missions);
  renderDashboard(missions);
  renderStats("categoryStats", getCategoryStats(missions), "pts");
  renderStats("difficultyStats", getDifficultyStats(missions), "missions");
  renderBadges(missions);
  renderWeeklyTrend(missions);
  renderHistory(missions);
}

renderApp();
