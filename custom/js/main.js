window.app = {};
var app = window.app;
var draw;
var flagIsdrawingOn = false;
var PointType = ["Atm", "Tree", "Poles", "Bus Stop"];
var LineType = ["Road", "River", "TelephoneLine"];
var PolygonType = ["Commerical", "Non-Commerical", "Residencial", "Building"];
var selectedGeomType;

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.DrawingApp = function (opt_options) {
  var options = opt_options || {};

  var button = document.createElement("button");
  button.id = "drawbtn";
  button.innerHTML = "<i class='fa fa-pencil'></i>";

  var this_ = this;
  var startStopApp = function () {
    // this_.getMap().getView().setRotation(0);
    // alert("you clicked control");
    if (flagIsdrawingOn == false) {
      $("#startdrawModal").modal("show");
    } else {
      map.removeInteraction(draw);
      defineTypeofFeature();
      flagIsdrawingOn = false;
      document.getElementById("drawbtn").innerHTML =
        "<i class='fa fa-pencil'></i>";

      $("#startFeatureModal").modal("show");
    }
  };

  button.addEventListener("click", startStopApp, false);
  button.addEventListener("touchstart", startStopApp, false);

  var element = document.createElement("div");
  element.className = "draw-app ol-unselectable ol-control";
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target,
  });
};
ol.inherits(app.DrawingApp, ol.control.Control);

var myview = new ol.View({
  center: [7685204.737951403, 3578236.7263579676],
  zoom: 5,
});

var baseLayer = new ol.layer.Tile({
  source: new ol.source.OSM({
    attributions: "NHA Application",
  }),
});

var drawSource = new ol.source.Vector();

var drawLayer = new ol.layer.Vector({
  source: drawSource,
});

var layerArray = [baseLayer, drawLayer];

var map = new ol.Map({
  controls: ol.control
    .defaults({
      attributionOptions: {
        collapsible: false,
      },
    })
    .extend([new app.DrawingApp()]),
  target: "mymap",
  view: myview,
  layers: layerArray,
});

function startDraw(geometryType) {
  console.log("Hello", geometryType);
  selectedGeomType = geometryType;
  document.getElementById("drawbtn").innerHTML =
    "<i class='fa fa-stop-circle'></i>";
  draw = new ol.interaction.Draw({
    type: geometryType,
    source: drawSource,
  });
  $("#startdrawModal").modal("hide");
  drawSource.clear();
  map.addInteraction(draw);
  flagIsdrawingOn = true;
}

function defineTypeofFeature() {
  var dropdownoftype = document.getElementById("floatingSelect");
  dropdownoftype.innerHTML = "";
  if (selectedGeomType == "Point") {
    for (i = 0; i < PointType.length; i++) {
      var op = document.createElement("option");
      op.value = PointType[i];
      op.innerHTML = PointType[i];
      dropdownoftype.appendChild(op);
    }
  } else if (selectedGeomType == "LineString") {
    for (i = 0; i < LineType.length; i++) {
      var op = document.createElement("option");
      op.value = LineType[i];
      op.innerHTML = LineType[i];
      dropdownoftype.appendChild(op);
    }
  } else {
    for (i = 0; i < PolygonType.length; i++) {
      var op = document.createElement("option");
      op.value = PolygonType[i];
      op.innerHTML = PolygonType[i];
      dropdownoftype.appendChild(op);
    }
  }
}
