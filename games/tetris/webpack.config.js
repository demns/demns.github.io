/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
		target: 'web',
		mode: isProduction ? 'production' : 'development',
		devtool: 'source-map',
		entry: './src/application.js',
		output: {
			path: path.resolve(__dirname, 'www'),
			filename: isProduction ? 'bundle.min.js' : 'bundle.js',
			publicPath: '',
			clean: true
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css'
			}),
			new HtmlWebpackPlugin({
				title: 'WebGL Tetris',
				filename: 'index.html'
			})
		],
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [
						path.resolve(__dirname, 'src')
					],
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', {
									targets: {
										browsers: ['last 2 versions', 'not dead']
									}
								}]
							]
						}
					}
				},
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader'
					]
				}
			]
		},
		performance: {
			hints: false
		},
		devServer: {
			static: {
				directory: path.join(__dirname, 'www')
			},
			compress: true,
			port: 8000
		}
	};
};
