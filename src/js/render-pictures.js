export function renderPictures(pictures) {
  return pictures
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a class "gallery-link" href="${largeImageURL}">
  <img class "gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" width="360" height="240"/>
  </a>
  
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</div>
`;
      }
    )
    .join('');
}
