declare const _exports: CanvasDither;
export = _exports;
/**
 * Use the ImageData from a Canvas and turn the image in a 1-bit black and white image using dithering
 */
declare class CanvasDither {
    /**
       * Change the image to grayscale
       *
       * @param  {ImageData}   image         The imageData of a Canvas 2d context
       * @return {ImageData}                 The resulting imageData
       *
       */
    grayscale(image: ImageData): ImageData;
    /**
       * Change the image to blank and white using a simple threshold
       *
       * @param  {ImageData}   image         The imageData of a Canvas 2d context
       * @param  {number}   threshold     Threshold value (0-255)
       * @return {ImageData}                 The resulting imageData
       *
       */
    threshold(image: ImageData, threshold: number): ImageData;
    /**
       * Change the image to blank and white using the Bayer algorithm
       *
       * @param  {ImageData}   image         The imageData of a Canvas 2d context
       * @param  {number}   threshold     Threshold value (0-255)
       * @return {ImageData}                 The resulting imageData
       *
       */
    bayer(image: ImageData, threshold: number): ImageData;
    /**
       * Change the image to blank and white using the Floyd-Steinberg algorithm
       *
       * @param  {ImageData}   image         The imageData of a Canvas 2d context
       * @return {ImageData}                 The resulting imageData
       *
       */
    floydsteinberg(image: ImageData): ImageData;
    /**
       * Change the image to blank and white using the Atkinson algorithm
       *
       * @param  {ImageData}   image         The imageData of a Canvas 2d context
       * @return {ImageData}                 The resulting imageData
       *
       */
    atkinson(image: ImageData): ImageData;
}
