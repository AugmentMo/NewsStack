
console.log("request news")

socket.emit("getnews");

socket.on('newsfeeditem', (feed) => {
    // Handle news data here
    console.log("received item: ", feed)
    const container = document.getElementById('news-container-haptics');

    const title = document.createElement('p');
    title.classList.add("card-title");
    title.innerHTML = feed.title;

    const description = document.createElement('p');
    description.classList.add("font-weight-500")
    description.innerHTML = feed.metadescr;

    const url = document.createElement('a');
    url.classList.add("font-weight-500")
    url.innerHTML = 'Read more';
    url.href = feed.linkurl;
    url.target = '_blank';

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('col');
    imageContainer.classList.add('d-flex');
    // imageContainer.classList.add('justify-content-end');
    imageContainer.classList.add('align-self-center');
    if (feed.imagesrc != undefined) {
    imageContainer.innerHTML = '<img src="' + feed.imagesrc + '" alt="' + feed.title + '" style="width: 100px; height: 100px;">';
    }

    const textContainer = document.createElement('div');
    textContainer.classList.add('col');
    textContainer.classList.add('col-lg-8');


    const cardBodyElement = document.createElement('div');
    cardBodyElement.classList.add('card-body');

    cardBodyElement.appendChild(title);
    cardBodyElement.appendChild(description);
    cardBodyElement.appendChild(url);

    textContainer.appendChild(cardBodyElement);

    const rowElement = document.createElement('div');
    rowElement.classList.add('row');
    rowElement.classList.add('justify-content-between');


    const feedElement = document.createElement('p');
    feedElement.href = feed.linkurl;
    feedElement.target = '_blank';
    feedElement.classList.add('card');
    feedElement.classList.add('m-2');

    rowElement.appendChild(textContainer);
    rowElement.appendChild(imageContainer);

    feedElement.appendChild(rowElement);

    container.appendChild(feedElement);

});