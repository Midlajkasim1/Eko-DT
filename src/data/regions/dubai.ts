import { builtinHash } from './paths'
import type { MapRegion } from './types'

const render = (name: string) => builtinHash('dubai', name)

/** Every quad is an exact XYZ tile rectangle, so levels nest and align by construction.
 *  Only the overview fades out; sites stack so zooming never exposes a seam. */
export const DUBAI: MapRegion = {
  id: 'dubai',
  name: 'Dubai',
  country: 'United Arab Emirates',
  camera: { center: [55.161, 25.131], zoom: 12.35, bearing: 0, pitch: 0 },
  renders: [
    {
      id: 'dubai-overview',
      hash: render('overview'),
      grid: { z: 13, x: 5348, y: 3502, w: 8, h: 6 },
      coordinates: [
        [55.01953125, 25.24469595],
        [55.37109375, 25.24469595],
        [55.37109375, 25.00597266],
        [55.01953125, 25.00597266],
      ],
      fadeOut: [12.9, 13.6],
    },
    {
      id: 'dubai-palm-l1',
      hash: render('palm-jumeirah/l1'),
      coordinates: [
        [55.10742, 25.14528],
        [55.17334, 25.14528],
        [55.17334, 25.0856],
        [55.10742, 25.0856],
      ],
      fadeIn: [12.9, 13.5],
    },
    {
      id: 'dubai-palm-l2',
      hash: render('palm-jumeirah/l2'),
      coordinates: [
        [55.12390137, 25.12539261],
        [55.14587402, 25.12539261],
        [55.14587402, 25.10549737],
        [55.12390137, 25.10549737],
      ],
      fadeIn: [14.9, 15.5],
    },
    {
      id: 'dubai-palm-l3',
      hash: render('palm-jumeirah/l3'),
      coordinates: [
        [55.12939453, 25.1216625],
        [55.1348877, 25.1216625],
        [55.1348877, 25.11668884],
        [55.12939453, 25.11668884],
      ],
      fadeIn: [16.5, 17.1],
    },
  ],
}
