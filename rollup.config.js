import withSolid from "rollup-preset-solid";
import css from 'rollup-plugin-css-only'

export default withSolid({
  input: "src/index.tsx",
  plugins: [
    css({ output: 'style.css' })
  ]
});
