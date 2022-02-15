import {  createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import Split from "split.js";

import { createRef, DynamicNode, DynamicProps, ValidConstructor, WithRef } from "./utils/dynamic-props";

// .gutter.gutter-horizontal {
//     width: 1px;
//     margin: 0 -5px;
//     border-left: 5px solid transparent;
//     border-right: 5px solid transparent;
//     cursor: col-resize;
// }

// .gutter.gutter-vertical {
//     height: 1px;
//     margin: -5px 0;
//     border-top: 5px solid transparent;
//     border-bottom: 5px solid transparent;
//     cursor: row-resize;
// }
interface SplitWindow {
	sizes?: number[];
	minSize?: number | number[];
	maxSize?: number;
	expandToMin?: boolean;
	gutterSize?: number;
	gutterAlign?: "start" | "center" | "end";
	snapOffset?: number;
	dragInterval?: number;
	direction?: "vertical" | "horizontal";
	cursor?: string;
    mode?: 'default' | 'skeleton',
	gutter?: (index: number, direction: "vertical" | "horizontal") => HTMLElement;
	elementStyle?: (dimension: "width" | "height", elementSize: number, gutterSize: number, index: number) => Object;
	gutterStyle?: (dimension: "width" | "height", gutterSize: number, index: number) => Object;
	onDrag?: any;
	onDragstart?: any;
	onDragend?: any;
	// collapse? changes the size of element at index to it's minSize
	collapsed?: number;
	destroy?: (preserveStyles: boolean, preserveGutters: boolean) => void;
}

export type SplitProps<T extends ValidConstructor = "div"> = {
	sizes?: number[];
	minSize?: number | number[];
	maxSize?: number;
	expandToMin?: boolean;
	gutterSize?: number;
	gutterAlign?: "start" | "center" | "end";
	snapOffset?: number;
	dragInterval?: number;
	direction?: "vertical" | "horizontal";
	cursor?: string;
    mode?:'default'|'skeleton',
	// Optional? function called to create each gutter element. The signature looks like this:
	gutter?: (index: number, direction: "vertical" | "horizontal") => HTMLElement;
	// Optional? function called setting the CSS style of the elements. The signature looks like this:
	elementStyle?: (dimension: "width" | "height", elementSize: number, gutterSize: number, index: number) => Object;
	gutterStyle?: (dimension: "width" | "height", gutterSize: number, index: number) => Object;
	// Callbacks? that can be added on drag (fired continously), drag start and drag end. If doing more than basic operations in onDrag, add a debounce function to rate limit the callback.
	onDrag?: any;
	onDragStart?: any;
	onDragEnd?: any;
	// collapse? changes the size of element at index to it's minSize
	collapsed?: number;
	destroy?: (preserveStyles: boolean, preserveGutters: boolean) => void;
	as?: T;
} & WithRef<T> &
	Omit<
		DynamicProps<T>,
		| "as"
		| "ref"
		| "sizes"
		| "minSize"
		| "maxSize"
		| "expandToMin"
		| "gutterSize"
		| "gutterAlign"
		| "snapOffset"
		| "dragInterval"
		| "direction"
		| "cursor"
        | "mode"
		| "gutter"
		| "elementStyle"
		| "gutterStyle"
		| "onDrag"
		| "onDragstart"
		| "onDragend"
		| "collapsed"
		| "destroy"
	>;

export function SplitWindow<V, T extends ValidConstructor = "div">(params: SplitProps<T>) {
	// const children = solidChildren(() => params.children);
	const [internalRef, setInternalRef] = createSignal<DynamicNode<T>>();
    if(params.mode === 'skeleton'){
        params.elementStyle= (dimension, size, gutterSize) => ({
                "flex-basis": "calc(" + size + "%)"
        });
		params.gutterStyle=(dimension, gutterSize) => ({
				"flex-basis": gutterSize + "px",
		});
    }
	const [local, others] = splitProps(params, [
		"sizes",
		"minSize",
		"maxSize",
		"expandToMin",
		"gutterSize",
		"gutterAlign",
		"snapOffset",
		"dragInterval",
		"direction",
		"cursor",
		"gutter",
		"elementStyle",
		"gutterStyle",
		"onDrag",
		"onDragStart",
		"onDragEnd",
		"collapsed",
		"destroy",
	]);
	let ref;
	onMount(() => {
	    ref = internalRef();
	});
	createEffect(() => {
		let split = Split(  ref.children , local);
		onCleanup(() => split.destroy());
	})
	createEffect(()=>{
		params.direction === 'horizontal' ? (
			Array.from(document.getElementsByClassName('gutter')).forEach((gutter)=>{
				if(gutter.classList.contains('gutter-enchanced-y'))
					gutter.classList.remove('gutter-enchanced-y')
				gutter.classList.add('gutter-enchanced-x');
			})
		) : (
			Array.from(document.getElementsByClassName('gutter')).forEach((gutter)=>{
				if(gutter.classList.contains('gutter-enchanced-x'))
					gutter.classList.remove('gutter-enchanced-x')
				gutter.classList.add('gutter-enchanced-y')
			})
		);
	})
	return (
		<Dynamic
			component={params.as ?? "div"}
			role="presentation"
            {...others}
			ref={createRef(params, (e) => {
				setInternalRef(() => e);
			})}
		/>
	);
}
