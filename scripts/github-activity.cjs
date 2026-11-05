const { execFileSync } = require("node:child_process");
const { writeFileSync } = require("node:fs");
const { join } = require("node:path");

const query = `query {
  user(login: "gabrielzeballos5432-ops") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount color }
        }
      }
    }
  }
}`;

const response = JSON.parse(execFileSync("gh", ["api", "graphql", "--input", "-"], {
    input: JSON.stringify({ query }),
    encoding: "utf8"
}));
if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
}
const calendar = response.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar || !Number.isInteger(calendar.totalContributions) || !calendar.weeks?.length) {
    throw new Error("GitHub did not return a valid contribution calendar.");
}

const escape = text => String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
}[char]));
const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const width = 64 + calendar.weeks.length * 15;
const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="224" viewBox="0 0 ${width} 224" role="img" aria-labelledby="title description">`,
    `<title id="title">${calendar.totalContributions} contribuciones en el último año</title>`,
    `<desc id="description">Calendario de contribuciones de GitHub. Actualizado el ${new Date().toISOString().slice(0, 10)} (UTC).</desc>`,
    `<rect width="100%" height="100%" rx="12" fill="#15131e"/>`,
    `<g font-family="Segoe UI, sans-serif" font-size="12" fill="#b4adbf">`,
    `<text x="20" y="28" fill="#f3f0fa" font-size="16">${calendar.totalContributions} contribuciones en el último año</text>`
];
let previousMonth = -1;
calendar.weeks.forEach((week, column) => {
    week.contributionDays.forEach(day => {
        const date = new Date(`${day.date}T00:00:00Z`);
        if (!Number.isFinite(date.getTime()) || !Number.isInteger(day.contributionCount) || !/^#[0-9a-f]{6}$/i.test(day.color)) {
            throw new Error("Invalid contribution day returned by GitHub.");
        }
        const month = date.getUTCMonth();
        if (month !== previousMonth) {
            if (column < calendar.weeks.length - 1) {
                parts.push(`<text x="${48 + column * 15}" y="57">${months[month]}</text>`);
            }
            previousMonth = month;
        }
        parts.push(`<rect x="${48 + column * 15}" y="${68 + date.getUTCDay() * 15}" width="12" height="12" rx="2" fill="${day.contributionCount ? day.color : "#24212e"}"><title>${escape(day.date)}: ${day.contributionCount} contribuciones</title></rect>`);
    });
});
["Lun", "Mié", "Vie"].forEach((label, index) => {
    parts.push(`<text x="14" y="${93 + index * 30}">${label}</text>`);
});
parts.push(`<text x="20" y="204">Actualizado: ${new Date().toISOString().slice(0, 10)} · UTC</text>`);
parts.push(`<text x="${width - 164}" y="204">Menos</text>`);
["#24212e", "#0e4429", "#006d32", "#26a641", "#39d353"].forEach((color, index) => {
    parts.push(`<rect x="${width - 119 + index * 15}" y="193" width="12" height="12" rx="2" fill="${color}"/>`);
});
parts.push(`<text x="${width - 36}" y="204">Más</text></g></svg>`);
writeFileSync(join(__dirname, "..", "assets", "github-activity.svg"), parts.join("\n"));
console.log(`Generated calendar: ${calendar.totalContributions} contributions, ${calendar.weeks.length} weeks.`);
