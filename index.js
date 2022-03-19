const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const cors = require('cors')

const app = express();
app.use(cors())
const PORT = process.env.PORT || 8000;

const urlBase = "https://github.com/newan0805?tab=repositories";

app.get('/', (req, res)=> {
    axios(urlBase)
      .then((getHtml) => {
        const html = getHtml.data;
        const $ = cheerio.load(html);
        const dataFromGit = [];
        $(".col-10", html).each(function () {
          const image =
            "https://img.icons8.com/clouds/500/000000/motivation-daily-quotes.png";
          const title = $(this).find("a").text().replace("\n        ", "");
          const desciption = $(this)
            .find("p")
            .text()
            .replace("\n          ", "")
            .replace("\n        ", "");
          const link = $(this).find("a").attr("href");
          dataFromGit.push({
            image,
            desciption,
            title,
            link,
          });
        });
        // console.log(dataFromGit);
        res.json(dataFromGit);
      })
      .catch((err) => console.log(err));
})

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
