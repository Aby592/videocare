import { useEffect, useState } from 'react'
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
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!selectedImage) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedImage(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('lightbox-open')

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('lightbox-open')
    }
  }, [selectedImage])

  const cards = imageFiles.map((image) => {
    const details = cardDetails[image.fileName]
    const title = details?.title ?? getImageTitle(image.fileName)

    return {
      ...details,
      image: image.src,
      title,
      alt: details?.alt ?? title,
      fileName: image.fileName,
    }
  })

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCards = cards.filter((card) =>
    `${card.title} ${card.fileName}`.toLowerCase().includes(normalizedQuery),
  )

  return (
    <>
      <nav className="nav" aria-label="Primary navigation">
        <div className="nav-content">
          <h1 className="nav-heading">Video Care</h1>
          <label className="search-box">
            <span className="visually-hidden">Search images</span>
            <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
            </svg>
            <input
              type="search"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
        </div>
      </nav>
      <main className="page-content">
        <section className="card-grid" aria-label="Explore what you can create">
          {filteredCards.map((card) => (
            <article className="card" key={card.title}>
              <button
                className="image-trigger"
                type="button"
                aria-label={`View ${card.alt}`}
                onClick={() => setSelectedImage(card)}
              >
                <img className="card-image" src={card.image} alt={card.alt} />
              </button>
              <div className="card-copy">
                <h2>{card.title}</h2>
              </div>
            </article>
          ))}
        </section>
        {filteredCards.length === 0 && (
          <p className="empty-state">No images found for “{searchQuery.trim()}”.</p>
        )}
      </main>
      {selectedImage && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setSelectedImage(null)}
        >
          <img
            className="lightbox-image"
            src={selectedImage.image}
            alt={selectedImage.alt}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
