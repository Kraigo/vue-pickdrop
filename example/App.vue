<template>
    <div class="container">
        <button @click="hide = !hide">{{hide ? 'show' : 'hide' }}</button>
        <p>
            All is food, but
            <br> Apple is
            <b>red</b> and
            <b>fruit</b>
            <br> Candy is
            <b>red</b>
        </p>
        <div class="dropzone" v-if="hide == false">
    
            <div>
                <div class="item" v-pickdrag.red.fruit="'Apple'">
                    <span class="image apple"></span>
                </div>
            </div>
    
            <div>
                <div class="item" v-pickdrag.red="'Candy'">
                    <span class="image candy"></span>
                </div>
            </div>
    
            <div>
                <div class="item" v-pickdrag="'Carrot'">
                    <span class="image carrot"></span>
                </div>
            </div>
    
        </div>
        <div v-if="hide == false">
            <div class="dropitem" v-pickdrop="'Food'" @drop="dropHandler">
                <p>Food</p>
            </div>
            <div class="dropitem" v-pickdrop.fruit="'Fruit'" @drop="dropHandler">
                <p>Fruit</p>
            </div>
            <div class="dropitem" v-pickdrop.red="'Red'" @drop="dropHandler">
                <p>Red</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            hide: false
        }
    },
    methods: {
        dropHandler({ dragData, dropData }) {
            alert(`Drag: ${dragData}\nDrop: ${dropData}`);
        }
    }
}
</script>

