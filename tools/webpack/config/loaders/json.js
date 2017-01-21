export default function loadJSON() {
    return {
        test: /\.json$/, loaders: ["json-loader"]
    };
}
