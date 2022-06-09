<template>
  <div>
    <v-overlay :value="waiting">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <div style="color: white; margin: 20px 0 0 -45px;">Loading...</div>
    </v-overlay>

    <div class="graph-component" ref="graphComponentHost">
      <div class="popupContent" id="nodePopupContent" tabindex="0">
        <img id="popup-spinner" src="/spinner.gif" alt="" style="width: 50px;"/>
        <div id="popup-content" class="popupContentRight">
          <div class="pop-name" data-id="name"><span class="pop-prop">Name:</span> <span style="margin-left: 10px;"></span><span></span></div>
          <div class="pop-id" data-id="id"><span class="pop-prop">Uri:</span> <a class="pop-link" target="_blank"></a></div>
          <div class="pop-parent" data-id="parentName"><span class="pop-prop">Parent:</span> <span style="margin-left: 7px;"></span></div>
        </div>
      </div>
      <div class="popupContent" id="edgePopupContent" style="text-align: center;" tabindex="0">
        <div style="display: inline-block; padding: 15px 0 0 0;">
          <div data-id="relation" class="pop-relation"></div>
          <div data-id="sourceName" class="pop-source"></div>
          <div class="pop-arrow"><span class="mdi mdi-ray-start-end"></span></div>
          <div data-id="targetName" class="pop-target"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {xorWith} from "lodash";

const NODE_MAPPER = "NodeMapper";
const EDGE_MAPPER = "EdgeMapper";
const GROUP_MAPPER = "GroupMapper";
const INFO_MAPPER = "InfoMapper";
const POSTIT_MAPPER = "PostitMapper";

import {Component, Vue, Watch} from "vue-property-decorator";
import {
  CircularLayout,
  Class,
  Cursor,
  CurveConnectionStyle,
  DefaultDrawingDistanceCalculator, DefaultLabelStyle,
  EdgePathLabelModel,
  ExteriorLabelModel,
  ExteriorLabelModelPosition, FreeNodePortLocationModel,
  GraphComponent,
  GraphInputMode,
  GraphItemTypes, GraphMLIOHandler,
  GraphMLSupport,
  GraphOverviewComponent,
  GraphViewerInputMode,
  HierarchicLayout,
  HierarchicLayoutEdgeRoutingStyle,
  HierarchicLayoutRoutingStyle,
  ICommand,
  IEdge,
  IGraph, IMapper,
  INode,
  Insets, InteriorLabelModel,
  Key, KeyType,
  LayoutExecutor,
  License, Mapper,
  OrganicLayout,
  Point, PolylineEdgeStyle,
  RadialLayout, Rect,
  ScrollBarVisibility, SerializationProperties,
  Size, SmartEdgeLabelModel,
  StorageLocation,
  Stroke,
  TemplateNodeStyle, YObject
} from "yfiles";
import licenseData from "@/assets/license.json";
import * as _ from "lodash";
import {INetwork} from "@/components/network/iNetwork";
import HTMLPopupSupport from "@/components/network/pupUp";
import {toShortForm} from "@/shared/ontology";

License.value = licenseData;
Class.ensure(LayoutExecutor);

const mainEdgeLabelModel = new EdgePathLabelModel({
  autoRotation: true,
  sideOfEdge: "on-edge"

}).createDefaultParameter();
const mainEdgeLabelStyle = new DefaultLabelStyle({
  backgroundStroke: "White",
  backgroundFill: "White",
  textFill: "#696969",
  textSize: 8,
  wrapping:"word-ellipsis",
  autoFlip:true,
  insets: [3, 5, 3, 5]
});
const infoLabelStyle = new DefaultLabelStyle({
  // backgroundStroke: "White",
  // backgroundFill: "White",
  textFill: "#fff",
  textSize: 8,
  insets: [0, 0, 3, 0]
});
const defaultShapeMainLabelStyle = new DefaultLabelStyle({
  // backgroundStroke: "White",
  // backgroundFill: "White",
  textFill: "#fff",
  textSize: 10,
  insets: 0
});

@Component({})
export default class Network extends Vue implements INetwork {
  graphComponent!: GraphComponent;
  graph!: IGraph;
  private nodePopup: HTMLPopupSupport;
  waiting: boolean = false;
  private nodeMapper: any;
  private edgeMapper: any;
  private groupMapper: any;
  private infoMapper: any;
  private postitMapper: any;

  mounted() {
    this.createGraphComponent();
  }

  public async loadOntology() {
    try {
      this.waiting = true;

      const supp = new GraphMLSupport();
      supp.graphMLIOHandler.deserializationPropertyOverrides.set(SerializationProperties.IGNORE_XAML_DESERIALIZATION_ERRORS, true);
      supp.graphMLIOHandler = this.createGraphMLIOHandler();
      await supp.openFile(this.graph, StorageLocation.FILE_SYSTEM);


      for (const node of this.graph.nodes) {

        const blob = this.nodeMapper.get(node);
        const isGroup = this.groupMapper.get(node);
        const isInfo = this.infoMapper.get(node);
        const isPostit = this.postitMapper.get(node);

        node.tag = blob;
        // if (blob.isGroup) {
        //   this.graph.setIsGroupNode(node, true);
        //   this.graph.setLabelLayoutParameter(label, ExteriorLabelModel.NORTH);
        //   this.graph.setNodeLayout(node, Rect.from(blob));
        // } else {
        //   const r = Rect.from(blob);
        //   this.graph.setNodeLayout(node, r);
        // }
        const r = Rect.from(blob);
        this.graph.setNodeLayout(node, r);
        if (isGroup === "true") {
          this.graph.setStyle(node, new TemplateNodeStyle("groupTemplate"));
        } else if (isInfo === "true") {
          this.graph.setStyle(node, new TemplateNodeStyle("infoTemplate"));
          this.graph.addLabel(node, blob.text || "None", InteriorLabelModel.SOUTH, infoLabelStyle);
        } else if (isPostit === "true") {
          this.graph.setStyle(node, new TemplateNodeStyle("postitTemplate"));
          this.graph.addLabel(node, blob.text || "None", InteriorLabelModel.CENTER, infoLabelStyle);
        } else {
          const label = this.graph.addLabel(node, blob.text || "None", InteriorLabelModel.CENTER, defaultShapeMainLabelStyle);
          this.graph.setStyle(node, new TemplateNodeStyle("defaultTemplate"));
        }
      }
      // for (const node of this.graph.nodes) {
      //   if (this.graph.isGroupNode(node)) {
      //     this.graph.adjustGroupNodeLayout(node);
      //   }
      // }

      for (const edge of this.graph.edges) {
        const blob = this.edgeMapper.get(edge);
        edge.tag = blob;
        if (blob !== null) {
          this.graph.addLabel(edge, blob?.text || "", mainEdgeLabelModel, mainEdgeLabelStyle);
          if (blob.bends.length > 0) {
            blob.bends.forEach(p => {
              this.graph.addBend(edge, new Point(p[0], p[1]));
            });
          }

          // this.graph.setPortLocationParameter(edge.sourcePort, FreeNodePortLocationModel.NODE_CENTER_ANCHORED)
          const sx = edge.sourceNode.layout.center.x;
          const sy = edge.sourceNode.layout.center.y;
          const tx = edge.targetNode.layout.center.x;
          const ty = edge.targetNode.layout.center.y;
          this.graph.setPortLocation(edge.sourcePort, new Point(sx + blob.s[0], sy + blob.s[1]));
          this.graph.setPortLocation(edge.targetPort, new Point(tx + blob.t[0], ty + blob.t[1]));
        }

      }
      // this.layout();
      this.waiting = false;
    } catch (e) {
      this.waiting = false;
    }
  }

  currentLayout: string = "hierarchic";

  public layout(name: string = null) {
    if (_.isNil(name)) {
      name = this.currentLayout;
    } else {
      this.currentLayout = name;
    }
    switch (name.toLowerCase()) {
      case "hierarchic":
        return this.layoutHierarchic();
      case "organic":
        return this.layoutOrganic();
      case "radial":
        return this.layoutRadial();
      case "circular":
        return this.layoutCircular();
    }
  }

  createGraphMLIOHandler() {
    // create an IOHandler that will be used for all IO operations
    const graphMLIOHandler = new GraphMLIOHandler();

    graphMLIOHandler.addInputMapper(INode.$class, YObject.$class, (element) => true, this.nodeMapper, (sender, e) => {
      try {

        const xNode = e.xmlNode;
        const tagName = xNode["tagName"] || "";
        if (tagName.toLowerCase().indexOf("node") > -1) {
          e.result = this.handleNode.call(this, xNode);
        } else {
          e.result = {};
        }

      } catch (exception) {
        console.error(exception);
        e.result = "Error";
      }
    });

    graphMLIOHandler.addInputMapper(INode.$class, YObject.$class, (element) => GraphMLIOHandler.matchesName(element, "isGroup"), this.groupMapper, (sender, e) => {
      try {
        e.result = e.xmlNode.textContent.toString();
      } catch (exception) {
        console.error(exception);
        e.result = "Error";
      }
    });
    graphMLIOHandler.addInputMapper(INode.$class, YObject.$class, (element) => GraphMLIOHandler.matchesName(element, "isInfo"), this.infoMapper, (sender, e) => {
      try {
        e.result = e.xmlNode.textContent.toString();
      } catch (exception) {
        console.error(exception);
        e.result = "false";
      }
    });
    graphMLIOHandler.addInputMapper(INode.$class, YObject.$class, (element) => GraphMLIOHandler.matchesName(element, "isPostit"), this.postitMapper, (sender, e) => {
      try {
        e.result = e.xmlNode.textContent.toString();
      } catch (exception) {
        console.error(exception);
        e.result = "false";
      }
    });

    graphMLIOHandler.addInputMapper(IEdge.$class, YObject.$class, (element) => true, this.edgeMapper, (sender, e) => {
      try {
        const xNode = e.xmlNode;
        const tagName = xNode["tagName"] || "";
        if (tagName.toLowerCase().indexOf("edge") > -1) {
          e.result = this.handleEdge(xNode);
        } else {
          e.result = {};
        }

      } catch (exception) {
        console.error(exception);
        e.result = "Error";
      }
    });

    return graphMLIOHandler;
  }


  layoutCircular() {
    this.graphComponent.morphLayout(new CircularLayout());
  }

  layoutOrganic() {
    this.graphComponent.morphLayout(
        new OrganicLayout({
          preferredEdgeLength: 200
        })
    );
  }

  layoutRadial() {
    this.graphComponent.morphLayout(new RadialLayout());
  }

  layoutHierarchic() {
    let hierarchicLayout = new HierarchicLayout({
      layoutOrientation: "left-to-right",
      minimumLayerDistance: 200,
      nodeToNodeDistance: 5
    });
    hierarchicLayout.edgeLayoutDescriptor.routingStyle = new HierarchicLayoutRoutingStyle(HierarchicLayoutEdgeRoutingStyle.CURVED);
    hierarchicLayout.edgeLayoutDescriptor.routingStyle.createControlPoints = true;
    hierarchicLayout.edgeLayoutDescriptor.routingStyle.sourceCurveConnectionStyle = CurveConnectionStyle.ORGANIC;
    hierarchicLayout.edgeLayoutDescriptor.routingStyle.targetCurveConnectionStyle = CurveConnectionStyle.ORGANIC;
    (hierarchicLayout.hierarchicLayoutCore.drawingDistanceCalculator as DefaultDrawingDistanceCalculator).adaptiveMinimumEdgeDistanceEnabled = false;
    this.graphComponent.morphLayout(hierarchicLayout).then(() => {
      this.graphComponent.fitContent();
    });
  }

  private createGraphComponent() {
    this.graphComponent = new GraphComponent(".graph-component");
    this.graph = this.graphComponent.graph;
    this.initGraphStyles();

    this.initializeInputMode();
    this.initializePopups();
    this.initGraphThumbnail();
    this.initMappers();
  }

  private initMappers() {
    this.nodeMapper = this.graph.mapperRegistry.createMapper(
        INode.$class,
        YObject.$class,
        NODE_MAPPER
    );
    this.edgeMapper = this.graph.mapperRegistry.createMapper(
        IEdge.$class,
        YObject.$class,
        EDGE_MAPPER
    );
    this.groupMapper = this.graph.mapperRegistry.createMapper(
        INode.$class,
        YObject.$class,
        GROUP_MAPPER
    );
    this.infoMapper = this.graph.mapperRegistry.createMapper(
        INode.$class,
        YObject.$class,
        INFO_MAPPER
    );
    this.postitMapper = this.graph.mapperRegistry.createMapper(
        INode.$class,
        YObject.$class,
        POSTIT_MAPPER
    );

  }

  private initGraphStyles() {
    this.graphComponent.fitContentViewMargins = new Insets(50);
    this.graphComponent.graph.nodeDefaults.size = new Size(50, 50);

    this.graphComponent.graph.edgeDefaults.style = new PolylineEdgeStyle({
      stroke: Stroke.WHITE_SMOKE,
      targetArrow: "white medium triangle",
      sourceArrow:"white medium circle",
      smoothingLength: 10
    });
    this.graphComponent.verticalScrollBarPolicy = ScrollBarVisibility.NEVER;
    this.graphComponent.horizontalScrollBarPolicy = ScrollBarVisibility.NEVER;
  }

  private initializeInputMode() {
    const mode = new GraphViewerInputMode({
      toolTipItems: GraphItemTypes.NODE,
      selectableItems: GraphItemTypes.NODE | GraphItemTypes.EDGE,
      marqueeSelectableItems: GraphItemTypes.NONE,
      focusableItems: "none"
    });

    mode.mouseHoverInputMode.toolTipLocationOffset = new Point(10, 10);
    mode.addQueryItemToolTipListener((sender, args) => {
      if (INode.isInstance(args.item) && !args.handled) {
        const nodeName = args.item.tag;
        if (nodeName != null) {
          args.toolTip = nodeName;
          args.handled = true;
        }
      }
    });
    mode.itemHoverInputMode.hoverCursor = Cursor.POINTER;
    mode.itemHoverInputMode.hoverItems = GraphItemTypes.NODE | GraphItemTypes.EDGE;
    mode.itemHoverInputMode.discardInvalidItems = false;
    mode.itemHoverInputMode.addHoveredItemChangedListener((sender, args) => {
      const item = args.item;
      const highlightIndicatorManager = this.graphComponent.highlightIndicatorManager;
      highlightIndicatorManager.clearHighlights();
      if (item) {
        highlightIndicatorManager.addHighlight(item);
        if (INode.isInstance(item)) {
          const edges = this.graphComponent.graph.edgesAt(item);
          const neighborhood = {
            incoming: [],
            outgoing: []
          };
          edges.forEach((e) => {
            if (e.sourceNode.tag === item.tag) {
              neighborhood.outgoing.push(e.targetNode.tag);
            } else {
              neighborhood.incoming.push(e.sourceNode.tag);
            }
          });
          // this.$store.commit("setNeighbors", neighborhood);
          edges.forEach((edge) => {
            highlightIndicatorManager.addHighlight(edge);
          });
        } else if (IEdge.isInstance(item)) {
          highlightIndicatorManager.addHighlight(item.sourceNode);
          highlightIndicatorManager.addHighlight(item.targetNode);
          // this.$store.commit("setNeighbors", null);
        }
      }
    });
    this.graphComponent.inputMode = mode;
  }

  private initializePopups() {
    // Creates a label model parameter that is used to position the node pop-up
    const nodeLabelModel = new ExteriorLabelModel({insets: 10});

    // Creates the pop-up for the node pop-up template
    this.nodePopup = new HTMLPopupSupport(this.graphComponent, window.document.getElementById("nodePopupContent"), nodeLabelModel.createParameter(ExteriorLabelModelPosition.NORTH));

    // Creates the edge pop-up for the edge pop-up template with a suitable label model parameter
    // We use the EdgePathLabelModel for the edge pop-up
    const edgeLabelModel = new EdgePathLabelModel({autoRotation: false});

    // Creates the pop-up for the edge pop-up template
    const edgePopup = new HTMLPopupSupport(this.graphComponent, window.document.getElementById("edgePopupContent"), edgeLabelModel.createDefaultParameter());

    // The following works with both GraphEditorInputMode and GraphViewerInputMode
    const inputMode = this.graphComponent.inputMode as GraphInputMode;

    // The pop-up is shown for the currentItem thus nodes and edges should be focusable
    inputMode.focusableItems = GraphItemTypes.NODE | GraphItemTypes.EDGE;

    // Register a listener that shows the pop-up for the currentItem
    this.graphComponent.addCurrentItemChangedListener((sender, args) => {
      const item = this.graphComponent.currentItem;
      this.$store.commit("setSelectedItem", item);
      if (INode.isInstance(item)) {
        // update data in node pop-up
        this.updateNodePopupContent(this.nodePopup, item);
        // open node pop-up and hide edge pop-up
        // this.nodePopup.currentItem = item;
        // edgePopup.currentItem = null;

        const edges = this.graphComponent.graph.edgesAt(item);
        const neighborhood = {
          incoming: [],
          outgoing: []
        };
        edges.forEach((e) => {
          if (e.sourceNode.tag === item.tag) {
            neighborhood.outgoing.push(e.targetNode.tag);
          } else {
            neighborhood.incoming.push(e.sourceNode.tag);
          }
        });
        this.$store.commit("setNeighbors", neighborhood);

      } else if (IEdge.isInstance(item)) {
        // update data in edge pop-up
        this.updateEdgePopupContent(edgePopup, item);
        // open edge pop-up and node edge pop-up
        // edgePopup.currentItem = item;
        // this.nodePopup.currentItem = null;
        this.$store.commit("setNeighbors", null);

      } else {
        this.nodePopup.currentItem = null;
        edgePopup.currentItem = null;
      }
    });

    // On clicks on empty space, hide the popups
    inputMode.addCanvasClickedListener((sender, args) => {
      this.nodePopup.currentItem = null;
      edgePopup.currentItem = null;
      this.$store.commit("setSelectedItem", null);
      this.$store.commit("setNeighbors", null);
    });
    const myCommand = ICommand.createCommand("MyCommand");
    inputMode.keyboardInputMode.addCommandBinding(myCommand, (command, parameter, source) => {
      source.currentItem = null;
      return true;
    });

    // On press of the ESCAPE key, set currentItem to <code>null</code> to hide the pop-ups
    inputMode.keyboardInputMode.addKeyBinding(Key.ESCAPE, "none", myCommand);
  }

  /**
   * Updates the popup content.
   * A spinner is shown because of the possible latency of
   * AnzoGraph answering.
   */
  private updateNodePopupContent(nodePopup, node) {
    const id = node.tag;
    this.$store.commit("setWaiting", true);
    const img = document.getElementById("popup-spinner") as HTMLImageElement;
    const content = document.getElementById("popup-content") as HTMLDivElement;
    // img.style.display = "block";
    // content.style.display = "none";
    img.style.display = "none";
    content.textContent = "aha";
    content.style.display = "block";
    this.$store.commit("setWaiting", false);

  }

  /**
   * Updates the info shown.
   * No latency here because the adjacency info is available from the graph.
   */
  private updateEdgePopupContent(edgePopup, edge) {
    // get business data from node tags
    const sourceData = edge.sourcePort.owner.tag;
    const targetData = edge.targetPort.owner.tag;
    this.$store.commit("setSelectedData", edge.tag);

    // get all divs in the pop-up
    const divs = edgePopup.div.getElementsByTagName("div");
    for (let i = 0; i < divs.length; i++) {
      const div = divs.item(i);
      if (div.hasAttribute("data-id")) {
        // if div has a 'data-id' attribute, get content from the business data
        const id = div.getAttribute("data-id");
        if (id === "sourceName") {
          div.textContent = toShortForm(sourceData);
        } else if (id === "targetName") {
          div.textContent = toShortForm(targetData);
        } else if (id === "relation") {
          div.textContent = toShortForm(edge.tag.uri);
        }
      }
    }
  }

  private initGraphThumbnail() {
    new GraphOverviewComponent("thumbnail", this.graphComponent);
  }

  public zoomTo(id: string): void {
    const node = this.graph.nodes.find((n) => n.tag === id);
    if (!_.isNil(node)) {
      const location = node.layout.center;
      this.graphComponent.zoomToAnimated(location, /*this.graphComponent.zoom*/ 1.5);
      // display the popup info as well
      this.updateNodePopupContent(this.nodePopup, node);
      this.nodePopup.currentItem = node;
      // this.$store.commit("setSelectedItem", node);
    }
  }

  public search(term: string): void {
    if (_.isNil(term) || term.trim().length === 0) {
      this.$store.commit("setSearchResults", []);
      return;
    }
    term = term.trim();
    const found = this.graph.nodes.filter((n: INode) => n.tag.text.toLowerCase().indexOf(term) > -1).map((n) => n.tag);
    this.$store.commit("setSearchResults", found);
  }

  refocus() {
    this.graphComponent.fitContent();
  }

  cleanupString(s) {
    if (s) {
      return s.replace(/\\n/gi, "").trim();
    } else {
      return "";
    }
  }
  /**
   * Parses the given XML node for extra data.
   */
  private handleNode(xNode: Node) {
    let childNode: any;
    let blob = {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      isGroup: false,
      text: null,
      attributes: []
    };

    blob.isGroup = xNode["tagName"] === "y:ProxyAutoBoundsNode";
    let dataRoot = xNode;
    if (blob.isGroup) {
      dataRoot = dataRoot.childNodes[1].childNodes[1];
    }

    for (childNode of dataRoot.childNodes) {
      switch (childNode.nodeName) {
        case "y:Geometry":
          blob.x = parseFloat(childNode.getAttribute("x"));
          blob.y = parseFloat(childNode.getAttribute("y"));
          blob.width = parseFloat(childNode.getAttribute("width"));
          blob.height = parseFloat(childNode.getAttribute("height"));
          break;

        case "y:NodeLabel":
          const config = childNode.getAttribute("configuration");
          const text = this.cleanupString(childNode.textContent);
          if (config) {
            switch (config) {
              case "com.yworks.entityRelationship.label.name":
                blob.text = text;
                break;
              case "com.yworks.entityRelationship.label.attributes":
                blob.attributes.push(text);
                break;
            }
          } else {
            if (blob.text) {
              blob.attributes.push(text);
            } else {
              blob.text = text;
            }
          }
          break;

      }
    }
    return blob;
  }

  /**
   * Parses the given XML edge for extra data.
   */
  private handleEdge(xNode: Node) {
    const blob = {
      s: null,
      t: null,
      text: null,
      attributes: [],
      bends: []

    };
    let childNode: any;
    for (childNode of xNode.childNodes) {
      switch (childNode.nodeName) {
        case "y:Path":
          const sx = parseFloat(childNode.getAttribute("sx"));
          const sy = parseFloat(childNode.getAttribute("sy"));
          const tx = parseFloat(childNode.getAttribute("tx"));
          const ty = parseFloat(childNode.getAttribute("ty"));
          blob.s = [sx, sy];
          blob.t = [tx, ty];
          for (const p of childNode.childNodes) {
            if (p.tagName === "y:Point") {
              const x = parseFloat(p.getAttribute("x"));
              const y = parseFloat(p.getAttribute("y"));
              blob.bends.push([x, y]);
            }

          }
          break;

        case "y:EdgeLabel":
          const config = childNode.getAttribute("configuration");
          const text = this.cleanupString(childNode.textContent);
          if (blob.text) {
            blob.attributes.push(text);
          } else {
            blob.text = text;
          }
          break;

      }
    }
    return blob;
  }

  get edgeLabelsVisible() {
    return this.$store.state.edgeLabelsVisible;
  }

  @Watch("edgeLabelsVisible")
  edgeLabelVisible(tf) {
    if (tf) {
      for (const edge of this.graph.edges) {
        const blob = this.edgeMapper.get(edge);
        edge.tag = blob;
        if (blob !== null) {
          this.graph.addLabel(edge, blob?.text || "", mainEdgeLabelModel, mainEdgeLabelStyle);
        }
      }
    } else {
      for (const edge of this.graph.edges) {
        edge.labels.toArray().forEach(l => {
          this.graph.remove(l);
        });
      }
    }
  }
}
</script>

<style scoped></style>
