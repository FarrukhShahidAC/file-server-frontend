import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Button, Link, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@material-ui/core';
import { ArrowBackIos, CloudDownload, Description, Folder } from '@material-ui/icons';

const PROTOCOL = 'http'
const IP = '192.168.1.23';
const PORT = 6969;

const BASE_URL = `${PROTOCOL}://${IP}:${PORT}`;


class App extends Component {

	constructor(props) {
		super(props)
		this.state = {
			url: [],
			items: [],
		}
	}

	fetchItems = () => {
		// console.log('urls', this.state.url)
		const url = this.state.url.join("/");
		axios
			.get(`${BASE_URL}/files?path=${url}`)
			.then(res => {
				// console.log('files', res.data);
				this.setState({ items: res.data });
			})
	}

	fetchFile = (url) => {
		const file = `${this.state.url.join("/")}/${url}`;
		const link = document.createElement('a');
		link.href = `${BASE_URL}/download?path=${file}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		/*axios
			.get(`http://localhost:8080/download?path=${file}`)
			.then(res => {
				console.log('downloading', res.data);
			})*/
	}

	componentDidMount() {
		this.fetchItems();
	}

	onClickItem = (e, url, isFile) => {
		if (isFile) {
			this.fetchFile(url)
		}
		else {
			const urls = this.state.url;
			urls.push(url);
			this.setState({ url: urls }, () => {
				this.fetchItems();
			})
		}
	}

	onClickBack = (e, url) => {
		const urls = this.state.url;
		urls.pop();
		this.setState({ url: urls }, () => {
			this.fetchItems();
		})
	}


	render() {
		// console.log('length',this.state.items.length)
		return (
			<div style={{
				background: 'linear-gradient(to right, #c31432,#240b36)',
				height: '100vh'
			}}>
			<div className="container">
				<List>
					<ListItem 
						button 
						component={Button} 
						className="text-white"
						onClick={(e) => this.onClickBack(e)}
						disabled={this.state.url.length === 0}>
						<ListItemIcon className="text-white"><ArrowBackIos /></ListItemIcon>
						<ListItemText primary="Back" />
						<ListItemSecondaryAction>
							<Typography className="text-white">
								AutoCanvas builds portal
							</Typography>
						</ListItemSecondaryAction>
					</ListItem>
					<div style={{ height: '80vh', overflowX: 'hidden', overflowY: 'visible' }}>
						{
							this.state.items.map((item, i) => {
								return (
									item.isFile ?
										<ListItem
											key={i}
											button
											className="text-white"
											divider
										>
											<ListItemIcon className="text-white"><Description /></ListItemIcon>
											<ListItemText primary={item.name} />
											<ListItemSecondaryAction>
												<Link
													component={IconButton}
													className="text-white"
													target="_blank"
													href={`${BASE_URL}/download?path=${this.state.url.join("/")}/${item.name}`}
												>
													<CloudDownload />
												</Link>
											</ListItemSecondaryAction>
										</ListItem> :
										<ListItem
											key={i}
											button
											divider
											className="text-white"
											onClick={(e) => this.onClickItem(e, item.name, false)}>
											<ListItemIcon className="text-white"><Folder /></ListItemIcon>
											<ListItemText primary={item.name} />
										</ListItem>

								)
							})
						}
					</div>
				</List>
			</div>
			</div>
		)
	}
}
export default App
