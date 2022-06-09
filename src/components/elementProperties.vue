<template>
	<div>
		<div v-if="itemPresent">
			<div v-if="isWaiting" style="padding: 160px;">
				<v-progress-circular indeterminate color="#8BC34A"></v-progress-circular>
			</div>
			<v-sheet v-else class="props-sheet">
				<div v-if="isNode">
					<div class="prop-item">
						<h2 class="prop-title" @click="goto(item.tag)">{{ nodeData.text }}</h2>
					</div>


				</div>
				<div v-else>
					<p>
						<span class="prop-name">Source:</span><a class="prop-link"  @click="goto(sourceTag)">{{ source }}</a>
					</p>
					<p>
						<span class="prop-name">Target:</span><a class="prop-link"  @click="goto(targetTag)">{{ target }}</a>
					</p>
					<p>
						<span class="prop-name">Relation:</span><a class="prop-nolink" style="cursor: default"  >{{ relation }}</a>
					</p>
          <p>
						<span class="prop-name">Attributes:</span><a class="prop-nolink" style="cursor: default"  >{{ attributes }}</a>
					</p>
				</div>

			</v-sheet>
		</div>
		<div v-else>
			<p class="nothing">Nothing selected.</p>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import * as _ from "lodash";
	import { IEdge, INode } from "yfiles";
	import { toShortForm } from "@/shared/ontology";

	@Component({})
	export default class ElementProperties extends Vue {
		get item() {
			if (_.isNil(this.$store.state.selectedItem)) {
				return null;
			}
			return this.$store.state.selectedItem;
		}

		get isWaiting() {
			return this.$store.state.waiting;
		}

		get relation() {
			return this.item.tag.text || "None"
		}
    get attributes(){
      return this.item.tag.attributes || [];
    }

		get itemPresent() {
			return !_.isNil(this.item);
		}



		get edgeData(): any {
			return this.$store.state.selectedItem.tag as any;
		}
    get nodeData(): any {
			return this.$store.state.selectedItem.tag as any;
		}

		get id() {
			return "none"
		}

		get source() {
			return toShortForm(this.item.sourceNode.tag.text);
		}
    get sourceTag() {
			return this.item.sourceNode.tag;
		}
    get targetTag() {
			return this.item.targetNode.tag;
		}

		get target() {
			return toShortForm(this.item.targetNode.tag.text);
		}

		get isEdge() {
			return _.isNil(this.item) ? false : IEdge.isInstance(this.item);
		}

		get isNode() {
			return _.isNil(this.item) ? false : INode.isInstance(this.item);
		}
    goto(id) {
      this.$emit("goto", id)
      console.log(id);
    }

	}
</script>

<style scoped>
	.nothing {
		color: dimgray;
		font-size: 14px;
		margin: 20px 15px;
	}

	.prop-name {
		color: dimgray;
		font-size: 14px;
		font-weight: bold;
		margin-right: 5px;
	}

	.prop-link {
		color: #568fbd;
		font-size: 14px;
		display: initial;
		margin: 0 0 0 -25px;
	}
  .prop-nolink {
		color: #696969;
		font-size: 14px;
		display: initial;
		margin: 0 0 0 -25px;
	}

	.props-sheet {
		color: dimgray;
		font-size: 14px;
		margin: 20px 15px;
		background-color: white;
	}

	.prop-title {
		color: #696969;
		font-size: 14px;
		margin: 10px 0;
	}

	.prop-item {
		margin: 2px 0;
	}
</style>
