# canvas-dither

Black and White dithering for the canvas element

## Usage

First, install the package using npm:

    npm install canvas-dither --save

Then, require the package and use it like so:

    let Dither = require('canvas-dither');

    // Assume we have an existing canvas element with a 2D context
    // Retrieve the image data of the canvas
    let image = context.getImageData(0, 0, canvas.width, canvas.height);

    // Dither the data using the Atkinson algoritm
    image = Dither.atkinson(image);

    // Place the image data back on the canvas
    context.putImageData(image, 0, 0);

This package contains the following algorithms:

### Threshold
A simple threshold which will make all pixels with a luminance over the threshold white and under the threshold black. 

    Dither.threshold(imageData, threshold);

### Bayer
Using a Bayer matrix the image is converted to black and white with a cross-hatch pattern. 
    
    Dither.bayer(imageData, threshold);

### Floyd-Steinberg
Altough there is nothing random about this algorithm, the results looks like a random scattering of dots, making especially photos seem very natural.

    Dither.floydsteinberg(imageData);

### Bill Atkinson
An improved version of the Floyd-Steinberg algorithm created by Bill Atkinson of MacPaint fame. This algorithm creates less noise in almost white backgrounds compared to Floyd-Steinberg, but has more contrast as a result.

    Dither.atkinson(imageData);

### Stucki
An error diffusion algorithm by Peter Stucki that distributes quantization error across a wider area (12 neighboring pixels over 3 rows), producing smoother gradients than Floyd-Steinberg.

    Dither.stucki(imageData);

### Burkes
A simplified version of the Stucki algorithm by Daniel Burkes that uses only 2 rows instead of 3, offering a good balance between quality and performance.

    Dither.burkes(imageData);

### Jarvis, Judice, and Ninke
An error diffusion algorithm that distributes error across 12 neighboring pixels over 3 rows, similar to Stucki but with different weights. Produces high quality results with smooth tonal transitions.

    Dither.jarvisjudiceninke(imageData);

### Sierra
The full Sierra algorithm (Sierra-3) distributes error across 10 neighboring pixels over 3 rows. Produces results comparable to Jarvis-Judice-Ninke but with slightly less computational cost.

    Dither.sierra(imageData);

### Two-row Sierra
A reduced version of the Sierra algorithm that uses only 2 rows, offering faster processing with results similar to Floyd-Steinberg.

    Dither.sierra2(imageData);

### Sierra Lite
The lightest variant of the Sierra family, distributing error to only 3 neighboring pixels. Very fast while still producing acceptable dithering results.

    Dither.sierralite(imageData);


## License

MIT
