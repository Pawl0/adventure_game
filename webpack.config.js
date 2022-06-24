const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/game.ts',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
            },
        ],
    },
    resolve: {
        extensions: ['ts', '.js'],
    },
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, 'dist'),
    },
    watch: true
};