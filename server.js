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
    redirectUrl = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=' + redirectUrl.split('/?region')[0].split('video/')[1]
    console.log(19, redirectUrl);
    const resp = await axios.get(redirectUrl)
    let urls = resp.data.item_list[0].video.play_addr.url_list[0]
    console.log(33, urls);
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

app.post('/ksVideo', async function (req, res) {
  const { text } = req.body
  const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/g
  if (text.match(reg)) {
    const url = text.match(reg)[0]
    const data = await axios.get(url)
    // console.log(50, data);
    let redirectUrl = data.request.res.responseUrl
    let hotoId = redirectUrl.substring(redirectUrl.indexOf('hotoId=') + 7, redirectUrl.indexOf('&shareId'))
    if (hotoId) {
      const headers = {
        "Cookie": "did=web_fd7cf10cb70649ef931861163d36e065; didv=1618281519000; kpf=PC_WEB; kpn=KUAISHOU_VISION; clientid=3; ktrace-context=1|MS43NjQ1ODM2OTgyODY2OTgyLjIzMjQ1MjI4LjE2MTg0NzAzODYwMjguMzczNDQ=|MS43NjQ1ODM2OTgyODY2OTgyLjk3MjczNDgxLjE2MTg0NzAzODYwMjguMzczNDU=|0|graphql-server|webservice|false|NA",
        "Referer": redirectUrl,
      }
      
      const req = {
        "operationName": "visionVideoDetail",
        "query": "query visionVideoDetail($photoId: String, $type: String, $page: String, $webPageArea: String) {  visionVideoDetail(photoId: $photoId, type: $type, page: $page, webPageArea: $webPageArea) {    status    type    author {      id      name      following      headerUrl      __typename    }    photo {      id      duration      caption      likeCount      realLikeCount      coverUrl      photoUrl      liked      timestamp      expTag      llsid      viewCount      videoRatio      stereoType      manifest {        mediaType        businessType        version        adaptationSet {          id          duration          representation {            id            defaultSelect            backupUrl            codecs            url            height            width            avgBitrate            maxBitrate            m3u8Slice            qualityType            qualityLabel            frameRate            featureP2sp            hidden            disableAdaptive            __typename          }          __typename        }        __typename      }      __typename    }    tags {      type      name      __typename    }    commentLimit {      canAddComment      __typename    }    llsid    __typename  }}",
        "variables": {
          "photoId": hotoId,
          "page": "detail",
          "utmCampaign": "app_share",
          "utmMedium": "app_share",
          "utmSource": "app_share",
          "pcursor": ""
        }
      }
      const resp = await axios({
        method: 'post',
        headers,
        url: 'https://video.kuaishou.com/graphql',
        data: req
      })
      const ksUrl = resp.data.data.visionVideoDetail.photo.photoUrl
      res.json({
        respCode: 200,
        respData: ksUrl
      })
    }
  }
})

app.listen(3000, () => console.log('Example app listening on port 3000! http://127.0.0.1:3000'))