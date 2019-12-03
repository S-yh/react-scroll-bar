import {
    useEffect,
    useRef,
    useState
} from 'react';
import React from "react";
interface IProps {
    height:string,
    width:string,
    style?:object
}
import './index.css';

const ScrollBar: React.FC<IProps> = ({height, width, style, children}) => {
    let clickThumbAxis = 0, cursorDown = false
    const contentRef = useRef(null)
    const scrollBar = useRef(null)
    const bar = useRef(null)
    const thumb = useRef(null)
    const contentWidth = width.includes("%") ? '100%' : width
    const [thumbHeight, setThumbHeight] = useState(0)
    const [moveY, setMoveY] = useState(0)
    //获取滚动条宽度
    function getScrollWidth() {
        const outer: HTMLElement = document.createElement("div");
        outer.style.width = '100px';
        outer.style.visibility = "hidden";
        outer.style.position = "absolute";
        outer.style.top = "-9999px";
        document.body.appendChild(outer);
        const widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";
        const inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);
        const widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        return widthNoScroll - widthWithScroll;
    }
    //设置滚动条的高度
    function updateThumb() {
        let heightPercentage = (scrollBar.current.clientHeight * 100 / contentRef.current.scrollHeight);
        heightPercentage = heightPercentage > 100 ? 100 : heightPercentage
        setThumbHeight(heightPercentage);
    }

    function handleScroll() {
        //通过计算出来的百分比，然后对滚动条执行translate移动
        setMoveY(scrollBar.current.scrollTop * 100 / scrollBar.current.clientHeight)
    }

    function handleClick(e: any) {
        //获得点击位置与滚动框顶部之间的距离
        const offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY)
        //让点击位置处于滚动条的中间
        const thumbHalf = thumb.current.offsetHeight / 2;
        //计算出滚动条在滚动框的百分比位置
        const thumbPositionPercentage = (offset - thumbHalf) * 100 / scrollBar.current.offsetHeight;
        //通过改变scrollTop来操作。所有操作滚动条的最后一步都是通过handleScroll来实现
        scrollBar.current.scrollTop = (thumbPositionPercentage * scrollBar.current.scrollHeight / 100);
    }

    function handleMouseDown(e: any) {
        startDrag(e);
        clickThumbAxis = e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top);
    }

    function startDrag(e: React.MouseEvent<HTMLElement>) {
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
        cursorDown = true;
        document.addEventListener("mousemove", mouseMoveDocumentHandler);
        document.addEventListener("mouseup", mouseUpDocumentHandler);
        document.onselectstart = null;
    }

    function mouseMoveDocumentHandler(e: MouseEvent) {
        if (cursorDown === false) return;
        const prevPage = clickThumbAxis;
        if (!prevPage) return;
        //获得点击位置与 滚动框顶部 之间的距离
        const offset = (bar.current.getBoundingClientRect().top - e.clientY) * -1;
        //获得点击位置与 滚动条顶部 之间的距离
        const thumbClickPosition = thumb.current.offsetHeight - prevPage;
        //获得滚动条所处的百分比位置
        const thumbPositionPercentage = (offset - thumbClickPosition) * 100 / bar.current.offsetHeight;
        //计算出滚动条应该在滚动框中所处的位置，scrollTop
        scrollBar.current.scrollTop = thumbPositionPercentage * scrollBar.current.scrollHeight / 100;
		bar.current.style.opacity = "1"
    }

    function mouseUpDocumentHandler(e: MouseEvent) {
        cursorDown = false;
        clickThumbAxis = 0;
        document.removeEventListener("mousemove", mouseMoveDocumentHandler);
        document.onselectstart = null;
		bar.current.style.opacity = "0"
    }
    useEffect(() => {
        updateThumb()
    })
    return (
        <div className="scrollbar" style={{height, width, ...style}}>
            <div className="scrollbar-content" ref={scrollBar} style={{width: `calc(${contentWidth} + ${getScrollWidth()}px)`}} onScroll={handleScroll}>
                <div ref={contentRef}>
                    {children}
                </div>
            </div>
            {
                thumbHeight < 100 &&
                <div className='scrollbar-bar' ref={bar} onClick={handleClick}>
                    <div className="scrollbar-thumb" ref={thumb} style={{height: thumbHeight + "%", transform: "translateY(" + moveY + "%)"}} onMouseDown={handleMouseDown}/>
                </div>
            }
        </div>
    )
}
export default ScrollBar