const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    devServer: {
        historyApiFallback: true,
    },
    entry: {
        index: "./src/index.js"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js?$/, // This will apply to both .js and .jsx files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', ['@babel/preset-react', {
                            runtime: "automatic"
                        }]],
                    },
                },
            },
            {
                exclude: /node_modules/,
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "../manifest.json" },
            ],
        }),
        ...getHtmlPlugins(["index"]),
    ],
    resolve: {
        extensions: [".js"],
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "Browser Notes",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}