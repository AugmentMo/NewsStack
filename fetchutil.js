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
    return fetch(url)
    .then(response => response.text())
    .then(data => {
        var resurl = undefined
        const regex = /<a href="(.*?)"/;
        const match = data.match(regex);
        if (match) {
            resurl = match[1];
            console.log(resurl)
        } else {
            console.log('No URL found in HTML');
        }

        return resurl
    })
    .catch(error => console.error(error));

}

function fetchMetaData(url) {
    return fetch(url)
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
                
                var metadata = {
                "m_img_twitter" : m_img_twitter,
                "m_tags" : m_tags,
                "m_description" : m_description,
                "m_keywords" : m_keywords,
                "m_img" : m_img,
                "m_type" : m_type,
                "m_sitename" : m_sitename,
                "m_title" : m_title,
                "m_ogdescription" : m_ogdescription,
                "m_pubdate": m_pubdate,
                "m_url": url
                }
                // console.log(metadata)
                return metadata;
        })
}

async function getNewsFeedImage(googlenewslink) {
    return fetchRedirectLink(googlenewslink)
        .then(redirectedlink => {
            if (redirectedlink != undefined) {
                return fetchMetaData(redirectedlink);
            }
            else {
                return undefined;
            }    
        })
        .then(metadata => {
            if (metadata != undefined) {
                if (metadata["m_img"]) {
                    return fetchAndCropImage(metadata["m_img"]);
                }
                else {
                    return undefined
                } 
            }
            else {
                return undefined;
            }
        })
    
}

async function getMetaFeedData(googlenewslink) {
    return fetchRedirectLink(googlenewslink)
        .then(redirectedlink => {
            if (redirectedlink != undefined) {
                return fetchMetaData(redirectedlink);
            }
            else {
                return undefined;
            }    
        })
}

// getNewsFeedImage(url).then(metadat => {
//     console.log(" I got ", metadat)
// })

module.exports = { getNewsFeedImage, getMetaFeedData, fetchAndCropImage };
