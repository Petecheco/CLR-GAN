let curPage = 0;
let totalPages = 2;
let bCanScroll = true;

let scrollEvent = 0;

setTimeout(() => window.scrollTo(0,0), 150);

var scrollFunc = function (e) {
    e = e || window.event;

    if (e.wheelDelta) {
        console.log("IE、Opera、Safari、Chrome");
        console.log(e.wheelDelta);
        scrollEvent = e.wheelDelta;
    } else if (e.detail) {
        console.log("Firefox");
        console.log(e.detail);
        scrollEvent = e.detail * -1;
    }
    if (bCanScroll) {
        bCanScroll = false;
        if (scrollEvent < 0) {
            scrollDown();
        }
        else {
            scrollUp();
        }
        setTimeout("bCanScroll = true;", 400)
    }
}

function scrollDown() {
    if (curPage < totalPages) {
        ++curPage;
        scrollTo({
            top: document.getElementsByClassName("c-pg")[0].clientHeight * curPage,
            behavior: "smooth"
        });
    }
}

function scrollUp() {
    if (curPage > 0) {
        --curPage;
        scrollTo({
            top: document.getElementsByClassName("c-pg")[0].clientHeight * curPage,
            behavior: "smooth"
        });
    }
}

if (document.addEventListener) {
    document.addEventListener('DOMMouseScroll', scrollFunc, false);
}//W3C
window.onmousewheel = document.onmousewheel = scrollFunc;