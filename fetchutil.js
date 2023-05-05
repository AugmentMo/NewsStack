const fetch = require('node-fetch');
const { JSDOM } = require("jsdom");
const sharp = require('sharp');
const DOMPurify = require('isomorphic-dompurify');
const { DOMParser } = require('xmldom');


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
        console.error("error: failed fetchAndCropImage");
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
            console.log("redirect url:", resurl)
        } else {
            console.log('No URL found in HTML');
        }

        return resurl
    })
    .catch(error => console.error("error: failed fetchRedirectLink"));

}

function fetchMetaData(url) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            const modhtml = html.replace(/(\s+property="[^"]*)\:([^"]*")/g, '$1-$2').replace(/(\s+name="[^"]*)\:([^"]*")/g, '$1-$2');; // replace : in properties with -

            var cleanhtml = DOMPurify.sanitize(modhtml, {
                ALLOWED_TAGS: ['meta'],
                ALLOWED_ATTR: ["name", "property", "content"],
                WHOLE_DOCUMENT: true
            });
            cleanhtml = cleanhtml.replace(/(\s+property="[^"]*)\-([^"]*")/g, '$1:$2').replace(/(\s+name="[^"]*)\-([^"]*")/g, '$1:$2'); // revert : in properties 

            const dom = new JSDOM(cleanhtml, { includeNodeLocations: true });
            const doc = dom.window.document;

            const twitterimg_meta_name_query_str = "twitter:image"; // twitter:image:src
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


function collectNews(socket, newsfeed) {
    const url = 'https://news.google.com/rss/search?q='+newsfeed["feedkeywordstr"]+'&hl=en-NZ&gl=NZ&ceid=NZ:en';
    fetch(url)
      .then(response => response.text())
      .then(async data => {
          const parser = new DOMParser();
          let relinkdata = data.replace(/<link>/g, "<relink>").replace(/<\/link>/g, "</relink>"); // this is ugly but dompurify sanitieser removes </link> as we are dealing with XML

          const cleanData = DOMPurify.sanitize(relinkdata, {
              ALLOWED_TAGS: ['item', 'title', 'description', 'relink']
          });

        const xml = parser.parseFromString(cleanData, 'text/xml');
        const items = xml.getElementsByTagName('item');
          const maxitem = 10; //items.length;

          for (let i = 0; i < maxitem; i++) {
            let itemnumber = i;
            let title = items[i].getElementsByTagName('title')[0].textContent;
            let description = items[i].getElementsByTagName('description')[0].textContent;
            let linkurl = items[i].getElementsByTagName('relink')[0].textContent;
                
            //////
            let imagesrc = "";
            let metadescr = "";
            let pubdate = "";
                getMetaFeedData(linkurl)
                .then(metadata => {
                    if (metadata != undefined) {
                        if (metadata["m_description"]) {
                            metadescr = metadata["m_description"]
                        }
                        if (metadata["m_url"]) {
                            linkurl = metadata["m_url"]
                        }
                        if (metadata["m_pubdate"]) {
                            pubdate = metadata["m_pubdate"]
                        }
                        if (metadata["m_img"]) {
                            return fetchAndCropImage(metadata["m_img"]);
                        }
                    }
                })
                .then(imagedata => {
                    imagesrc = imagedata;
                    let feedid = newsfeed["feedid"];
                    let feeditem = { itemnumber, feedid, title, description, linkurl, metadescr, imagesrc, pubdate };
                    socket.emit('newsfeeditem', feeditem);
                })
                .catch(error => console.error("could not fetch"));
    
        }
        
      })
      .catch(error => {
        console.error("error: failed fetching newsfeed"+newsfeed);
      });
  
}

module.exports = { collectNews};
