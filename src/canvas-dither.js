/**
 * Use the ImageData from a Canvas and turn the image in a 1-bit black and white image using dithering
 */

const DIFFUSION_KERNELS = {
  floydsteinberg: {
    divisor: 16,
    kernel: [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]],
  },
  atkinson: {
    divisor: 8,
    kernel: [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]],
  },
  stucki: {
    divisor: 42,
    kernel: [
      [1, 0, 8], [2, 0, 4],
      [-2, 1, 2], [-1, 1, 4], [0, 1, 8], [1, 1, 4], [2, 1, 2],
      [-2, 2, 1], [-1, 2, 2], [0, 2, 4], [1, 2, 2], [2, 2, 1],
    ],
  },
  burkes: {
    divisor: 32,
    kernel: [
      [1, 0, 8], [2, 0, 4],
      [-2, 1, 2], [-1, 1, 4], [0, 1, 8], [1, 1, 4], [2, 1, 2],
    ],
  },
  jarvisjudiceninke: {
    divisor: 48,
    kernel: [
      [1, 0, 7], [2, 0, 5],
      [-2, 1, 3], [-1, 1, 5], [0, 1, 7], [1, 1, 5], [2, 1, 3],
      [-2, 2, 1], [-1, 2, 3], [0, 2, 5], [1, 2, 3], [2, 2, 1],
    ],
  },
  sierra: {
    divisor: 32,
    kernel: [
      [1, 0, 5], [2, 0, 3],
      [-2, 1, 2], [-1, 1, 4], [0, 1, 5], [1, 1, 4], [2, 1, 2],
      [-1, 2, 2], [0, 2, 3], [1, 2, 2],
    ],
  },
  sierra2: {
    divisor: 16,
    kernel: [
      [1, 0, 4], [2, 0, 3],
      [-2, 1, 1], [-1, 1, 2], [0, 1, 3], [1, 1, 2], [2, 1, 1],
    ],
  },
  sierralite: {
    divisor: 4,
    kernel: [[1, 0, 2], [-1, 1, 1], [0, 1, 1]],
  },
};

class CanvasDither {
  /**
     * Change the image to grayscale
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  grayscale(image) {
    for (let i = 0; i < image.data.length; i += 4) {
      const luminance = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
      image.data.fill(luminance, i, i + 3);
    }

    return image;
  }

  /**
     * Change the image to blank and white using a simple threshold
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @param  {number}   threshold     Threshold value (0-255)
     * @return {object}                 The resulting imageData
     *
     */
  threshold(image, threshold) {
    for (let i = 0; i < image.data.length; i += 4) {
      const luminance = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);

      const value = luminance < threshold ? 0 : 255;
      image.data.fill(value, i, i + 3);
    }

    return image;
  }

  /**
     * Change the image to blank and white using the Bayer algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @param  {number}   threshold     Threshold value (0-255)
     * @return {object}                 The resulting imageData
     *
     */
  bayer(image, threshold) {
    const thresholdMap = [
      [15, 135, 45, 165],
      [195, 75, 225, 105],
      [60, 180, 30, 150],
      [240, 120, 210, 90],
    ];

    for (let i = 0; i < image.data.length; i += 4) {
      const luminance = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);

      const x = i / 4 % image.width;
      const y = Math.floor(i / 4 / image.width);
      const map = Math.floor((luminance + thresholdMap[x % 4][y % 4]) / 2);
      const value = map < threshold ? 0 : 255;
      image.data.fill(value, i, i + 3);
    }

    return image;
  }

  /**
     * Generic error diffusion dithering
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @param  {number}   divisor       Error divisor
     * @param  {Array}    kernel        Array of [dx, dy, weight] tuples
     * @return {object}                 The resulting imageData
     *
     */
  _errorDiffusion(image, divisor, kernel) {
    const width = image.width;
    const height = image.height;
    const luminance = new Int16Array(width * height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / divisor);
      image.data.fill(value, i, i + 3);

      const x = l % width;
      const y = (l - x) / width;

      for (let k = 0; k < kernel.length; k++) {
        const nx = x + kernel[k][0];
        const ny = y + kernel[k][1];
        if (nx >= 0 && nx < width && ny < height) {
          luminance[ny * width + nx] += error * kernel[k][2];
        }
      }
    }

    return image;
  }

  /**
     * Change the image to blank and white using the Floyd-Steinberg algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  floydsteinberg(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.floydsteinberg.divisor,
        DIFFUSION_KERNELS.floydsteinberg.kernel);
  }

  /**
     * Change the image to blank and white using the Atkinson algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  atkinson(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.atkinson.divisor,
        DIFFUSION_KERNELS.atkinson.kernel);
  }

  /**
     * Change the image to black and white using the Stucki algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  stucki(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.stucki.divisor,
        DIFFUSION_KERNELS.stucki.kernel);
  }

  /**
     * Change the image to black and white using the Burkes algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  burkes(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.burkes.divisor,
        DIFFUSION_KERNELS.burkes.kernel);
  }

  /**
     * Change the image to black and white using the Jarvis-Judice-Ninke algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  jarvisjudiceninke(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.jarvisjudiceninke.divisor,
        DIFFUSION_KERNELS.jarvisjudiceninke.kernel);
  }

  /**
     * Change the image to black and white using the Sierra algorithm (Sierra-3)
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  sierra(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.sierra.divisor,
        DIFFUSION_KERNELS.sierra.kernel);
  }

  /**
     * Change the image to black and white using the Two-row Sierra algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  sierra2(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.sierra2.divisor,
        DIFFUSION_KERNELS.sierra2.kernel);
  }

  /**
     * Change the image to black and white using the Sierra Lite algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  sierralite(image) {
    return this._errorDiffusion(image,
        DIFFUSION_KERNELS.sierralite.divisor,
        DIFFUSION_KERNELS.sierralite.kernel);
  }
}

module.exports = new CanvasDither();
