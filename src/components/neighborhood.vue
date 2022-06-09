<template>
    <div style="margin: 20px;">
        <div v-if="incoming.length === 0 && outgoing.length === 0" class="neighborhood-info">The neighborhood is shown if the hovered or selected item is a node.</div>
        <div v-if="incoming.length>0" class="section">Incoming links:</div>
        <ul>
            <li class="list-item" v-for="item in incoming"><span @click="goto(item.id)" class="search-item">{{item.name}}</span></li>
        </ul>
        <div class="section"  v-if="outgoing.length>0">Outgoing links:</div>
        <ul>
            <li class="list-item" v-for="item in outgoing"><span @click="goto(item.id)" class="search-item">{{item.name}}</span></li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import * as _ from "lodash";
    import {toShortForm} from "@/shared/ontology";

    @Component({})
    export default class Neighborhood extends Vue {
        get incoming() {
            if (_.isNil(this.$store.state.neighbors)) {
                return [];
            }
            return _.uniq(this.$store.state.neighbors.incoming).map((b:any) => {
                return {
                    name:b.text,
                    id: b,
                }
            });
        }

        get outgoing() {
            if (_.isNil(this.$store.state.neighbors)) {
                return [];
            }
            return _.uniq(this.$store.state.neighbors.outgoing).map((b:any) => {
                return {
                    name: b.text,
                    id: b,
                }
            });
        }
        goto(id) {
            this.$emit("goto", id)
        }
    }
</script>

<style scoped>
.section{
    color: #568fbd;
    font-weight: bold;
    margin: 10px 0;
    font-size: 14px;
}
.neighborhood-info {
    font-size: 14px;
    color: dimgray;
    display: initial;
}
</style>
