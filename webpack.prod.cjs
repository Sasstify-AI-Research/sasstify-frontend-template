const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        index: path.resolve(__dirname, './src/main.tsx')
    },
    output: {
        filename: 'static/js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'static/images/[name][ext]'
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env',
                            ['@babel/preset-react', { 'runtime': 'automatic' }],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            template: 'index.webpack.html',
            chunks: ['index'],
            filename: 'index.html',
            inject: 'body'
        }),
        new htmlWebpackPlugin({
            template: 'index.webpack.html',
            chunks: ['index'],
            filename: 'dashboard/index.html',
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash].min.css",
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: 'public/robots.txt', to: 'robots.txt' },
              { from: 'public/favicon.ico', to: 'favicon.ico' },
            ],
          }),
        //new BundleAnalyzerPlugin()
    ],
    performance: {
        maxEntrypointSize: 244000, // 244 KiB
        maxAssetSize: 244000,
        hints: 'warning', // or 'error' to enforce
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 20000,
            maxSize: 250000, // Adjust size limits
            automaticNameDelimiter: "-",
            cacheGroups: {
                header: {
                    test: /[\\/]src[\\/]components[\\/]header[\\/]/, // Match Header component
                    name: "header", // Output as header.[hash].js
                    chunks: "all",
                    enforce: true,
                },
                footer: {
                    test: /[\\/]src[\\/]components[\\/]footer[\\/]/, // Match Footer component
                    name: "footer", // Output as footer.[hash].js
                    chunks: "all",
                    enforce: true,
                },
                ui: {
                    test: /[\\/]src[\\/]components[\\/]ui[\\/]/, // Match UI components (buttons, modals)
                    name: "ui", // Output as ui.[hash].js
                    chunks: "all",
                    enforce: true,
                },
                // Extract global.css into a common chunk
                globalStyles: {
                    name: 'global',
                    test: (module, chunks) =>
                        module.type === 'css/mini-extract' &&
                        module.identifier().includes('global.css'),
                    chunks: 'all',
                    enforce: true,
                    priority: 20,
                },
                styles: {
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 10,
                    name: 'styles', // Output as styles.[hash].js
                    reuseExistingChunk: true, // Reuse existing styles chunks
                }

            }
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // ✅ Remove console logs
                    },
                    output: {
                        comments: false, // ✅ Remove comments
                    },
                },
            }),
            new CssMinimizerPlugin(), // Minifies CSS
        ],
        usedExports: true, // Enable tree shaking
    },
    devtool: false
};
