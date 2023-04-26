const fetch = require('node-fetch');
const { JSDOM } = require("jsdom");
const sharp = require('sharp');


const url = 'https://news.google.com/rss/articles/CBMiKGh0dHBzOi8vc3BlY3RydW0uaWVlZS5vcmcvZmluZ2VyLWhhcHRpY3PSATdodHRwczovL3NwZWN0cnVtLmllZWUub3JnL2FtcC9maW5nZXItaGFwdGljcy0yNjU5ODg5Mjk5?oc=5';

function fetchAndCropImage(url) {
    return fetch(url)
      .then(response => response.buffer())
      .then(buffer => {
        return sharp(buffer)
          .resize(200, 200, {
            fit: 'cover',
            position: 'center',
          })
          .toBuffer()
          .then(croppedImgBuffer => {
            const croppedImgDataUrl = `data:image/jpeg;base64,${croppedImgBuffer.toString('base64')}`;
            return croppedImgDataUrl;
          });
      })
      .catch(error => {
        console.log(error);
      });
  }
  


function queryMetaElement(doc, str, prop) {
    const obj = doc.querySelector('meta['+prop+'="'+str+'"]');
    if (obj != null) {
        return obj.getAttribute('content');
    }
    return null;
}

function fetchRedirectLink(url) {
    fetch(url)
    .then(response => response.text())
    .then(data => {
        var resurl =""
        const regex = /<a href="(.*?)"/;
        const match = data.match(regex);
        if (match) {
            resurl = match[1];
        } else {
            console.log('No URL found in HTML');
        }

        console.log(resurl)
        fetch(resurl)
        .then(response => response.text())
            .then(html => {
            const dom = new JSDOM(html, { includeNodeLocations: true });
            const doc = dom.window.document;

            const twitterimg_meta_name_query_str = "twitter:image";
            const tags_meta_name_query_str = "parsely-tags";
            const description_meta_name_query_str = "description";
            const keywords_meta_name_query_str = "keywords";

            const type_meta_property_query_str = "og:type";
            const sitename_meta_property_query_str = "og:site_name";
            const image_meta_property_query_str = "og:image";
            const title_meta_property_query_str = "og:title";
            const description_meta_property_query_str = "og:description";
            const pubdate_meta_property_query_str = "article:published_time";
            
                const m_img_twitter = queryMetaElement(doc, twitterimg_meta_name_query_str, "name");
                const m_tags = queryMetaElement(doc, tags_meta_name_query_str, "name");
                const m_description = queryMetaElement(doc, description_meta_name_query_str, "name");
                const m_keywords = queryMetaElement(doc, keywords_meta_name_query_str, "name");

                const m_img = queryMetaElement(doc, image_meta_property_query_str, "property");
                const m_type = queryMetaElement(doc, type_meta_property_query_str, "property");
                const m_sitename = queryMetaElement(doc, sitename_meta_property_query_str, "property");
                const m_title = queryMetaElement(doc, title_meta_property_query_str, "property");
                const m_ogdescription = queryMetaElement(doc, description_meta_property_query_str, "property");
                const m_pubdate = queryMetaElement(doc, pubdate_meta_property_query_str, "property");
                
                console.log("m_img_twitter", m_img_twitter)
                console.log("m_tags", m_tags)
                console.log("m_description", m_description)
                console.log("m_keywords", m_keywords)
                console.log("m_img", m_img)
                console.log("m_type", m_type)
                console.log("m_sitename", m_sitename)
                console.log("m_title", m_title)
                console.log("m_ogdescription", m_ogdescription)
                console.log("m_pubdate", m_pubdate)

                fetchAndCropImage(m_img)
                .then(croppedImgDataUrl => {
                console.log(croppedImgDataUrl); // use this data URL for further processing
                });
            
        })
    })
    .catch(error => console.error(error));

}


// fetchRedirectLink(url)

module.exports = { fetchMetaData };
