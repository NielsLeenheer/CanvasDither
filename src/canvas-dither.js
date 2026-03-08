/**
 * Use the ImageData from a Canvas and turn the image in a 1-bit black and white image using dithering
 */
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
     * Change the image to blank and white using the Floyd-Steinberg algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  floydsteinberg(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 16);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error * 7;
      luminance[l + width - 1] += error * 3;
      luminance[l + width] += error * 5;
      luminance[l + width + 1] += error * 1;
    }

    return image;
  }

  /**
     * Change the image to blank and white using the Atkinson algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  atkinson(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 8);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error;
      luminance[l + 2] += error;
      luminance[l + width - 1] += error;
      luminance[l + width] += error;
      luminance[l + width + 1] += error;
      luminance[l + 2 * width] += error;
    }

    return image;
  }

  /**
     * Change the image to black and white using the Stucki algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  stucki(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 42);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error * 8;
      luminance[l + 2] += error * 4;
      luminance[l + width - 2] += error * 2;
      luminance[l + width - 1] += error * 4;
      luminance[l + width] += error * 8;
      luminance[l + width + 1] += error * 4;
      luminance[l + width + 2] += error * 2;
      luminance[l + 2 * width - 2] += error * 1;
      luminance[l + 2 * width - 1] += error * 2;
      luminance[l + 2 * width] += error * 4;
      luminance[l + 2 * width + 1] += error * 2;
      luminance[l + 2 * width + 2] += error * 1;
    }

    return image;
  }

  /**
     * Change the image to black and white using the Burkes algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  burkes(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 32);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error * 8;
      luminance[l + 2] += error * 4;
      luminance[l + width - 2] += error * 2;
      luminance[l + width - 1] += error * 4;
      luminance[l + width] += error * 8;
      luminance[l + width + 1] += error * 4;
      luminance[l + width + 2] += error * 2;
    }

    return image;
  }

  /**
     * Change the image to black and white using the Jarvis-Judice-Ninke algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  jarvisjudiceninke(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 48);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error * 7;
      luminance[l + 2] += error * 5;
      luminance[l + width - 2] += error * 3;
      luminance[l + width - 1] += error * 5;
      luminance[l + width] += error * 7;
      luminance[l + width + 1] += error * 5;
      luminance[l + width + 2] += error * 3;
      luminance[l + 2 * width - 2] += error * 1;
      luminance[l + 2 * width - 1] += error * 3;
      luminance[l + 2 * width] += error * 5;
      luminance[l + 2 * width + 1] += error * 3;
      luminance[l + 2 * width + 2] += error * 1;
    }

    return image;
  }

  /**
     * Change the image to black and white using the Sierra algorithm (Sierra-3)
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  sierra(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 32);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error * 5;
      luminance[l + 2] += error * 3;
      luminance[l + width - 2] += error * 2;
      luminance[l + width - 1] += error * 4;
      luminance[l + width] += error * 5;
      luminance[l + width + 1] += error * 4;
      luminance[l + width + 2] += error * 2;
      luminance[l + 2 * width - 1] += error * 2;
      luminance[l + 2 * width] += error * 3;
      luminance[l + 2 * width + 1] += error * 2;
    }

    return image;
  }

  /**
     * Change the image to black and white using the Two-row Sierra algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  sierra2(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 16);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error * 4;
      luminance[l + 2] += error * 3;
      luminance[l + width - 2] += error * 1;
      luminance[l + width - 1] += error * 2;
      luminance[l + width] += error * 3;
      luminance[l + width + 1] += error * 2;
      luminance[l + width + 2] += error * 1;
    }

    return image;
  }

  /**
     * Change the image to black and white using the Sierra Lite algorithm
     *
     * @param  {object}   image         The imageData of a Canvas 2d context
     * @return {object}                 The resulting imageData
     *
     */
  sierralite(image) {
    const width = image.width;
    const luminance = new Uint8ClampedArray(image.width * image.height);

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      luminance[l] = (image.data[i] * 0.299) + (image.data[i + 1] * 0.587) + (image.data[i + 2] * 0.114);
    }

    for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
      const value = luminance[l] < 129 ? 0 : 255;
      const error = Math.floor((luminance[l] - value) / 4);
      image.data.fill(value, i, i + 3);

      luminance[l + 1] += error * 2;
      luminance[l + width - 1] += error * 1;
      luminance[l + width] += error * 1;
    }

    return image;
  }
}

module.exports = new CanvasDither();
