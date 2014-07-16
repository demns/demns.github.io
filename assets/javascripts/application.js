var MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
  mainRegion: "#content"
});

var Cell = Backbone.Model.extend({});

var Cells = Backbone.Collection.extend({
  model: Cell
});

var CellView = Backbone.Marionette.ItemView.extend({
  template: "#cell-template",
  tagName: 'tr',
  className: 'cell'
});

var CellsView = Backbone.Marionette.CompositeView.extend({
  tagName: "table",
  id: "cells",
  className: "table table-bordered",
  template: "#cells-template",
  itemView: CellView,
  
  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  }
});

MyApp.addInitializer(function(options){
  var cellsView = new CellsView({
    collection: options.cells
  });
  MyApp.mainRegion.show(cellsView);
});

$(document).ready(function(){
  var cells = new Cells([
      new Cell({ name: '1' }),
      new Cell({ name: '2' }),
      new Cell({ name: '3' })
  ]);

  MyApp.start({cells: cells});
});
