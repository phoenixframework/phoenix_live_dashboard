import uPlot from 'uplot'

// column-highlights the hovered x index
function columnHighlightPlugin({
  className,
  style = {
    backgroundColor: "rgba(51,204,255,0.3)"
  }
} = {}) {
  let underEl, overEl, highlightEl, currIdx;

  function init(u) {
    underEl = u.root.querySelector(".u-under");
    underEl.style.overflow = "visible";
    overEl = u.root.querySelector(".u-over");

    highlightEl = document.createElement("div");

    className && highlightEl.classList.add(className);

    uPlot.assign(highlightEl.style, {
      pointerEvents: "none",
      display: "none",
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      overflow: true,
      ...style
    });

    underEl.appendChild(highlightEl);

    // show/hide highlight on enter/exit
    overEl.addEventListener("mouseenter", () => {
      highlightEl.style.display = null;
    });
    overEl.addEventListener("mouseleave", () => {
      highlightEl.style.display = "none";
    });
  }

  function update(u) {
    if (currIdx !== u.cursor.idx) {
      currIdx = u.cursor.idx;

      const dx = u.scales.x.max - u.scales.x.min;
      let width, left;
      if (dx > 0) {
        width = (u.bbox.width / dx) / devicePixelRatio;
        left = u.valToPos(currIdx, "x") - width / 2;
      } else {
        // just one tag visible
        width = u.bbox.width / devicePixelRatio;
        left = 0;
      }

      highlightEl.style.transform = "translateX(" + Math.round(left) + "px)";
      highlightEl.style.width = Math.round(width) + "px";
    }
  }

  return {
    opts: (u, opts) => {
      uPlot.assign(opts, {
        cursor: {
          x: false,
          y: false,
        }
      });
    },
    hooks: {
      init: init,
      setCursor: update,
    }
  };
}

// converts the legend into a simple tooltip
function legendAsTooltipPlugin({
  className,
  style = {
    backgroundColor: "rgba(255, 249, 196, 0.92)",
    color: "black"
  }
} = {}) {
  let legendEl;

  function init(u, opts) {
    legendEl = u.root.querySelector(".u-legend");

    legendEl.classList.remove("u-inline");
    className && legendEl.classList.add(className);

    uPlot.assign(legendEl.style, {
      textAlign: "left",
      pointerEvents: "none",
      display: "none",
      position: "absolute",
      left: 0,
      top: 0,
      zIndex: 100,
      boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
      ...style
    });

    // hide series color markers
    const idents = legendEl.querySelectorAll(".u-marker");

    for (let i = 0; i < idents.length; i++)
      idents[i].style.display = "none";

    const overEl = u.root.querySelector(".u-over");
    overEl.style.overflow = "visible";

    // move legend into plot bounds
    overEl.appendChild(legendEl);

    // show/hide tooltip on enter/exit
    overEl.addEventListener("mouseenter", () => {
      legendEl.style.display = null;
    });
    overEl.addEventListener("mouseleave", () => {
      legendEl.style.display = "none";
    });

    // let tooltip exit plot
    //	overEl.style.overflow = "visible";
  }

  function update(u) {
    const {
      left,
      top
    } = u.cursor;
    legendEl.style.transform = "translate(" + left + "px, " + top + "px)";
  }

  return {
    hooks: {
      init: init,
      setCursor: update,
    }
  };
}

function boxesPlugin({
  gap = 2,
  style = {
    outlineColor: "#000000",
    fillColor: "#eee"
  },
  bodyWidthFactor = 0.7,
  shadowWidth = 2,
  bodyOutline = 1
} = {}) {

  function drawBoxes(u) {
    u.ctx.save();

    const offset = (shadowWidth % 2) / 2;

    u.ctx.translate(offset, offset);

    for (let i = u.scales.x.min; i <= u.scales.x.max; i++) {
      let med = u.data[1][i];
      let q1 = u.data[2][i];
      let q3 = u.data[3][i];
      let min = u.data[4][i];
      let max = u.data[5][i];

      let timeAsX = u.valToPos(i, "x", true);
      if (isNaN(timeAsX)) {
        // compensate when only one tag in measurements, redraw at center
        timeAsX = (u.width * devicePixelRatio) / 2;
      }
      let lowAsY = u.valToPos(min, "y", true);
      let highAsY = u.valToPos(max, "y", true);
      let openAsY = u.valToPos(q1, "y", true);
      let closeAsY = u.valToPos(q3, "y", true);
      let medAsY = u.valToPos(med, "y", true);

      // shadow rect
      let shadowHeight = Math.max(highAsY, lowAsY) - Math.min(highAsY, lowAsY);
      let shadowX = timeAsX;
      let shadowY = Math.min(highAsY, lowAsY);

      u.ctx.beginPath();
      u.ctx.setLineDash([4, 4]);
      u.ctx.lineWidth = shadowWidth;
      u.ctx.strokeStyle = style.outlineColor;
      u.ctx.moveTo(
        Math.round(shadowX),
        Math.round(shadowY),
      );
      u.ctx.lineTo(
        Math.round(shadowX),
        Math.round(shadowY + shadowHeight),
      );
      u.ctx.stroke();

      // body rect
      // when min = max again compensate
      let divisor = u.scales.x.max == u.scales.x.min ? 3 : (u.scales.x.max - u.scales.x.min)
      let columnWidth = u.bbox.width / divisor;
      let bodyWidth = Math.round(bodyWidthFactor * (columnWidth - gap));
      let bodyHeight = Math.max(closeAsY, openAsY) - Math.min(closeAsY, openAsY);
      let bodyX = timeAsX - (bodyWidth / 2);
      let bodyY = Math.min(closeAsY, openAsY);

      u.ctx.fillStyle = style.fillColor;
      u.ctx.fillRect(
        Math.round(bodyX),
        Math.round(bodyY),
        Math.round(bodyWidth),
        Math.round(bodyHeight),
      );

      u.ctx.fillStyle = style.fillColor;
      u.ctx.fillRect(
        Math.round(bodyX + bodyOutline),
        Math.round(bodyY + bodyOutline),
        Math.round(bodyWidth - bodyOutline * 2),
        Math.round(bodyHeight - bodyOutline * 2),
      );

      // median
      u.ctx.fillStyle = style.outlineColor;
      u.ctx.fillRect(
        Math.round(bodyX),
        Math.round(medAsY - 1),
        Math.round(bodyWidth),
        Math.round(2),
      );

      // hz min/max whiskers
      u.ctx.beginPath();
      u.ctx.setLineDash([]);
      u.ctx.lineWidth = shadowWidth;
      u.ctx.strokeStyle = style.outlineColor;
      u.ctx.moveTo(
        Math.round(bodyX),
        Math.round(highAsY),
      );
      u.ctx.lineTo(
        Math.round(bodyX + bodyWidth),
        Math.round(highAsY),
      );
      u.ctx.moveTo(
        Math.round(bodyX),
        Math.round(lowAsY),
      );
      u.ctx.lineTo(
        Math.round(bodyX + bodyWidth),
        Math.round(lowAsY),
      );
      u.ctx.stroke();

    }

    u.ctx.translate(-offset, -offset);

    u.ctx.restore();
  }

  return {
    opts: (u, opts) => {
      uPlot.assign(opts, {
        cursor: {
          points: {
            show: false,
          }
        }
      });

      opts.series.forEach(series => {
        series.paths = () => null;
        series.points = {
          show: false
        };
      });
    },
    hooks: {
      draw: drawBoxes,
    }
  };
}

export default {
  plugins(options = {}) {
    return [
      columnHighlightPlugin(options.columnHighlightPlugin),
      legendAsTooltipPlugin(options.legendAsTooltipPlugin),
      boxesPlugin(options.boxesPlugin)
    ]
  }
}