# Usage of custom SVG icons with MUI's SvgIcon component

Utilizing MUI's SvgIcon component to allow for custom SVG icons to be used in a way that is similar to MUI's built-in icons.

## Custom SVG icons

The custom SVG icons used in this project should always be designed to a standard <strong>18px</strong> wide within a viewBox of 0 0 24 24 (x: 0, y: 0, width: 24px, height: 24px). This ensures that they are consistent. The size of MUI's built-in icons are between 16px and 22px.  Be sure to not to include 'fill' or 'stroke' attributes in the final SVG path.

## How to use custom SVG icons

To use a custom SVG icon, simply copy/paste the "< path >" into the component as a child of SvgIcon. You can also pass other props, such as color and fontSize, to style the icon just like MUI's built-in icons.

## Creating a custom SVG icon

Requirements:
  - Inkscape
    - step by step guide in progress... 
    - in the meantime, Rubin will be happy to help you with this
  - [SVGOMG](https://jakearchibald.github.io/svgomg/)
    - This online tool is used to optimize the SVG.
    - Set 'Number Precision' to 2
    - Set 'Transform Precision' to 0 (SVG should be centered in the viewBox already - x: 0, y: 0)
    - Select all radio buttons except:
      - Show original
      - Remove XMLNS
      - Prefer viewBox to width/height

  - Total time to create a custom SVG icon: ~5 minutes