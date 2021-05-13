declare const _exports: CanvasDither;
export = _exports;
/**
 * Use the ImageData from a Canvas and turn the image in a 1-bit black and white image using dithering
 */
declare class CanvasDither {
    /**
       * Change the image to grayscale
       *
       * @param  {object}   image         The imageData of a Canvas 2d context
       * @return {object}                 The resulting imageData
       *
       */
    grayscale(image: object): object;
    /**
       * Change the image to blank and white using a simple threshold
       *
       * @param  {object}   image         The imageData of a Canvas 2d context
       * @param  {number}   threshold     Threshold value (0-255)
       * @return {object}                 The resulting imageData
       *
       */
    threshold(image: object, threshold: number): object;
    /**
       * Change the image to blank and white using the Bayer algorithm
       *
       * @param  {object}   image         The imageData of a Canvas 2d context
       * @param  {number}   threshold     Threshold value (0-255)
       * @return {object}                 The resulting imageData
       *
       */
    bayer(image: object, threshold: number): object;
    /**
       * Change the image to blank and white using the Floyd-Steinberg algorithm
       *
       * @param  {object}   image         The imageData of a Canvas 2d context
       * @return {object}                 The resulting imageData
       *
       */
    floydsteinberg(image: object): object;
    /**
       * Change the image to blank and white using the Atkinson algorithm
       *
       * @param  {object}   image         The imageData of a Canvas 2d context
       * @return {object}                 The resulting imageData
       *
       */
    atkinson(image: object): object;
}
