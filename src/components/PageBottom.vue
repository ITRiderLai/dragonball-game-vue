<template>
    <div class="menu">
        <ul class="menu_list">
            <li class="menu_item" v-for="(item) in menu_icon" :key="item.id">
                <router-link v-bind:to="item.link"> 
                    <i class="icon" v-bind:style="item.pos"></i>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name:"PageBottom",
    data() {
        return {
            menu_icon:[
                {id:"name",link:"/home",pos:"background-position:-0.1rem -5.5rem"},
                {id:"form",link:"/form?id=0",pos:"background-position:-2.6rem -5.5rem"},
                {id:"instance",link:"/instance",pos:"background-position:-4.8rem -5.5rem"},
                {id:"adventure",link:"/adventure",pos:"background-position:-7.4rem -5.5rem"},
                {id:"event",link:"/event",pos:"background-position:-10rem -5.5rem"},
                {id:"shop",link:"/shop",pos:"background-position:-12.7rem -5.5rem"}
            ]
        }
    },
}
</script>

<style lang="less">
li{
    list-style: none;
}
.menu{
    position:fixed;
    left:0;
    bottom:0;
    width:100vw;
    height:2rem;
    background:url("/image/menu_bar.png") no-repeat;
    background-size:cover;
    z-index: 99;
    .menu_list{
        margin:0;
        padding:0 1.5rem;
        .menu_item{
            float:left;
            margin-left:0.52rem;
            .icon{
                display:block;
                width:2rem;
                height:2rem;
                line-height:40px;
                background:url("/image/home_icon.png") no-repeat;
                background-size:18rem;
            }
        }
        &:after{
            display:block;
            content:"";
            clear:both;
        }
    }
}

</style>