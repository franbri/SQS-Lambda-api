const path = require("path");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    resolve: {
        modules: [
            'node_modules'
        ],
        extensions: ['.ts', '.tsx', '.js', '.json'],

    },
    output: {
        libraryTarget: "commonjs",
        path: path.join(__dirname, ".webpack"),
        filename: "handler.js"
    },
    target: "node",
    externals: {
        "aws-lambda": 'aws-lambda'
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                },
                exclude: {
                    and: [
                        /node_modules/,
                        path.resolve(__dirname, './tests/*')
                    ]
                }
            }
        ],

    },
    plugins: [
        new ZipPlugin({
            filename: require("./package").name + ".zip"
        })
    ]
};