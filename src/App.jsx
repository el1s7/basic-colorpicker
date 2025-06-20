import { useEffect, useRef, useState } from "react";
import PWABadge from "./components/PWABadge.jsx";
import "./App.scss";
import Chrome from "./components/chrome.jsx";

import { useHotkeys } from "react-hotkeys-hook";

import {
	color as handleColor,
	validHex,
	hexToHsva,
	rgbStringToHsva,
	rgbaStringToHsva
} from "@uiw/color-convert";
import { isValidRgbOrRgba } from "./helpers/functions.js";


function App() {
	const DEFAULT_WHITE = {
		is_default: true,
		hexa: "#ffffffff",
		hex: "#ffffff",
		rgba: { r: 255, g: 255, b: 255, a: 1 },
		hsva: { a: 1, h: 0, s: 0, v: 100 },
		hsla: { a: 1, h: 0, s: 0, l: 100 },
	};

	const [color, setColor] = useState(DEFAULT_WHITE);
	const [history, setHistory] = useState([]);
	const [isMouseDown, setIsMouseDown] = useState(null);
	const [showHistory, setShowHistory] = useState(false);

	const saturationRef = useRef(null);
	const hueRef = useRef(null);
	const debounceTimerRef = useRef(0);

	const rgbaValue = `rgb(${color.rgba.r} ${color.rgba.g} ${color.rgba.b}${
		color.rgba.a == 1 ? "" : " / " + color.rgba.a.toFixed(2)
	})`;

	const debounce = (callback, wait) => {
		let timeoutId = null;
		return (...args) => {
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => {
				callback(...args);
			}, wait);
		};
	};

	useHotkeys(
		"ctrl+z",
		() => {
			if (history.length > 1) {
				const lastColor = history[history.length - 2];
				setHistory(history.filter((v, i) => i !== history.length - 1));
				setColor(lastColor);
			}
		},
		{
			'document': document.documentElement,
			'enableOnFormTags': true	
		},
		[history]
	);

	useHotkeys(
		"ctrl+h",
		(e) => {
			e.preventDefault();
			setShowHistory(!showHistory);
		},
		{
			'document': document.documentElement,
			'enableOnFormTags': true	
		},
		[showHistory]
	);

	useEffect(() => {
		const mouseDownHandler = (e) => {
			console.log("Mouse down?");
			clearTimeout(debounceTimerRef.current);

			setIsMouseDown(true);
		};

		const mouseUpHandler = (e) => {
			console.log("Mouse up?");
			setIsMouseDown(false);
		};

		const wheelHandler = (e) => {
			console.log("Mouse down?");
			setIsMouseDown(true);

			//Clear any previous timeout
			clearTimeout(debounceTimerRef.current);

			debounceTimerRef.current = setTimeout(()=>{
				setIsMouseDown(false);
			}, 2500);
		};

		const colorSlideRefElements = [saturationRef.current, hueRef.current];
		const hookEvents = {
			"mousedown": mouseDownHandler,
			"touchstart": mouseDownHandler
		};

		for (const colorSlideElement of colorSlideRefElements) {
			if (!colorSlideElement) {
				console.error(
					"Couldn't get ref to color silde element (for tracking mouse holding in order to save history)...",
					colorSlideElement
				);
				continue;
			}
			for (const hookEvent in hookEvents) {
				colorSlideElement.addEventListener(
					hookEvent,
					hookEvents[hookEvent]
				);
			}
		}

		if(hueRef.current){
			hueRef.current.addEventListener("wheel", wheelHandler);
		}

		window.addEventListener("mouseup", mouseUpHandler);
		window.addEventListener("touchend", mouseUpHandler);

		return () => {
			for (const colorSlideElement of colorSlideRefElements) {
				if (!colorSlideElement) {
					continue;
				}
				for (const hookEvent in hookEvents) {
					colorSlideElement.removeEventListener(
						hookEvent,
						hookEvents[hookEvent]
					);
				}
			}
			window.removeEventListener("mouseup", mouseUpHandler);
			window.removeEventListener("touchend", mouseUpHandler);

			if(hueRef.current){
				hueRef.current.removeEventListener("wheel", wheelHandler);
			}

		};
	}, []);

	useEffect(() => {
		if (
			((!isMouseDown && isMouseDown !== null) ||
				(isMouseDown == null && !color.is_default)) &&
			color &&
			color.hex
		) {
			
			setHistory((history) => {
				// skip in case no color changed
				if (
					history.length &&
					history[history.length - 1].hex === color.hex
				) {
					return history;
				}
				return [...history, color];
			});

		}
	}, [color, isMouseDown]);

	useEffect(() => {
		console.log("History: ", history);
		if (!window.localStorage.getItem("showTips") && history.length) {
			window.localStorage.setItem("showTips", true);
			setTimeout(() => {
				alert(
					'Tip: Press "CTRL+H" to see the history of colors you have picked :)'
				);
			}, 5000);
		}
	}, [history]);

	const handleHexColorPaste = (e) => {
		let pastedValue = e.clipboardData.getData("text");
		if (pastedValue && validHex(pastedValue)) {
			let convertedColor = hexToHsva(pastedValue);
			setColor(handleColor(convertedColor));
		} else {
			alert('Invalid hex color pasted: \n"' + pastedValue + '"');
		}
	};

	const handleRgbaColorPaste = (e) => {
		let pastedValue = e.clipboardData.getData("text");
		if(pastedValue && isValidRgbOrRgba(pastedValue)){
			let convertedColor = rgbaStringToHsva(pastedValue);
			setColor(handleColor(convertedColor));
		} else {
			alert('Invalid rgb color pasted: \n"' + pastedValue + '"');
		}
	};
	return (
		<>
			<div className="color-picker">
				<Chrome
					color={color.hsva}
					onChange={(color) => {
						setColor(color);
					}}
					saturationRef={saturationRef}
					hueRef={hueRef}
					style={{
						width: "100%", //230px ideally
					}}
				/>
				<div className="color-value-block">
					<div className="color-value">
						<input
							type="text"
							readOnly
							onPaste={handleHexColorPaste}
							name="color"
							onClick={(e) => {
								e.target.select();
							}}
							value={color.hex}
						/>
						<input
							type="text"
							readOnly
							onPaste={handleHexColorPaste}
							name="color"
							onClick={(e) => {
								e.target.select();
							}}
							value={color.hexa}
						/>
						<input
							type="text"
							readOnly
							name="color"
							onPaste={handleRgbaColorPaste}
							onClick={(e) => {
								e.target.select();
							}}
							value={rgbaValue}
						/>
					</div>
				</div>
			</div>

			{showHistory && (
				<div className="color-history">
					<div
						className="color-history-close"
						onClick={(e) => {
							setShowHistory(false);
						}}
					>
						&#x2715;
					</div>

					<div className="color-history-scroll">
						{[...history].reverse().map((v, i) => (
							<div
								className="color-history-line"
								style={{
									backgroundColor: v.hex,
								}}
								key={`history-line-` + i}
							>
								<span
									onClick={(e) => {
										var range = document.createRange();
										range.selectNode(e.target);
										window.getSelection().removeAllRanges();
										window.getSelection().addRange(range);
									}}
								>
									{v.hex}
								</span>
							</div>
						))}

						{!history.length ? (
							<div className="empty">Nothing here yet :)</div>
						) : null}
					</div>
				</div>
			)}
			<PWABadge />
		</>
	);
}

export default App;
