const fs = require("fs");

const REMOVE = [
  "heroTitleAccent",
  "heroLead",
  "heroViewShowcase",
  "heroContactSales",
  "heroMetricSecurity",
  "heroMetricPerformance",
  "sliderEyebrow",
  "sliderAriaLabel",
  "sliderNavAria",
  "coverageWallLoss",
  "coverageRecommendedStart",
  "coverageRecommendedText",
  "coverageRecommendedSwitchesText",
];

for (const file of ["messages/en.json", "messages/fr.json", "messages/ar.json"]) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const key of REMOVE) delete data[key];
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

console.log(`Removed ${REMOVE.length} obsolete keys from en/fr/ar.`);
