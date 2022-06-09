<template>
	<div>
		<div ref="leftPanel" class="left-panel">
			<div @click="toggleLeft()" id="leftHandle" class="left-handle">
				<v-icon class="handle-dots">mdi-dots-vertical</v-icon>
			</div>

			<a href="#">About</a>
			<a href="#">Services</a>
			<a href="#">Clients</a>
			<a href="#">Contact</a>
		</div>
		<div class="main-content" ref="main">
			<button @click="toggleLeft()">left</button>
			<button @click="toggleRight()">right</button>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a mauris mollis, pellentesque metus nec, fermentum nunc. Nunc tempor maximus erat, faucibus laoreet lorem finibus non. Aenean molestie tellus lacus, elementum porttitor nunc molestie in. Sed sollicitudin lacus eu lectus
				commodo sagittis. Nulla facilisi. Vivamus vitae nulla blandit, semper lorem non, viverra elit. Nunc maximus tellus vel diam mattis imperdiet. Ut aliquam molestie magna, sit amet euismod neque eleifend at. Vestibulum ut dictum neque. Donec nisl nisi, consequat fermentum ultricies
				eget, sagittis in ex.
			</p>
			<p>
				Suspendisse dapibus feugiat venenatis. Maecenas rhoncus elit a aliquam porttitor. Phasellus suscipit eget velit eget tincidunt. Sed non euismod nibh, vitae dapibus arcu. Nullam in tortor augue. Ut varius tortor id dapibus fermentum. Donec pretium sed quam ut varius. Vivamus malesuada
				feugiat mauris nec laoreet. Integer ac suscipit est, non scelerisque lectus.
			</p>
		</div>
		<div ref="rightPanel" class="right-panel">
			<div @click="toggleRight()" id="rightHandle" class="right-handle">
				<v-icon class="handle-dots">mdi-dots-vertical</v-icon>
			</div>

			<a href="#">About</a>
			<a href="#">Services</a>
			<a href="#">Clients</a>
			<a href="#">Contact</a>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({})
	export default class BasicView extends Vue {
		leftPanel!: HTMLDivElement;
		rightPanel!: HTMLDivElement;
		main!: HTMLDivElement;

		mounted() {
			this.leftPanel = this.$refs.leftPanel as HTMLDivElement;
			this.rightPanel = this.$refs.rightPanel as HTMLDivElement;
			this.main = this.$refs.main as HTMLDivElement;
		}

		toggleRight() {
			const isOpen = this.rightPanel.style.width === "250px";
			if (isOpen) {
				this.closeRight();
			} else {
				this.openRight();
			}
		}

		toggleLeft() {
			const isOpen = this.leftPanel.style.width === "250px";
			if (isOpen) {
				this.closeLeft();
			} else {
				this.openLeft();
			}
		}

		openRight() {
			this.rightPanel.style.width = "250px";
			this.main.style.marginRight = "250px";
		}

		closeRight() {
			this.rightPanel.style.width = "12px";
			this.main.style.marginRight = "0";
		}

		openLeft() {
			this.leftPanel.style.width = "250px";
			this.main.style.marginLeft = "250px";
		}

		closeLeft() {
			this.leftPanel.style.width = "12px";
			this.main.style.marginLeft = "0";
		}
	}
</script>
<style></style>
