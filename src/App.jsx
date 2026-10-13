import imageFiles from 'virtual:public-images'

const cardDetails = {
  'direction.svg': {
    title: 'Find your direction',
    alt: 'Abstract orange sun above layered hills',
  },
  'create.svg': {
    title: 'Make it real',
    alt: 'Colorful geometric shapes arranged like a creative toolkit',
  },
  'refine.svg': {
    title: 'Explore the details',
    alt: 'Soft blue and green circles in a playful composition',
  },
  'launch.svg': {
    title: 'Share what’s next',
    alt: 'A bright paper plane flying through a warm sky',
  },
}

function getImageTitle(fileName) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function App() {
  const cards = imageFiles.map((image) => {
    const details = cardDetails[image.fileName]
    const title = details?.title ?? getImageTitle(image.fileName)

    return {
      ...details,
      image: image.src,
      title,
      alt: details?.alt ?? title,
    }
  })

  return (
    <>
      <nav className="nav" aria-label="Primary navigation">
        <h1 className="nav-heading">Video Care</h1>
      </nav>
      <main className="page-content">
        <section className="card-grid" aria-label="Explore what you can create">
          {cards.map((card) => (
            <article className="card" key={card.title}>
              <img className="card-image" src={card.image} alt={card.alt} />
              <div className="card-copy">
                <h2>{card.title}</h2>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}
