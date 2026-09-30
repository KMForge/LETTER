import image1 from '../assets/images/image1.jpg'
import image2 from '../assets/images/image2.jpg'
import image3 from '../assets/images/image3.jpg'
import image4 from '../assets/images/image4.jpg'
import image5 from '../assets/images/image5.jpg'
import image6 from '../assets/images/6.jpg'
import image7 from '../assets/images/image7.jpg'

export type StoryPhoto = {
  id: string
  src: string
  alt: string
  caption: string
}

// Reorder these entries to change the slideshow. Captions are optional.
// Use unique, stable IDs. Alt text describes the actual image for screen readers.
export const photos: StoryPhoto[] = [
  { id: 'photo-01', src: image1, alt: 'The two of us taking an outdoor selfie under a blue sky, with trees behind us.', caption: '' },
  { id: 'photo-02', src: image2, alt: 'A close-up selfie of us smiling together outdoors at night.', caption: '' },
  { id: 'photo-03', src: image3, alt: 'Our mirror selfie, wearing a blue shirt and a cream crochet top and holding up peace signs.', caption: '' },
  { id: 'photo-04', src: image4, alt: 'A close-up of us together, with a kiss on the forehead.', caption: '' },
  { id: 'photo-05', src: image5, alt: 'The two of us taking a selfie on the sand at night, smiling and holding up peace signs.', caption: '' },
  { id: 'photo-06', src: image6, alt: 'Our mirror selfie sharing a kiss, with a red layer over a cream top.', caption: '' },
  { id: 'photo-07', src: image7, alt: 'A playful close-up selfie of the two of us outdoors at night.', caption: '' },
]

// Independently choose the print attached to the letter here.
// Currently uses your third photo; import a separate photo above to replace it.
export const letterPhoto: StoryPhoto = {
  id: 'letter-photo',
  src: image3,
  alt: 'Our mirror selfie, wearing a blue shirt and a cream crochet top and holding up peace signs, tucked into the letter.',
  caption: '',
}
