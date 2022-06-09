<template>
    <div>
        <v-text-field class="search-box" label="" light outlined dense v-model="term" @keyup="search()"></v-text-field>
        <ul class="results">
            <li class="list-item" v-for="item in items"><span @click="goto(item.id)" class="search-item">{{item.name}}</span></li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import * as _ from "lodash";
    import {toShortForm} from "@/shared/ontology";

    @Component({})
    export default class Search extends Vue {
        term: string = null;

        get items() {

            if (_.isNil(this.$store.state.searchResults)) {
                return [];
            }
            return this.$store.state.searchResults.map(b => {
                return {name: b.text, id: b}
            });
        }

        search() {
            if (_.isNil(this.term) || this.term.trim().length === 0) {
                this.$emit("search", null);
                return;
            }
            this.$emit("search", this.term);
        }

        goto(id) {
            this.$emit("goto", id)
        }
    }
</script>

<style scoped>

    .search-box{
        margin: 10px 0 !important;
    }
    .results {
        max-height: 600px;
        overflow: scroll;
    }
</style>
