const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
  });

app.post('/watermark', async function (req, res) {
  const { text } = req.body
  const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
  if (text.match(reg)) {
    const url = text.match(reg)[0]
    console.log(15, url);
    const data = await axios.get(url)
    let redirectUrl = data.request.res.responseUrl
    if (!redirectUrl) {
      return;
    }
    redirectUrl =  'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=' + redirectUrl.split('/?region')[0].split('video/')[1]
    console.log(19, redirectUrl);
    const resp = await axios.get(redirectUrl)
    let urls = resp.data.item_list[0].video.play_addr.url_list[0]
    if (urls) {
      urls = urls.replace('playwm', 'play')
    }
    console.log(25, urls);
    res.json({
      respCode: 200,
      respData: urls
    })
  }
})

app.listen(3000, () => console.log('Example app listening on port 3000! http://127.0.0.1:3000'))