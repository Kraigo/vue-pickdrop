vue-pickdrop
=======

Vuejs directive for mobile drag and drop, pick and drop

[ONLINE DEMO](https://codepen.io/Kraigo/full/YVgmZE/)

## Usage

There are two directives: `v-pickdrag` and `v-pickdrop`.
For install in your project need import and use

```js
import pickdrop from 'vue-pickdrop'

Vue.use(pickdrop)
```


### v-pickdrag
- `v-pickdrag` takes data which pass to drag event
- When the element is drag then it is class `pickdrag`
- Can be add multiple tags for specific drop-container with one of tag (v-pickdrag.red.fruit)

```html
<div>
    <div class="item" v-pickdrag.red.fruit="'Apple'">
        <img src="icons/apple.svg" />
    </div>
</div>

<div>
    <div class="item" v-pickdrag.red="'Candy'">
        <img src="icons/candy.svg" />
    </div>
</div>

<div>
    <div class="item" v-pickdrag="'Carrot'">
        <img src="icons/carrot.svg" />
    </div>
</div>
```

### v-pickdrop
- `v-pickdrop` takes data which pass to drop event
- `@drop` event. Param object: {dropData, dragData}
- When drag element can be drop then it is class `pickdrop`
- Can be add multiple tags for specific drag-container with one of tag (v-pickdrop.fruit)


```html
<div class="dropitem" v-pickdrop="'Food'" @drop="dropHandler">
    <p>Food</p>
</div>
<div class="dropitem" v-pickdrop.fruit="'Fruit'" @drop="dropHandler">
    <p>Fruit</p>
</div>
<div class="dropitem" v-pickdrop.red="'Red'" @drop="dropHandler">
    <p>Red</p>
</div>
```
```js
methods: {
    dropHandler({dragData, dropData}) {
        alert(`Drag: ${dragData}\nDrop: ${dropData}`);
    },
}
```