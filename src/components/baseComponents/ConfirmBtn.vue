<template>
    <button id="ConfirmBtn">{{btnTxt}}</button>
</template>

<script>
export default {
    name:"ConfirmBtn",
    props:[
        "btnTxt"
    ],
    data() {
        return {
            
        }
    },
}
</script>

<style lang="less">
@import '../../css/mixin';
#ConfirmBtn{
    .wh(3.5rem,1.5rem);
    .font(0.6rem,white);
    line-height:1.5rem;
    text-shadow: 1px 1px black;
    background: url(/image/home_icon.png) no-repeat;
    background-size: 40rem;
    background-position: -26.4rem -7.5rem;
}
</style>

