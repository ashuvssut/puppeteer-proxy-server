const express = require("express");
const puppeteer = require("puppeteer");
const absolutify = require("absolutify");

const app = express();

const port = 31337;
app.listen(port, () => console.log(`listening on ${port} bro`));

app.all("/", async (req, res) => {
  // console.log(req);
  const { url } = req.query;
  console.log(url);

  if (!url) {
    return res.send("provide a url");
  } else {
    // puppeteer screenshot
    try {

      // const browser = await puppeteer.launch();

      // for ubuntu VM
      const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });


      const page = await browser.newPage();
      await page.goto(`https://${url}`);

      let document = await page.evaluate(() => document.documentElement.outerHTML);

      //convert all relative urls in the document to absolute (/route to /?url=website.com/route}/)
      document = absolutify(document, `/?url=${url.split("/")[0]}`);

      return res.send(document);
    } catch (err) {
      console.log(err);

      return res.send(err);
    }
  }
});
