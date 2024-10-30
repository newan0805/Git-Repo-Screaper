const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;

const urlBase = "https://github.com/newan0805?tab=repositories";
const dataSet = "https://raw.githubusercontent.com/newan0805/newan0805_bio/refs/heads/main/newan0805_bio.js";


app.get("/", async (req, res) => {
  try {
    const { data: bioData } = await axios(dataSet);
    const { data: html } = await axios(urlBase);
    const $ = cheerio.load(html);
    const dataFromGit = [];

    $(".col-10").each(function () {
      const image = bioData.projects.image;
      const title = $(this).find("a").text().trim().replace(/\s+/g, " ");
      const description = $(this).find("p").text().trim().replace(/\s+/g, " ");
      const link = $(this).find("a").attr("href");

      if (title && link) {
        dataFromGit.push({
          image,
          description,
          title,
          link: `https://github.com${link}`,
        });
      }
    });

    res.json(dataFromGit.length ? dataFromGit : { message: "No repositories found." });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.get("/details", async (req, res) => {
  try {
    const { data } = await axios(dataSet);
    res.json(data);
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ error: "Failed to fetch details." });
  }
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
