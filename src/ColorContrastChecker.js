import React, { useState, useEffect } from "react";
import tinycolor from "tinycolor2";
import "./ColorContrastChecker.css";

const ColorContrastChecker = () => {
	const [colorText, setColorText] = useState("#1e00ff");
	const [colorBackground, setColorBackground] = useState("#e8eefb");
	const [contrastRatio, setContrastRatio] = useState(null);
	const [labelColor, setLabelColor] = useState("#000000"); // Initial label text color
	const [suggestedTextColors, setSuggestedTextColors] = useState([]);
	const [suggestedBackgroundColors, setSuggestedBackgroundColors] = useState(
		[]
	);

	useEffect(() => {
		const textShades = generateSimilarShades(colorText);
		setSuggestedTextColors(textShades);

		const backgroundShades = generateSimilarShades(colorBackground);
		setSuggestedBackgroundColors(backgroundShades);
		calculateContrastRatio();
	}, [colorText, colorBackground]);

	const convertHEXToRGB = (colorValue) => {
		const red = parseInt(colorValue.substring(1, 3), 16);
		const green = parseInt(colorValue.substring(3, 5), 16);
		const blue = parseInt(colorValue.substring(5, 7), 16);
		return [red, green, blue];
	};

	const getRelativeLuminance = (color) => {
		const sRGB = color.map((val) => {
			const s = val / 255;
			return s < 0.03928 ? s / 12 / 92 : Math.pow((s + 0.055) / 1.055, 2.4);
		});
		return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
	};

	const calculateContrastRatio = () => {
		const color1RGB = convertHEXToRGB(colorText);
		const color2RGB = convertHEXToRGB(colorBackground);

		const luminance1 = getRelativeLuminance(color1RGB);
		const luminance2 = getRelativeLuminance(color2RGB);

		const light = Math.max(luminance1, luminance2);
		const dark = Math.min(luminance1, luminance2);
		const ratio = (light + 0.05) / (dark + 0.05);

		setContrastRatio(ratio.toFixed(1));

		if (ratio >= 4.5) {
			setLabelColor("#008100");
		} else {
			setLabelColor("#e32400");
		}
	};

	const calculateRating = (contrastVal) => {
		contrastVal = parseFloat(contrastVal) || 0;
		if (contrastVal >= 7) {
			// setLabelColor("#CCE8B5");
			// Set your styles or any actions accordingly
			return { label: "passes" };
		} else if (contrastVal >= 4.5) {
			// Set your styles or any actions accordingly
			return { label: "passes" };
		} else {
			// Set your styles or any actions accordingly
			return { label: "fails" };
		}
	};

	const calculateRatingLargeText = (contrastVal) => {
		contrastVal = parseFloat(contrastVal) || 0;
		if (contrastVal >= 4.5) {
			// Set your styles or any actions accordingly
			return { label: "Great contrast", backgroundColor: "#CCE8B5" };
		} else if (contrastVal >= 3) {
			// Set your styles or any actions accordingly
			return { label: "Good contrast", backgroundColor: "#fff2d5" };
		} else {
			// Set your styles or any actions accordingly
			return { label: "Bad contrast", backgroundColor: "#ffdad8" };
		}
	};

	const calculateRatingNormalText = (contrastVal) => {
		contrastVal = parseFloat(contrastVal) || 0;
		if (contrastVal >= 7) {
			// Set your styles or any actions accordingly
			return { label: "Great contrast", backgroundColor: "#CCE8B5" };
		} else if (contrastVal >= 4.5) {
			// Set your styles or any actions accordingly
			return { label: "Good contrast", backgroundColor: "#fff2d5" };
		} else {
			// Set your styles or any actions accordingly
			return { label: "Bad contrast", backgroundColor: "#ffdad8" };
		}
	};

	const handleColorSwap = () => {
		// Swap the colors
		setColorText(colorBackground);
		setColorBackground(colorText);
	};

	const handleColorSelection = (selectedColor, type) => {
		if (type === "text") {
			setColorText(selectedColor);
		} else if (type === "background") {
			setColorBackground(selectedColor);
		}
	};

	const generateSimilarShades = (baseColor) => {
		const numberOfShades = 6;
		let step = 7; // You can adjust the step size based on your preference

		const baseHSL = tinycolor(baseColor).toHsl();
		const brightness = tinycolor(baseColor).getBrightness();

		const shades = Array.from({ length: numberOfShades }, (_, index) => {
			let lightness;

			if (brightness < 128) {
				// Dark color
				lightness = baseHSL.l * 100 + index * step;
			} else {
				// Light color
				lightness = baseHSL.l * 100 - index * step;
			}

			lightness = Math.min(100, lightness); // Ensure it doesn't exceed 100
			lightness = Math.max(0, lightness); // Ensure it doesn't go below 0

			const adjustedColor = tinycolor({
				...baseHSL,
				l: lightness / 100,
			}).toHexString();
			return adjustedColor;
		});

		return shades;
	};

	// const handleColorSelection = (selectedColor) => {
	// 	// Set the selected color as the new value for the input
	// 	setColorText(selectedColor);
	// };
	const previewStyle = {
		color: colorText,
		backgroundColor: colorBackground,
	};

	const backgroundPreviewStyle = {
		color: colorBackground,
		backgroundColor: colorText,
	};

	const websitebackground = {
		backgroundColor: colorBackground,
	};

	const borderstyle = {
		borderColor: colorText,
	};

	const colorRating = calculateRating(contrastRatio);
	const largeTextRating = calculateRatingLargeText(contrastRatio);
	const normalTextRating = calculateRatingNormalText(contrastRatio);

	return (
		<div className="color-contrast-checker" style={websitebackground}>
			<div className="outer-container" style={borderstyle}>
				<div className="inner-container">
					<div className="container-title">
						<h1>Color Contrast Checker</h1>
					</div>
					<div className="container-body">
						<div className="container-top">
							<div className="input-container">
								<div className="input-group">
									<div className="input-group-item" id="subtitle">
										Text Color
									</div>
									<div className="input-group-item">
										<input
											type="color"
											value={colorText}
											onChange={(e) => setColorText(e.target.value)}
										/>
									</div>
									<div className="input-group-item">
										<div className="suggested-colors">
											{suggestedTextColors.map((suggestedColor, index) => (
												<div
													key={index}
													className="suggested-color"
													style={{ backgroundColor: suggestedColor }}
													onClick={() =>
														handleColorSelection(suggestedColor, "text")
													}
												></div>
											))}
										</div>
									</div>
									<div
										className="input-group-item"
										id="input-group-item-hexcode"
									>
										<input
											type="text"
											placeholder="Enter HEX code"
											value={colorText}
											onChange={(e) => setColorText(e.target.value)}
										/>
									</div>
								</div>
							</div>

							<div className="swap">
								<button className="swap-button" onClick={handleColorSwap}>
									<span class="material-symbols-outlined">sync</span>
									{/* Swap Colors */}
								</button>
							</div>
							<div className="input-container" id="input-container-two">
								<div className="input-group">
									<div className="input-group-item" id="subtitle">
										Background Color
									</div>
									<div className="input-group-item">
										<input
											type="color"
											value={colorBackground}
											onChange={(e) => setColorBackground(e.target.value)}
										/>
									</div>
									<div className="input-group-item">
										<div className="suggested-colors">
											{suggestedBackgroundColors.map(
												(suggestedColor, index) => (
													<div
														key={index}
														className="suggested-color"
														style={{ backgroundColor: suggestedColor }}
														onClick={() =>
															handleColorSelection(suggestedColor, "background")
														}
													></div>
												)
											)}
										</div>
									</div>
									<div
										className="input-group-item"
										id="input-group-item-hexcode"
									>
										<input
											type="text"
											placeholder="Enter HEX code"
											value={colorBackground}
											onChange={(e) => setColorBackground(e.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="container-three">
							{/* <label className="title"> Preview: </label> */}

							{contrastRatio !== null && (
								<div className="result">
									{/* <label>Minimum requirement: 4.5</label> */}
									<label id="subtitle">Score: {contrastRatio} </label>
									<label>
										Color pair{" "}
										<label className="score" style={{ color: labelColor }}>
											{colorRating.label}
										</label>{" "}
										WCAG requirements
									</label>
									<div className="preview-container">
										<div className="preview-group">
											<div
												className="preview-group-item"
												style={previewStyle}
												id="large-text"
											>
												<p>Preview for large text of size 18pt.</p>
											</div>
											<div className="preview-group-item">
												<div className="result-label">
													<div className="result-label-one">
														{largeTextRating.label}
													</div>
													<label className="result-label-two">
														Minimum score required: 3
													</label>
												</div>
											</div>
										</div>
										<div className="preview-group">
											<div
												className="preview-group-item"
												style={previewStyle}
												id="normal-text"
											>
												<p>Preview for normal text of size 12pt.</p>
											</div>
											<div className="preview-group-item">
												<div className="result-label">
													<div className="result-label-one">
														{normalTextRating.label}
													</div>
													<label className="result-label-two">
														Minimum score required: 4.5
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ColorContrastChecker;
