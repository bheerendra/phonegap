/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.makit.CombinationChart");jQuery.sap.require("sap.makit.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.makit.CombinationChart",{metadata:{publicMethods:["getSelectedCategory","getNumberOfCategories","getSelectedCategoryGroup"],library:"sap.makit",properties:{"width":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"height":{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},"categoryAxis":{type:"object",group:"Misc",defaultValue:null},"primaryValueAxis":{type:"object",group:"Misc",defaultValue:null},"secondaryValueAxis":{type:"object",group:"Misc",defaultValue:null},"valueBubble":{type:"object",group:"Misc",defaultValue:null},"showRangeSelector":{type:"boolean",group:"Appearance",defaultValue:true},"legendPosition":{type:"sap.makit.LegendPosition",group:"Misc",defaultValue:sap.makit.LegendPosition.Left},"primaryColorPalette":{type:"any",group:"Misc",defaultValue:null},"secondaryColorPalette":{type:"any",group:"Misc",defaultValue:null},"showTableValue":{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{"categoryRegions":{type:"sap.makit.Category",multiple:true,singularName:"categoryRegion"},"layers":{type:"sap.makit.Layer",multiple:true,singularName:"layer"}},events:{"doubletap":{},"tap":{},"longpress":{}}}});sap.makit.CombinationChart.M_EVENTS={'doubletap':'doubletap','tap':'tap','longpress':'longpress'};
/*!
 * @copyright@
 */
jQuery.sap.require("sap.makit.MakitLib");
sap.makit.CombinationChart.prototype.init=function(){this._makitChart=null;this._parentCurrentHeight=0;this._selectedCatIdx=0;this._datarows=[];this._styleClasses=[];this.setCategoryAxis(new sap.makit.CategoryAxis());this.setPrimaryValueAxis(new sap.makit.ValueAxis());this.setSecondaryValueAxis(new sap.makit.ValueAxis());this.setValueBubble(new sap.makit.ValueBubble());this.attachEvent("_change",this._onPropertyChanged);sap.ui.getCore().attachThemeChanged(this._applyCSS,this)};
sap.makit.CombinationChart.prototype.onBeforeRendering=function(e){this.fireEvent("_beforeRendering",this);if(this.getDomRef()&&!sap.ui.core.RenderManager.isPreservedContent(this.getDomRef())){sap.ui.core.RenderManager.preserveContent(this.getDomRef(),true,false)}};
sap.makit.CombinationChart.prototype.onAfterRendering=function(e){this.fireEvent("_afterRendering",this);var $=jQuery(jQuery.sap.domById("sap-ui-dummy-"+this.getId()));var a=sap.ui.core.RenderManager.findPreservedContent(this.getId());var b=null;if(this.getLayers().length>0){if(a.size()==0){this.fireEvent("_createMAKitObject",this);b=new jQuery(this.getDomRef());$.replaceWith(b);this._createChartObject();var p=this.getParent();var c=p.getId();var d=jQuery.sap.domById(c);this._parentCurrentHeight=d.offsetHeight;sap.ui.core.ResizeHandler.register(d,jQuery.proxy(this._onResize,this))}else if(a.size()>0){this.fireEvent("_restoreMAKitObject",this);$.replaceWith(a)}if(b){this._makitChart.setPalette(this.getPrimaryColorPalette(),"primaryaxis");this._makitChart.setPalette(this.getSecondaryColorPalette(),"secondaryaxis");this._setDataTable()}}};
sap.makit.CombinationChart.prototype.addStyleClass=function(s,S){if(this._styleClasses.indexOf(s)===-1){this._styleClasses.push(s)}if(this._makitChart){sap.ui.core.Control.prototype.addStyleClass.call(this,s,S)}return this};
sap.makit.CombinationChart.prototype.removeStyleClass=function(s,S){var i=this._styleClasses.indexOf(s);if(i>-1){this._styleClasses.splice(i,1)}if(this._makitChart){sap.ui.core.Control.prototype.removeStyleClass.call(this,s,S)}return this};
sap.makit.CombinationChart.prototype.addLayer=function(l){if(this._makitChart){throw new Error("Cannot add layer once the chart has been rendered")}this._checkLayer(l);sap.ui.core.Element.prototype.addAggregation.call(this,"layers",l,false);l.attachEvent("rowsUpdated",this._setDataTable,this);l.attachEvent("dataRegionChanged",this._onDataRegionPropChanged,this);l.attachEvent("_change",this._onLayerPropertyChanged,this);return this};
sap.makit.CombinationChart.prototype.insertLayer=function(l,i){if(this._makitChart){throw new Error("Cannot add layer once the chart has been rendered")}this._checkLayer(l);sap.ui.core.Element.prototype.insertAggregation.call(this,"layers",l,i,false);l.attachEvent("rowsUpdated",this._setDataTable,this);l.attachEvent("dataRegionChanged",this._onDataRegionPropChanged,this);l.attachEvent("_change",this._onLayerPropertyChanged,this);return this};
sap.makit.CombinationChart.prototype.removeLayer=function(l){if(this._makitChart){throw new Error("Cannot remove layer once the chart has been rendered")}var r=sap.ui.core.Element.prototype.removeAggregation.call(this,"layers",l,false);if(r!=null){r.detachEvent("rowsUpdated",this._setDataTable,this);r.detachEvent("dataRegionChanged",this._onDataRegionPropChanged,this);r.detachEvent("_change",this._onLayerPropertyChanged,this)}return r};
sap.makit.CombinationChart.prototype.removeAllLayers=function(){if(this._makitChart){throw new Error("Cannot remove layers once the chart has been rendered")}var r=sap.ui.core.Element.prototype.removeAllAggregation.call(this,"layers",false);var l=r.length;var i;for(i=0;i<l;i++){r[i].detachEvent("rowsUpdated",this._setDataTable,this);r[i].detachEvent("dataRegionChanged",this._onDataRegionPropChanged,this);r[i].detachEvent("_change",this._onLayerPropertyChanged,this)}return r};
sap.makit.CombinationChart.prototype._checkLayer=function(l){var a=this.getLayers();var b=a.length;var i;if(l.getType()==sap.makit.ChartType.Line){for(i=0;i<b;i++){if(a[i].getType()==sap.makit.ChartType.Bar){l.setLineType("verticalline");break}else{l.setLineType("line")}}}else{for(i=0;i<b;i++){if(a[i].getType()!=sap.makit.ChartType.Line){throw new Error("Cannot combine 2 different non-line chart type")}}for(i=0;i<b;i++){if(a[i].getType()==sap.makit.ChartType.Line){if(l.getType()==sap.makit.ChartType.Bar){a[i].setLineType("verticalline")}else{a[i].setLineType("line")}}}}};
sap.makit.CombinationChart.prototype.setValueBubble=function(v){if(v instanceof sap.makit.ValueBubble){sap.ui.core.Element.prototype.setProperty.call(this,"valueBubble",v,false);v.attachEvent("_change",this._onValueBubbleChanged,this);if(this._makitChart){var a=v.toObject();this._makitChart.setValueBubbleStyle(a);if(this._makitChart.isValueBubbleVisible()!=a.visible){this._makitChart.showValueBubble(a.visible)}}}else{throw new Error("valueBubble property must be of type sap.makit.ValueBubble")}return this};
sap.makit.CombinationChart.prototype.addCategoryRegion=function(c){sap.ui.core.Element.prototype.addAggregation.call(this,"categoryRegions",c,false);c.attachEvent("_change",{type:"categories"},this._onDataRegionPropChanged,this);return this};
sap.makit.CombinationChart.prototype.insertCategoryRegion=function(c,i){sap.ui.core.Element.prototype.insertAggregation.call(this,"categoryRegions",c,i,false);c.attachEvent("_change",{type:"categories"},this._onDataRegionPropChanged,this);return this};
sap.makit.CombinationChart.prototype.removeCategoryRegion=function(c){var r=sap.ui.core.Element.prototype.removeAggregation.call(this,"categoryRegions",c,false);if(r!=null){c.detachEvent("_change",this._onDataRegionPropChanged,this)}return r};
sap.makit.CombinationChart.prototype.removeAllCategoryRegions=function(){var r=sap.ui.core.Element.prototype.removeAllAggregation.call(this,"categoryRegions",false);var l=r.length;var i;for(i=0;i<l;i++){r[i].detachEvent("_change",this._onDataRegionPropChanged,this)}return r};
sap.makit.CombinationChart.prototype.setPrimaryValueAxis=function(v){if(v instanceof sap.makit.ValueAxis){sap.ui.core.Element.prototype.setProperty.call(this,"primaryValueAxis",v,false);v.attachEvent("_change",{axis:"values",secondaryAxis:false},this._onAxisPropChanged,this)}else{throw new Error("primaryValueAxis property must be of type sap.makit.ValueAxis")}return this};
sap.makit.CombinationChart.prototype.setSecondaryValueAxis=function(v){if(v instanceof sap.makit.ValueAxis){sap.ui.core.Element.prototype.setProperty.call(this,"secondaryValueAxis",v,false);v.attachEvent("_change",{axis:"values",secondaryAxis:true},this._onAxisPropChanged,this)}else{throw new Error("secondaryValueAxis property must be of type sap.makit.ValueAxis")}return this};
sap.makit.CombinationChart.prototype.setCategoryAxis=function(c){if(c instanceof sap.makit.CategoryAxis){sap.ui.core.Element.prototype.setProperty.call(this,"categoryAxis",c,false);c.attachEvent("_change",{axis:"category"},this._onAxisPropChanged,this)}else{throw new Error("categoryAxis property must be of type sap.makit.CategoryAxis")}return this};
sap.makit.CombinationChart.prototype._setRealHeight=function(h){var e=this.getDomRef();var p=e.style.height;var n="0px";if(h.indexOf("%")>-1){var a=this.getParent();var b=a.getId();var c=jQuery.sap.domById(b);var i=parseInt(h,10);var r=Math.ceil(c.offsetHeight*(i/100));n=r+"px"}else{n=h}if(p!=n){e.style.height=n}};
sap.makit.CombinationChart.prototype._createChartObject=function(){var e=this.getDomRef();e.style.width=this.getWidth();this._setRealHeight(this.getHeight());this._makitChart=new window.$MA.Chart(this.getId(),true);var t=this;this._makitChart.bind("initialized",function(){t._makitChart.showToolBar(false);t._setMakitChartProperties()});this._makitChart.bind("beforerender",function(){t.fireEvent("_makitBeforeRender",t)});this._makitChart.bind("renderstart",function(){t.fireEvent("_makitRenderStart",t)});this._makitChart.bind("renderend",function(){t.fireEvent("_makitRenderEnd",t)});this._makitChart.bind("animationend",function(){t.fireEvent("_makitAnimationEnd",t)});var s=this._getChartSyntax();this._makitChart.create(s);this._makitChart.bind("tap",function(a,p){t._selectedCatIdx=t._makitChart.getSelectedCategoryIndex();t.fireTap(p)});this._makitChart.bind("doubletap",function(a,p){t.fireEvent("doubletap",p)});this._makitChart.bind("longpress",function(a,p){t._selectedCatIdx=t._makitChart.getSelectedCategoryIndex();t.fireEvent("longpress",p)});var l=this._styleClasses.length;for(var i=0;i<l;i++){this.addStyleClass(this._styleClasses[i])}this._applyCSS()};
sap.makit.CombinationChart.prototype._setMakitChartProperties=function(){if(!this._makitChart){return}this._makitChart.setLegend(this.getLegendPosition().toLowerCase());this._makitChart.setPalette(this.getPrimaryColorPalette(),"primaryaxis");this._makitChart.setPalette(this.getSecondaryColorPalette(),"secondaryaxis");this._makitChart.showRangeSelectorView(this.getShowRangeSelector());this._makitChart.showTableValue(this.getShowTableValue());var v=this.getValueBubble();if(v){var a=v.toObject();this._makitChart.setValueBubbleStyle(a);if(this._makitChart.isValueBubbleVisible()!=a.visible){this._makitChart.showValueBubble(a.visible)}}var l=this.getLayers();var b=l.length;for(var i=0;i<b;i++){var c=l[i];if(c.getType()==sap.makit.ChartType.Line){this._makitChart.setGraphLineWidth(c.getLineThickness(),c.getId())}var p=c.getPrimaryColorPalette();if(p){this._makitChart.setPalette(p,c.getId())}this._makitChart.setProperty(c.getId()+".values.SecondaryAxis",c.getDrawOnSecondaryAxis())}};
sap.makit.CombinationChart.prototype._getChartSyntax=function(){var c=this.getCategoryAxis();var a=this.getCategoryRegions();var b=a.length;if(b>0){var i;var d="<Categories";if(c){if(c.getDisplayAll()){d+=' display="'+c.getDisplayAll()+'"'}}d+=">";var e="";for(i=b-1;i>=0;i--){var t=a[i].getDisplayName();if(t&&t.length>0){e+=t+" | "}}e=e.substr(0,e.length-3);for(i=0;i<b;i++){var f=a[i];d+='<Category column="'+f.getColumn()+'"';if(f.getFormat()){d+=' format="'+f.getFormat()+'"'}if(i==0){d+=' displayname="'+e+'"'}if(c){d+=' showprimaryline="'+c.getShowPrimaryLine()+'"';d+=' showgrid="'+c.getShowGrid()+'"';d+=' showlabel="'+c.getShowLabel()+'"';d+=' thickness="'+c.getThickness()+'"';d+=' color="'+c.getColor()+'"';d+=' sortorder="'+c.getSortOrder().toLowerCase()+'"';d+=' displaylastlabel="'+c.getDisplayLastLabel()+'"'}d+=' />'}d+="</Categories>"}else{throw new Error("CombinationChart '"+this.getId()+"' needs at least one Category data region")}var l=this.getLayers();var g=l.length;var h="";for(var i=0;i<g;i++){var j=l[i];h+=j.getSyntax(this.getPrimaryValueAxis(),this.getSecondaryValueAxis())}var o='<OverlayGroup>';o+=d;o+=h;o+='</OverlayGroup>';return o};
sap.makit.CombinationChart.prototype._setDataTable=function(){if(this._makitChart){this._setDataTableTimer=this._setDataTableTimer||jQuery.sap.delayedCall(150,this,function(){this.fireEvent("_createDataTable",this);var l=this.getLayers();var a=l.length;this.fireEvent("_beforeSetDataTable",this);for(var i=0;i<a;i++){var b=l[i];this._makitChart.setDataTable(b.getDataTable(),b.getId())}this._dataInitialize=true;this._setDataTableTimer=undefined})}};
sap.makit.CombinationChart.prototype._applyCSS=function(e){if(this._makitChart){this._makitChart.applyCSS()}};
sap.makit.CombinationChart.prototype._getSelectedSeries=function(l){var i=this.indexOfLayer(l);if(i>=0&&this._makitChart){return this._makitChart.getSelectedSeries(l.getId())}};
sap.makit.CombinationChart.prototype._onResize=function(e){var p=this.getParent();var a=p.getId();var b=jQuery.sap.domById(a);var c=b.offsetHeight;var d=b.offsetWidth;if(this._parentCurrentHeight!=c&&c>0){this._setRealHeight(this.getHeight());this._parentCurrentHeight=b.offsetHeight}if(this._makitChart!=null&&c>0&&d>0){this._makitChart.refresh()}};
sap.makit.CombinationChart.prototype._onPropertyChanged=function(e){if(!this._makitChart){return}var n=e.mParameters["name"];var a=e.mParameters["newValue"];if(this._makitChart){if(n==="showRangeSelector"){this._makitChart.showRangeSelectorView(a)}else if(n==="legendPosition"){this._makitChart.setLegend(a.toLowerCase())}else if(n==="width"){this.getDomRef().style.width=this.getWidth()}else if(n==="height"){this._setRealHeight(a)}else if(n==="showTableValue"){this._makitChart.showTableValue(a)}else if(n==="primaryColorPalette"){this._makitChart.setPalette(a,"primaryaxis")}else if(n==="secondaryColorPalette"){this._makitChart.setPalette(a,"secondaryaxis")}this._makitChart.setSelectedCategoryIndex(this._selectedCatIdx);this._makitChart.refresh()}};
sap.makit.CombinationChart.prototype._onLayerPropertyChanged=function(e){if(!this._makitChart){return}var n=e.mParameters["name"];var a=e.mParameters["newValue"];var o=e.mParameters["oldValue"];if(this._makitChart){if(n==="type"){var l=e.getSource();var b=this.indexOfLayer(l);var c=this.getLayers();var d=c.length;var i;if(a!=sap.makit.ChartType.Line){for(i=0;i<d;i++){var f=c[i].getType();if(b!=i&&f!=sap.makit.ChartType.Line){l.setType(o);throw new Error("CombinationChart : "+a+" chart type cannot be combine with "+f+" chart type")}}}var m=a;if(m==sap.makit.ChartType.Line){for(i=0;i<d;i++){if(c[i].getType()!=sap.makit.ChartType.Line){m=c[i].getType();break}}}var g="line";if(m==sap.makit.ChartType.Bar){g="verticalline"}var t=a;if(a==sap.makit.ChartType.Line){t=g}this._makitChart.setProperty(l.getId()+".ChartType",t);for(i=0;i<d;i++){if(c[i].getType()==sap.makit.ChartType.Line&&c[i].getLineType()!=g&&l!=c[i]){c[i].setLineType(g);this._makitChart.setProperty(c[i].getId()+".ChartType",g)}}}else if(n==="lineThickness"){this._makitChart.setGraphLineWidth(a,e.getSource().getId())}else if(n==="primaryColorPalette"){this._makitChart.setPalette(a,e.getSource().getId())}else if(n==="drawOnSecondaryAxis"){this._makitChart.setProperty(e.getSource().getId()+".values.SecondaryAxis",a)}this._makitChart.setSelectedCategoryIndex(this._selectedCatIdx);this._makitChart.refresh()}};
sap.makit.CombinationChart.prototype._onDataRegionPropChanged=function(e,d){if(!this._makitChart){return}var p=e.mParameters;if(p["type"]=="values"){var i=e.getSource().getId();var a=p["index"];if(a>-1){this._makitChart.setProperty(i+"."+p["type"]+"["+a+"]."+p["name"],p["newValue"])}}else if(p["type"]=="series"){var i=e.getSource().getId();var a=p["index"];this._makitChart.setProperty(i+"."+p["type"]+"["+a+"]."+p["name"],p["newValue"])}else if(d!=undefined){this._makitChart.setProperty(d["type"]+"."+p["name"],p["newValue"])}};
sap.makit.CombinationChart.prototype._onAxisPropChanged=function(e,d){if(!this._makitChart){return}var p=e.mParameters;var n=p["name"].toLowerCase();var v=p["newValue"];if(n==="sortorder"){v=v.toLowerCase()}if(d["axis"]=="values"){var w="primaryaxis";if(d["secondaryAxis"]){w="secondaryaxis"}this._makitChart.setProperty(w+"."+d["axis"]+"."+n,v)}else{var a=d["axis"];if(n==="displayall"){a="categories";n="display";if(!v){v=""}}this._makitChart.setProperty(a+"."+n,v)}this._makitChart.refresh();if(n==="sortorder"||n=="display"){this._setDataTable()}};
sap.makit.CombinationChart.prototype._onValueBubbleChanged=function(e){if(!this._makitChart){return}var v=this.getValueBubble().toObject();this._makitChart.setValueBubbleStyle(v);if(this._makitChart.isValueBubbleVisible()!=v.visible){this._makitChart.showValueBubble(v.visible)}this._makitChart.refresh()};
sap.makit.CombinationChart.prototype.getSelectedCategory=function(){var s=undefined;if(this._makitChart){s=this._makitChart.getSelectedCategory()}return s};
sap.makit.CombinationChart.prototype.getNumberOfCategories=function(){var n=undefined;if(this._makitChart){n=this._makitChart.getNumberOfCategories()}return n};
sap.makit.CombinationChart.prototype.getSelectedCategoryGroup=function(){var s=undefined;if(this._makitChart){s=this._makitChart.getSelectedCategoryGroup()}return s};
