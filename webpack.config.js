const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, "./dist"),
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /(\.js|\.jsx|\.ts|\.tsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader'
                },{
                    loader: "ts-loader"
                }]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    externals: { // 定义外部依赖，避免把react和react-dom打包进去
        react: {
            root: "React",
            commonjs2: "react",
        },
        "react-dom": {
            root: "ReactDOM",
            commonjs2: "react-dom"
        }
    }
}