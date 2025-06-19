//sourced from https://github.com/uiwjs/react-color/tree/main/packages/color-chrome
import React, { Fragment, useRef } from "react"
import {
  hsvaToRgbaString,
  color as handleColor,
  validHex,
  hexToHsva,
  hsvaToHex,
  hsvaToHexa
} from "@uiw/color-convert"
import Github, { GithubPlacement } from "@uiw/react-color-github"
import Saturation from "@uiw/react-color-saturation"
import Hue from "@uiw/react-color-hue"
import Alpha from "@uiw/react-color-alpha"
import EditableInput from "@uiw/react-color-editable-input"
import EditableInputRGBA from "@uiw/react-color-editable-input-rgba"
import EditableInputHSLA from "@uiw/react-color-editable-input-hsla"
import { useState } from "react"

import { EyeDropper, getIsEyeDropperSupported } from "./eyedropper"

const Chrome = React.forwardRef((props, ref) => {
  const {
    prefixCls = "w-color-chrome",
    className,
    style,
    color,
    rectProps = {},
    onChange,
    saturationRef = null,
    hueRef = null,
    ...other
  } = props
  const hsva =
    typeof color === "string" && validHex(color)
      ? hexToHsva(color)
      : color || { h: 0, s: 0, l: 0, a: 0 }
  const handleChange = hsv => onChange && onChange(handleColor(hsv))

  const labelStyle = { paddingTop: 6 }
  const inputStyle = { textAlign: "center", paddingTop: 4, paddingBottom: 4 }
  const wrapperStyle = {
    "--chrome-arrow-fill": "#333",
    "--chrome-arrow-background-color": "#e8e8e8",
    borderRadius: 0,
    flexDirection: "column",
    width: 230,
    padding: 0,
    ...style
  }
  const alphaStyle = {
    "--chrome-alpha-box-shadow": "rgb(0 0 0 / 25%) 0px 0px 1px inset",
    borderRadius: "50%",
    background: hsvaToRgbaString(hsva),
    boxShadow: "var(--chrome-alpha-box-shadow)"
  }
  const handleClickColor = hex => {
    let result = hexToHsva(hex)
    handleChange({ ...result })
  }
  const styleSize = { height: 14, width: 14 }
  const pointerProps = {
    style: { ...styleSize },
    fillProps: { style: styleSize }
  }

  return (
    <Github
      ref={ref}
      color={hsva}
      style={wrapperStyle}
      colors={undefined}
      className={[prefixCls, className].filter(Boolean).join(" ")}
      placement={GithubPlacement.TopLeft}
      {...other}
      addonAfter={
        <Fragment>
         <div ref={saturationRef}>
          <Saturation
            hsva={hsva}
            style={{ width: "100%", height: 130 }}
        
            onChange={newColor => {
              handleChange({ ...hsva, ...newColor, a: hsva.a })
            }}
          />
          </div>
          <div
            style={{
              padding: 15,
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            {getIsEyeDropperSupported() && (
              <EyeDropper onPickColor={handleClickColor} />
            )}
            <Alpha
                width={48}
                height={48}
                hsva={hsva}
                radius={2}
                style={{
                  borderRadius: "50%"
                }}
                bgProps={{ style: { background: "transparent" } }}
                innerProps={{
                  style: alphaStyle
                }}
                pointer={() => <Fragment />}
              />
            <div style={{ flex: 1, paddingLeft: '10px' }}>
                <div ref={hueRef}>
                  <Hue
                    hue={hsva.h}
                    style={{ width: "100%", height: 12, borderRadius: 2 }}
                    pointerProps={pointerProps}
                    bgProps={{
                      style: { borderRadius: 2 }
                    }}
                    onChange={newHue => {
                      handleChange({ ...hsva, ...newHue })
                    }}
                  />
                </div>
                <Alpha
                  hsva={hsva}
                  style={{ marginTop: 6, height: 12, borderRadius: 2 }}
                  pointerProps={pointerProps}
                  bgProps={{
                    style: { borderRadius: 2 }
                  }}
                  onChange={newAlpha => {
                    handleChange({ ...hsva, ...newAlpha })
                  }}
                />
            </div>
          </div>
          
        </Fragment>
      }
      rectRender={() => <Fragment />}
    />
  )
})

Chrome.displayName = "Chrome"

export default Chrome
