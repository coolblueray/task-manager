# Welcome to Task Manager!

Hi! This is simple webapp **Task Manager** created using react JS, TypeScript, Tailwind CSS and IndexedDB. 

This webapp has ability to add and delete tasks on the fly and all added tasks will be stored in DB. IndexedDB is used for its simplicity and flexibility it provides on client side. 

You can play around with code and add more functionality.

### Installing on Windows 11
- You can download Portable Git from this [link](https://git-scm.com/download/win "link")
- You can download **NODE JS** and **NPM** from this [link](https://nodejs.org/en/download/package-manager "link")

### Installing on Debian Linux or Ubuntu Linux
- Install GIT using this command 
``` bash
	sudo apt-get install git
```
- Install **Node JS** and **NPM** from this [link](https://nodejs.org/en/download/package-manager "link")

-  **Note : -** If you face SSL issue, you can modify "package.json" to add this ```NODE_OPTION=--openssl-legacy-provider``` in scripts sections.
It should look like this.
```bash
"scripts": {
    "start": "NODE_OPTION=--openssl-legacy-provider react-scripts start",
}
```
# Build and Run with NPM

Currently it is built with **Node.JS** version **18.20.4**. and all Dependency are defined in *package.json*.

 - For running and starting this webapp, you can use following command:
	``` bash 
	npm start
	```
 - For building, you use can following command. 
	 ```bash
	 npm run build
	 ``` 
	 it will compile all files and put it into ```./build ``` directory.
	 
-  After building, for running this webapp with static server, you can use ``` serve ``` package.
	``` bash 
	npm install -G server
	serve -s build
	```
- If you come across any issue, please log it into issue tracker. I'll look into it and fix it asap.