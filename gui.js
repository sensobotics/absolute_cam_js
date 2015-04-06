var cv = require('opencv');

var lineColor = [0, 255, 0];
var lineThickness = 2;

var window = new cv.NamedWindow('Video', 0);
var windowAnalysis = new cv.NamedWindow('Analysis', 0);
var camera = new cv.VideoCapture(0);

var init = function () {
  setInterval(function () {
    camera.read(function (err, image) {
      if (err) {
        throw err;
      }
      if (image.size()[0] > 0 && image.size()[1] > 0) {
        image = image.flip(1);
        var analysis = image.clone();
        analysis.convertGrayscale();
        analysis.canny(5, 300);

        var rho = 1;
        var theta = Math.PI/180 * 1;
        var threshold = 1;
        var minLineLength = 30;
        var maxLineGap = 10;
        var lines = analysis.houghLinesP(rho, theta, threshold, minLineLength, maxLineGap);
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i];
          image.line([line[0], line[1]], [line[2], line[3]], lineColor, lineThickness);
        }
        window.show(image);
        windowAnalysis.show(analysis);
      }
      window.blockingWaitKey(0, 50);
      windowAnalysis.blockingWaitKey(0, 50);
    });
  }, 1000 / 10);
};

init();
